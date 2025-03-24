using health_backend.Models;
using health_backend.Models.RequestModels;

namespace health_backend.Services.Interfaces
{
	public interface IHealthStatusService
	{
		Task<BaseResponseModel> GetHealthStatuses(int pageIndex, int pageSize);
		Task<BaseResponseModel> GetHealthStatusById(int id);
		Task<BaseResponseModel> CreatedHealthStatus(int userId, CreatedHealthStatusModel model);
		Task<BaseResponseModel> UpdatedHealthStatus(CreatedHealthStatusModel model);
		Task<BaseResponseModel> DeletedHealthStatus(int id);
	}
}
