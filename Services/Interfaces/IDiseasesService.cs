using health_backend.Models;
using health_backend.Models.EntityModels;
using health_backend.Models.RequestModels;

namespace health_backend.Services.Interfaces
{
	public interface IDiseasesService
	{
		Task<BaseResponseModel> GetDiseases(int pageIndex, int pageSize);
		Task<BaseResponseModel> GetDiseaseById(int id);
		Task<BaseResponseModel> CreatedDisease(CreatedDiseaseModel model);
		Task<BaseResponseModel> UpdatedDisease(CreatedDiseaseModel model);
		Task<BaseResponseModel> DeletedDisease(int id);
		Task<BaseResponseModel> AddImgDisease(IFormFile imgFile, string? oldImageUrl, HttpContext httpContext);
		Task<BaseResponseModel> SearchDisease(string searchText);
	}
}
