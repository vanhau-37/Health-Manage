using health_backend.Models;
using health_backend.Models.RequestModels;

namespace health_backend.Services.Interfaces
{
	public interface IUsersService
	{
		Task<BaseResponseModel> GetUsers(int pageIndex, int pageSize);
		Task<BaseResponseModel> GetUserById(int userId);
		Task<BaseResponseModel> DeletedUser(int userId);
		Task<BaseResponseModel> Register(RegisterRequestModel model);
		Task<BaseResponseModel> Login(LoginRequestModel model);
		Task<BaseResponseModel> UpdatedUser(UpdatedRequestModel model);
		Task<BaseResponseModel> UpdatedUserById(UpdateUserRequestModel model);

	}
}
