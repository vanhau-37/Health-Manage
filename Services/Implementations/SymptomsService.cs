using AutoMapper;
using health_backend.Data;
using health_backend.Models;
using health_backend.Models.Dtos;
using health_backend.Models.EntityModels;
using health_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.SymbolStore;

namespace health_backend.Services.Implementations
{
	public class SymptomsService : ISymptomsService
	{
		private readonly HealthDbContext _dbContext;
		private readonly IMapper _mapper;
        public SymptomsService(HealthDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
			_mapper = mapper;
        }

        public async Task<BaseResponseModel> CreateSymptom(SymptomDto model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var newSymptom = new Symptom
				{
					Name = model.Name,
					Description = model.Description,
				};
				_dbContext.Symptoms.Add(newSymptom);
				await _dbContext.SaveChangesAsync();

				response.Status = true;
				response.Message = "Success";
				response.Data = newSymptom;

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> DeleteSymptom(int id)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var symptomDelete = await _dbContext.Symptoms.Where(x => x.Id == id).FirstOrDefaultAsync();
				if (symptomDelete == null)
				{
					response.Status = false;
					response.Message = "Du lieu khong ton tai";
					return response;
				}

				_dbContext.Symptoms.Remove(symptomDelete);
				await _dbContext.SaveChangesAsync();
				response.Status = true;
				response.Message = "Success";
				response.Data = symptomDelete;

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> GetSymptomById(int id)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var symptomDetail = _mapper.Map<SymptomDto>( await _dbContext.Symptoms.Where(x => x.Id == id).Include(y => y.ListDisease).FirstOrDefaultAsync());

				response.Status = true;
				response.Message = "Success";
				response.Data = symptomDetail;

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> GetSymptoms(int pageIndex, int pageSize)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var symptomCount = await _dbContext.Symptoms.CountAsync();
				var symptomList = _mapper.Map<List<SymptomDto>>( await _dbContext.Symptoms.Skip(pageSize * pageIndex).Take(pageSize).OrderByDescending(x => x.Id).ToListAsync());
				
				response.Status = true;
				response.Message = "Success";
				response.Data = new {Symptoms = symptomList, Count = symptomCount};

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> SearchSymptom(string searchText)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var search = await _dbContext.Symptoms.Where(x => x.Name.Contains(searchText)).Select(y => new
				{
					y.Id,
					y.Name,
				}).ToListAsync();
				response.Status = true;
				response.Message = "Success";
				response.Data = search;

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> UpdateSymptom(SymptomDto model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var symptomDetail = await _dbContext.Symptoms.Where(x => x.Id == model.Id).FirstOrDefaultAsync();

				if(symptomDetail == null)
				{
					response.Status = false;
					response.Message = "Du lieu khong ton tai";
					return response;
				}
				//chi cap nhat thuoc tinh co trong dto
				_mapper.Map(model, symptomDetail);

				_dbContext.SaveChanges();
				response.Status = true;
				response.Message = "Success";
				response.Data = symptomDetail;

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
