using health_backend.Models;
using health_backend.Models.Dtos;

namespace health_backend.Services.Interfaces
{
	public interface ISymptomsService
	{
		Task<BaseResponseModel> GetSymptoms(int pageIndex, int pageSize);
		Task<BaseResponseModel> GetSymptomById(int id);
		Task<BaseResponseModel> CreateSymptom(SymptomDto model);
		Task<BaseResponseModel> UpdateSymptom(SymptomDto model);
		Task<BaseResponseModel> DeleteSymptom(int id);
		Task<BaseResponseModel> SearchSymptom(string searchText);
	}
}
