using health_backend.Data;
using health_backend.Models;
using health_backend.Models.Dtos;
using health_backend.Models.EntityModels;
using health_backend.Models.RequestModels;
using health_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace health_backend.Services.Implementations
{
	public class HealthStatusesService : IHealthStatusService
	{
		private readonly HealthDbContext _dbContext;
        public HealthStatusesService(HealthDbContext dbContext)
        {
            _dbContext = dbContext;
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
					Status = model.Status,
					UserId = userId,
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

		public async Task<BaseResponseModel> GetHealthStatusById(int id)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var healthStatusDetail = await _dbContext.HealthStatuses.Where(hs => hs.Id == id)
					.Include(hs => hs.Diagnosis)
					.ThenInclude(d => d.Disease)
					.Select(hs => new HealthStatusDto
					{
						Id = hs.Id,
						Weight = hs.Weight,
						Height = hs.Height,
						Temperature = hs.Temperature,
						Status = hs.Status,
						CreateDate = hs.CreateDate,
						DiagnosisOfDisease = hs.DiagnosisId != null ? hs.Diagnosis.Disease.Name : null,
					}).FirstOrDefaultAsync();

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

		public async Task<BaseResponseModel> GetHealthStatuses(int pageIndex, int pageSize)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var healthStatusCount = await _dbContext.HealthStatuses.CountAsync();
				var healthStatusList = await _dbContext.HealthStatuses.Skip(pageSize * pageIndex).Take(pageSize)
					.Include(hs => hs.Diagnosis)
					.ThenInclude(d => d.Disease)
					.Select(hs => new HealthStatusDto
					{
						Id = hs.Id,
						Weight = hs.Weight,
						Height = hs.Height,
						Temperature = hs.Temperature,
						Status = hs.Status,
						CreateDate = hs.CreateDate,
						DiagnosisOfDisease = hs.DiagnosisId != null ? hs.Diagnosis.Disease.Name : null,
					}).OrderByDescending(x => x.Id).ToListAsync();

				response.Status = true;
				response.Message = "Success";
				response.Data = new { Symptoms = healthStatusList, Count = healthStatusCount };

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
				var healthStatusDetail = await _dbContext.HealthStatuses.Where(x => x.Id == model.Id).FirstOrDefaultAsync();
				if (healthStatusDetail == null)
				{
					response.Status = false;
					response.Message = "Du lieu khong ton tai";
					return response;
				}

				if(healthStatusDetail.DiagnosisId != null)
				{
					_dbContext.Diagnoses.Remove(healthStatusDetail.Diagnosis);
					healthStatusDetail.DiagnosisId = null;
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
