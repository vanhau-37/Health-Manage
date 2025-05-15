using AutoMapper;
using FuzzySharp;
using health_backend.Data;
using health_backend.Models;
using health_backend.Models.Dtos;
using health_backend.Models.EntityModels;
using health_backend.Models.RequestModels;
using health_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using static health_backend.Services.Implementations.VertexAiService;

namespace health_backend.Services.Implementations
{
	public class DiagnosesService : IDiagnosesService
	{
		private readonly HealthDbContext _dbContext;
		private readonly IMapper _mapper;
		private readonly IMemoryCache _memoryCache;
		private const string cacheKey = "SymptomList";
		public DiagnosesService(HealthDbContext dbContext, IMapper mapper, IMemoryCache memoryCache)
		{
			_dbContext = dbContext;
			_mapper = mapper;
			_memoryCache = memoryCache;
		}

		public async Task<BaseResponseModel> DiagnosisDisease(CreatedHealthStatusModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var listDisease = _mapper.Map<List<DiseaseDto>>(await _dbContext.Diseases
					.Include(x => x.ListSymptom)
					.ToListAsync());
				var diagnosis = listDisease.Select(disease => new
				{
					detailDisease = disease,
					matchCount = disease.ListSymptom.Count(s => model.ListIdStatus.Contains(s.Id)),
				}).OrderByDescending(x => x.matchCount).FirstOrDefault();

				if (diagnosis == null || diagnosis.matchCount < 3)
				{
					response.Status = false;
					response.Message = "Không xác định được bệnh nào phù hợp.";
					return response;
				}

				var isExistDiagnosis = await _dbContext.Diagnoses
					.Where(d => d.HealthStatusId == model.Id)
					.FirstOrDefaultAsync();

				if (isExistDiagnosis != null)
				{
					isExistDiagnosis.DiseaseId = diagnosis.detailDisease.Id;

					_dbContext.Diagnoses.Update(isExistDiagnosis);
					_dbContext.SaveChanges();
				}
				else
				{
					var newDiagnosis = new Diagnosis
					{
						HealthStatusId = model.Id,
						DiseaseId = diagnosis.detailDisease.Id,
					};
					_dbContext.Diagnoses.Add(newDiagnosis);
					_dbContext.SaveChanges();
				}

				response.Status = true;
				response.Message = "Success";
				//response.Data = diagnosis;

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}
		
		public async Task<BaseResponseModel> DiagnosisDiseaseCozeAI(string description)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var listSymptoms = new List<string>();
				if (_memoryCache.TryGetValue(cacheKey, out List<string> cacheSymptoms))
				{
					listSymptoms = cacheSymptoms;
				}
				else
				{
					listSymptoms = await _dbContext.Symptoms.OrderBy(x => x.Name.ToLower()).Select(x => x.Name.ToLower()).ToListAsync();
					_memoryCache.Set(cacheKey, listSymptoms, TimeSpan.FromMinutes(10));
				}

				char[] delimiters = { ' ', ',', '.', ';', ':', '!', '?' };
				var words = description.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
				var usefulWords = words.Where(w => listSymptoms.Any(s => s.Contains(w.ToLower()))).ToList();
				var reverseUsefulWords = usefulWords.Reverse<string>().ToList();
				var input = string.Join(" ", usefulWords);
				var reverseInput = string.Join(" ", reverseUsefulWords);

				// Dùng fuzzy matching để lấy ra các triệu chứng phù hợp
				var matches1 = listSymptoms
					.Select(symptom => new
					{
						Name = symptom.ToLower(),
						Score = Fuzz.PartialRatio(input, symptom)
					})
					.Where(x => x.Score >= 50)
					.OrderByDescending(x => x.Score)
					.Take(6)
					.OrderBy(x => x.Name)
					.ToList();

				var matches2 = listSymptoms
					.Select(symptom => new
					{
						Name = symptom.ToLower(),
						Score = Fuzz.PartialRatio(reverseInput, symptom)
					})
					.Where(x => x.Score >= 50)
					.OrderByDescending(x => x.Score)
					.Take(6)
					.OrderBy(x => x.Name)
					.ToList();

				var matches = new List<string>();
				foreach (var match in matches1.Concat(matches2))
				{
					if (match.Score == 100 && !matches.Any(m => m == match.Name))
					{
						matches.Add(match.Name);
					}
				}

				var commonNames = matches1.Select(m => m.Name)
					.Intersect(matches2.Select(n => n.Name));
				foreach (var name in commonNames)
				{
					var score1 = matches1.First(m => m.Name == name).Score;
					var score2 = matches2.First(m => m.Name == name).Score;
					if ((score1 >= 80 || score2 >= 80) && !matches.Any(m => m == name))
					{
						matches.Add(name);
					}
				}

				var listDisease = _mapper.Map<List<DiseaseDto>>(await _dbContext.Diseases
					.Include(x => x.ListSymptom)
					.ToListAsync());
				var diagnosis = listDisease.Select(disease => new
				{
					detailDisease = disease,
					matchCount = disease.ListSymptom.Count(s => matches.Contains(s.Name.ToLower())),
				}).OrderByDescending(x => x.matchCount).FirstOrDefault();

				if (diagnosis == null || diagnosis.matchCount < 2)
				{
					response.Status = false;
					response.Message = "Không xác định được bệnh nào phù hợp.";
					return response;
				}

				response.Status = true;
				response.Message = "Success";
				response.Data = diagnosis;

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		
	}
}
