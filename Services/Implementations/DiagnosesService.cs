using AutoMapper;
using health_backend.Data;
using health_backend.Models;
using health_backend.Models.Dtos;
using health_backend.Models.EntityModels;
using health_backend.Models.RequestModels;
using health_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace health_backend.Services.Implementations
{
	public class DiagnosesService : IDiagnosesService
	{
		private readonly HealthDbContext _dbContext;
		private readonly IMapper _mapper;
		public DiagnosesService(HealthDbContext dbContext, IMapper mapper, IMemoryCache memoryCache)
		{
			_dbContext = dbContext;
			_mapper = mapper;
		}

		public async Task<BaseResponseModel> DiagnosisDisease(CreatedHealthStatusModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var listDisease = _mapper.Map<List<DiseaseDto>>(await _dbContext.Diseases.Include(x => x.ListSymptom).ToListAsync());
				var diagnosis = listDisease.Select(disease => new
				{
					detailDisease = disease,
					matchCount = disease.ListSymptom.Count(s => model.ListIdStatus.Contains(s.Id)),
				}).OrderByDescending(x => x.matchCount).FirstOrDefault();

				if (diagnosis == null || diagnosis.matchCount == 0)
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

		
	}
}
