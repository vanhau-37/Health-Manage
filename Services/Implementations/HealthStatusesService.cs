using AutoMapper;
using health_backend.Data;
using health_backend.Models;
using health_backend.Models.Dtos;
using health_backend.Models.EntityModels;
using health_backend.Models.RequestModels;
using health_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Threading.Tasks;

namespace health_backend.Services.Implementations
{
	public class HealthStatusesService : IHealthStatusService
	{
		private readonly HealthDbContext _dbContext;
        private readonly IMapper _mapper;
        public HealthStatusesService(HealthDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
			_mapper = mapper;
        }

		public async Task<BaseResponseModel> CreatedHealthStatus(int userId, CreatedHealthStatusModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var newHealthStatus = new HealthStatus
				{
					Weight = model.Weight,
					Height = model.Height,
					Temperature = model.Temperature,
					ListIdStatus = model.ListIdStatus,
					UserId = userId,//lay o controller
				};
				_dbContext.HealthStatuses.Add(newHealthStatus);
				await _dbContext.SaveChangesAsync();

				response.Status = true;
				response.Message = "Success";
				response.Data = newHealthStatus;

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> CreatedHealthStatusAutoMLTable(int userId, CreateHealthStatusAutoMLTable model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var newHealthStatus = new HealthStatus
				{
					Weight = model.Weight,
					Height = model.Height,
					Temperature = model.Temperature,
					Status = model.Status,
					UserId = userId,//lay o controller
				};
				_dbContext.HealthStatuses.Add(newHealthStatus);
				await _dbContext.SaveChangesAsync();

				response.Status = true;
				response.Message = "Success";
				response.Data = newHealthStatus;

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> DeletedHealthStatus(int id)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var healthStatusDelete = await _dbContext.HealthStatuses.Where(x => x.Id == id).FirstOrDefaultAsync();
				if (healthStatusDelete == null)
				{
					response.Status = false;
					response.Message = "Du lieu khong ton tai";
					return response;
				}

				_dbContext.HealthStatuses.Remove(healthStatusDelete);
				await _dbContext.SaveChangesAsync();
				response.Status = true;
				response.Message = "Success";
				response.Data = healthStatusDelete;

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> GetHealthStatuses(int pageIndex, int pageSize)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var healthStatusCount = await _dbContext.HealthStatuses.CountAsync();
				var healthStatusList = await _dbContext.HealthStatuses
					.OrderByDescending(x => x.Id)
					.Skip(pageSize * pageIndex).Take(pageSize)
					.Include(u => u.User)
					.Include(hs => hs.Diagnosis)
					.ThenInclude(d => d.Disease) 
					.ToListAsync();

				var symptomList = await _dbContext.Symptoms.ToListAsync();

				var listDetailHS = healthStatusList.Select( healthStatus =>
				{
					HealthStatusDetail detailHealthStatus = new HealthStatusDetail();
					_mapper.Map(healthStatus, detailHealthStatus);

					detailHealthStatus.DiagnosisOfDisease = healthStatus.Diagnosis != null 
					? healthStatus.Diagnosis.Disease.Name : null;
					return detailHealthStatus;
				});

				response.Status = true;
				response.Message = "Success";
				response.Data = new { HealthStatuses = listDetailHS, TotalPage =Math.Ceiling((float)healthStatusCount/pageSize) };

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}
		
		public async Task<BaseResponseModel> GetHealthStatusesById(int id, int pageIndex, int pageSize, DateTime? from, DateTime? to)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var healthStatusList = new List<HealthStatus>();
		
				healthStatusList = await _dbContext.HealthStatuses
					.Where(x => x.UserId == id)
					.OrderByDescending(x => x.Id)
					.Skip(pageSize * pageIndex).Take(pageSize)
					.Include(hs => hs.Diagnosis)
					.ThenInclude(d => d.Disease)
					.ToListAsync();

				if (from.HasValue)
				{
					healthStatusList = healthStatusList
					.Where(x => x.CreateDate >= from)
					.ToList();
				}
				if (to.HasValue)
				{
					healthStatusList = healthStatusList
					.Where(x => x.CreateDate <= to)
					.ToList();
				}

				var healthStatusCount = 0;
				if(healthStatusList != null && healthStatusList.Count > 0)
				{
					healthStatusCount = healthStatusList.Count();
				}
	
				var symptomList = await _dbContext.Symptoms.ToListAsync();

				var dtoList = healthStatusList.Select( healthStatus =>
				{
					var dto = _mapper.Map<HealthStatusDto>(healthStatus);

					var listIdStatus = healthStatus.ListIdStatus;

					dto.ListIdStatus = listIdStatus;

					dto.ListSymptom =  _mapper.Map<List<SymptomDto>>(symptomList.
						Where(x => listIdStatus.Contains(x.Id)).ToList());

					dto.DiagnosisOfDisease = healthStatus.Diagnosis != null 
					? healthStatus.Diagnosis.Disease.Name : null;

					return dto;
				});

				response.Status = true;
				response.Message = "Success";
				response.Data = new { HealthStatuses = dtoList, TotalPage = Math.Ceiling((float)healthStatusCount / pageSize) };

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> UpdatedHealthStatus(CreatedHealthStatusModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var healthStatusDetail = await _dbContext.HealthStatuses
					.Where(x => x.Id == model.Id)
					.Include(d => d.Diagnosis)
					.FirstOrDefaultAsync();
				if (healthStatusDetail == null)
				{
					response.Status = false;
					response.Message = "Du lieu khong ton tai";
					return response;
				}

				if(healthStatusDetail.Diagnosis != null)
				{
					_dbContext.Diagnoses.Remove(healthStatusDetail.Diagnosis);
					healthStatusDetail.Diagnosis = null;
				}
				healthStatusDetail.Weight = model.Weight;
				healthStatusDetail.Height = model.Height;
				healthStatusDetail.Temperature = model.Temperature;
				healthStatusDetail.ListIdStatus = model.ListIdStatus;
				
				await _dbContext.SaveChangesAsync();

				response.Status = true;
				response.Message = "Success";
				response.Data = healthStatusDetail;

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}
		
		public async Task<BaseResponseModel> UpdatedHealthStatusAutoMLTable(CreateHealthStatusAutoMLTable model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var healthStatusDetail = await _dbContext.HealthStatuses
					.Where(x => x.Id == model.Id)
					.Include(d => d.Diagnosis)
					.FirstOrDefaultAsync();
				if (healthStatusDetail == null)
				{
					response.Status = false;
					response.Message = "Du lieu khong ton tai";
					return response;
				}

				if(healthStatusDetail.Diagnosis != null)
				{
					_dbContext.Diagnoses.Remove(healthStatusDetail.Diagnosis);
					healthStatusDetail.Diagnosis = null;
				}
				healthStatusDetail.Weight = model.Weight;
				healthStatusDetail.Height = model.Height;
				healthStatusDetail.Temperature = model.Temperature;
				healthStatusDetail.Status = model.Status;
				
				await _dbContext.SaveChangesAsync();

				response.Status = true;
				response.Message = "Success";
				response.Data = healthStatusDetail;

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
