using Google.Cloud.AIPlatform.V1;
using Google.Protobuf.WellKnownTypes;
using Google.Apis.Auth.OAuth2;
using Grpc.Auth;
using FuzzySharp;
using health_backend.Models.RequestModels;
using health_backend.Models;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using health_backend.Data;
using Microsoft.Extensions.Caching.Memory;
using Grpc.Core;
using Grpc.Net.Client;
using health_backend.Models.EntityModels;
using System.Text.RegularExpressions;

namespace health_backend.Services.Implementations
{
	public class VertexAiService
	{
		public class MatchResult
		{
			public string Name { get; set; }
			public int Score { get; set; }
		}

		private readonly PredictionServiceClient _client;
		private readonly string _endpointName;

		private readonly HealthDbContext _dbContext;
		private readonly IMapper _mapper;
		private readonly IMemoryCache _memoryCache;
		private const string cacheKey = "SymptomList";

		public VertexAiService(IConfiguration configuration, HealthDbContext dbContext, IMapper mapper, IMemoryCache memoryCache)
		{
			_dbContext = dbContext;
			_mapper = mapper;
			_memoryCache = memoryCache;

			var keyPath = configuration["GoogleCloud:KeyFile"]; // Đường dẫn file key.json
			var projectId = configuration["GoogleCloud:ProjectId"];
			var location = configuration["GoogleCloud:Location"]; 
			var endpointId = configuration["GoogleCloud:EndpointId"];

			var credential = GoogleCredential.FromFile(keyPath);

			_client = new PredictionServiceClientBuilder
			{
				ChannelCredentials = ChannelCredentials.Create(
					new SslCredentials(),
					GoogleGrpcCredentials.ToCallCredentials(credential)
				)
			}.Build();

			_endpointName = EndpointName.Format(projectId, location, endpointId);
		}

		public async Task<BaseResponseModel> DiagnosisDiseaseAutoMLTable(CreateHealthStatusAutoMLTable model)
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

				var words = model.Status.Split(' ', StringSplitOptions.RemoveEmptyEntries);
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

				var matches = new List<MatchResult>();
				foreach(var match in matches1.Concat(matches2))
				{
					if (match.Score == 100 && !matches.Any(m => m.Name == match.Name))
					{
						matches.Add(new MatchResult{ Name = match.Name,Score = match.Score});
					}
				}

				var commonNames = matches1.Select(m => m.Name)
					.Intersect(matches2.Select(n => n.Name));
				foreach(var name in commonNames)
				{
					var score1 = matches1.First(m => m.Name == name).Score;
					var score2 = matches2.First(m => m.Name == name).Score;
					if((score1 >= 75 || score2 >= 75) && !matches.Any(m => m.Name == name))
					{
						matches.Add(new MatchResult { Name = name, Score = Math.Max(score1,score2) });
					}
				}
				// Gán vào PredictRequest
				var predictInput = new DiagnosisRequestModel
				{
					Symptom1 = matches.Count > 0 ? matches[0].Name : "",
					Symptom2 = matches.Count > 1 ? matches[1].Name : "",
					Symptom3 = matches.Count > 2 ? matches[2].Name : "",
					Symptom4 = matches.Count > 3 ? matches[3].Name : "",
					Symptom5 = matches.Count > 4 ? matches[4].Name : "",
					Symptom6 = matches.Count > 5 ? matches[5].Name : "",
				};

				// Gọi dự đoán
				var instance = new Google.Protobuf.WellKnownTypes.Struct
				{
					Fields =
					{
						{ "Symptom_1", Google.Protobuf.WellKnownTypes.Value.ForString(predictInput.Symptom1) },
						{ "Symptom_2", Google.Protobuf.WellKnownTypes.Value.ForString(predictInput.Symptom2) },
						{ "Symptom_3", Google.Protobuf.WellKnownTypes.Value.ForString(predictInput.Symptom3) },
						{ "Symptom_4", Google.Protobuf.WellKnownTypes.Value.ForString(predictInput.Symptom4) },
						{ "Symptom_5", Google.Protobuf.WellKnownTypes.Value.ForString(predictInput.Symptom5) },
						{ "Symptom_6", Google.Protobuf.WellKnownTypes.Value.ForString(predictInput.Symptom6) },
					}
				};

				var instances = new List<Google.Protobuf.WellKnownTypes.Value>
				{
					Google.Protobuf.WellKnownTypes.Value.ForStruct(instance)
				};
				var request = new PredictRequest
				{
					Endpoint = _endpointName, // Đây phải là string dạng "projects/{projectId}/locations/{location}/endpoints/{endpointId}"
					Instances = { instances }, // `instances` là List<Value>, không phải Struct[]
				};

				var responsePredict = await _client.PredictAsync(request);
				var prediction = responsePredict.Predictions.First().StructValue;

				var displayNames = prediction.Fields["classes"].ListValue.Values.Select(v => v.StringValue).ToList();
				var confidences = prediction.Fields["scores"].ListValue.Values.Select(v => v.NumberValue).ToList();

				var maxIndex = confidences.IndexOf(confidences.Max());

				var result = new DiagnosisResult
				{
					Disease = displayNames[maxIndex],
					Confidence = (float)confidences[maxIndex]
				};

				if (result.Confidence < 0.5)
				{
					response.Status = false;
					response.Message = "Không tìm được bênh dựa trên mô tả này";
					response.Data = new { matches, listSymptoms };
				}
				else
				{
					var diseaseDetail = await _dbContext.Diseases
						.Where(d => d.Name == result.Disease)
						.FirstOrDefaultAsync();
					if (diseaseDetail != null)
					{
						var isExistDiagnosis = await _dbContext.Diagnoses
							.Where(d => d.HealthStatusId == model.Id)
							.FirstOrDefaultAsync();
						if (isExistDiagnosis != null)
						{
							isExistDiagnosis.DiseaseId = diseaseDetail.Id;

							_dbContext.Diagnoses.Update(isExistDiagnosis);
							_dbContext.SaveChanges();
						}
						else
						{
							var newDiagnosis = new Diagnosis
							{
								HealthStatusId = model.Id,
								DiseaseId = diseaseDetail.Id,
							};
							_dbContext.Diagnoses.Add(newDiagnosis);
							_dbContext.SaveChanges();
						}
					}

					response.Status = true;
					response.Message = "Success";
					response.Data = new { result, matches };

				}

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
