using health_backend.Models;
using health_backend.Models.RequestModels;

namespace health_backend.Services.Interfaces
{
	public interface IDiagnosesService
	{
		Task<BaseResponseModel> DiagnosisDisease(CreatedHealthStatusModel model);
	}
}
