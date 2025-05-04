using health_backend.Models;
using health_backend.Models.RequestModels;

namespace health_backend.Services.Interfaces
{
	public interface IHealthStatusService
	{
		Task<BaseResponseModel> GetHealthStatuses(int pageIndex, int pageSize);
		Task<BaseResponseModel> GetHealthStatusesById(int id, int pageIndex, int pageSize, DateTime? from, DateTime? to );
		Task<BaseResponseModel> CreatedHealthStatus(int userId, CreatedHealthStatusModel model);
		Task<BaseResponseModel> CreatedHealthStatusAutoMLTable (int userId, CreateHealthStatusAutoMLTable model);
		Task<BaseResponseModel> UpdatedHealthStatus(CreatedHealthStatusModel model);
		Task<BaseResponseModel> UpdatedHealthStatusAutoMLTable(CreateHealthStatusAutoMLTable model);
		Task<BaseResponseModel> DeletedHealthStatus(int id);
	}
}
