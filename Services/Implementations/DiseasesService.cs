using AutoMapper;
using health_backend.Data;
using health_backend.Models;
using health_backend.Models.Dtos;
using health_backend.Models.EntityModels;
using health_backend.Models.RequestModels;
using health_backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;

namespace health_backend.Services.Implementations
{
	public class DiseasesService : IDiseasesService
	{
		private readonly HealthDbContext _dbContext;
		private readonly IMapper _mapper;
		public DiseasesService(HealthDbContext dbContext, IMapper mapper)
		{
			_dbContext = dbContext;
			_mapper = mapper;
		}

		public async Task<BaseResponseModel> AddImgDisease(IFormFile imgFile, string? oldImageUrl, HttpContext httpContext)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var fileName = ContentDispositionHeaderValue.Parse(imgFile.ContentDisposition).FileName
					.TrimStart('\"').TrimEnd('\"');
				var newPath = @"D:\Project .Net\w-Health\Back-End\health-backend\health-backend\ImageDiseases";
				//Xóa ảnh cũ nếu có
				if (!string.IsNullOrEmpty(oldImageUrl))
				{
					var oldFileName = Path.GetFileName(oldImageUrl);
					var oldFullPath = Path.Combine(newPath, oldFileName);
					
					if (File.Exists(oldFullPath))
					{
						File.Delete(oldFullPath);
					}
				}

				if (!Directory.Exists(newPath))
				{
					Directory.CreateDirectory(newPath);
				}

				string[] allowedImageExtention = new string[] { ".jpg", ".jpeg", ".png" };
				if (!allowedImageExtention.Contains(Path.GetExtension(fileName)))
				{
					response.Status = false;
					response.Message = "File không hợp lệ. Chỉ chấp nhận .jpg, .jpeg, .png";
					return response;
				}

				var newFileName = Guid.NewGuid() + Path.GetExtension(fileName);
				var fullPath = Path.Combine(newPath, newFileName);
				using(var stream = new FileStream(fullPath, FileMode.Create))
				{
					await imgFile.CopyToAsync(stream);
				}
				response.Status = true;
				response.Message = "Success";
				response.Data = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}/Staticfiles/{newFileName}";
				
			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		[Authorize]
		public async Task<BaseResponseModel> CreatedDisease(CreatedDiseaseModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var isExistDisease = _dbContext.Diseases.Any(d => d.Name.ToLower() == model.Name.ToLower());
				if (isExistDisease)
				{
					response.Status = false;
					response.Message = "Bệnh đã tồn tại.";
					return response;
				}
				var symptoms = await _dbContext.Symptoms.Where(x => model.ListSymptom.Contains(x.Id)).ToListAsync();
				if(symptoms.Count() == model.ListSymptom.Count())
				{
					var newDisease = new Disease()
					{
						Name = model.Name,
						Description = model.Description,
						MarkdownContent = model.MarkdownContent,
						Image = model.Image,
						ListSymptom = symptoms
					};

					_dbContext.Diseases.Add(newDisease);
					_dbContext.SaveChanges();

					//Gọi thủ tục cập nhật lại thống kê của các bảng, giúp bộ tối ưu hóa truy vấn của SQL Server
					using (var command = _dbContext.Database.GetDbConnection().CreateCommand())
					{
						command.CommandText = "EXEC sp_updatestats";
						_dbContext.Database.OpenConnection();
						await command.ExecuteNonQueryAsync();
						_dbContext.Database.CloseConnection(); 
					}

					var responseData = new DiseaseDto()
					{
						Id = newDisease.Id,
						Name = newDisease.Name,
						Description = newDisease.Description,
						MarkdownContent = newDisease.MarkdownContent,
						Image = newDisease.Image,
						ListSymptom = symptoms.Select(x => new SymptomDto()
						{
							Id = x.Id,
							Name = x.Name,
							Description = x.Description,
						}).ToList(),
					};

					response.Status = true;
					response.Message = "Success";
					response.Data = responseData;
					return response;
				}
				response.Status = false;
				response.Message = "Du lieu trieu chung khong hop le";
			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		[Authorize]
		public async Task<BaseResponseModel> DeletedDisease(int id)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var diseaseDetail = await _dbContext.Diseases.Where(x => x.Id ==  id).FirstOrDefaultAsync();
				if (diseaseDetail != null)
				{
					_dbContext.Diseases.Remove(diseaseDetail);
					_dbContext.SaveChanges();

					response.Status = true;
					response.Message = "Success";
					response.Data = _mapper.Map<DiseaseDto>(diseaseDetail);
					return response;
				}

				response.Status = false;
				response.Message = "Du lieu khong ton tai";
				return response;
			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Du lieu khong ton tai";
				return response;
			}

		}

		public async Task<BaseResponseModel> GetDiseaseById(int id)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var diseaseDetail =  await _dbContext.Diseases
					.Include(y => y.ListSymptom)
					.Where(x => x.Id == id)
					.AsNoTracking()
					.FirstOrDefaultAsync();
				if(diseaseDetail == null)
				{
					response.Status = false;
					response.Message = "Không có dữ liệu bệnh";
				}
				else
				{
					var disease = _mapper.Map<DiseaseDto>(diseaseDetail);
					response.Status = true;
					response.Message = "Success";
					response.Data = disease;

				}

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		[Authorize]
		public async Task<BaseResponseModel> GetDiseases(string? searchText, int pageIndex, int pageSize)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var diseaseCount = await _dbContext.Diseases.AsNoTracking().CountAsync();
				var diseaseList = new List<DiseaseDto>();
				if (string.IsNullOrEmpty(searchText))
				{
					diseaseList = _mapper.Map<List<DiseaseDto>>( 
						await _dbContext.Diseases
						.Include(x => x.ListSymptom)
						.OrderBy(y => y.Id)
						.Skip(pageSize*pageIndex)
						.Take(pageSize)
						.AsNoTracking()
						.ToListAsync());
				}
				else
				{
					diseaseCount = await _dbContext.Diseases.Where(x => x.Name.Contains(searchText)).CountAsync();
					diseaseList = _mapper.Map<List<DiseaseDto>>(
						await _dbContext.Diseases
						.Where(d => d.Name.Contains(searchText))
						.Include(x => x.ListSymptom)
						.OrderByDescending(y => y.Id)
						.Skip(pageSize * pageIndex)
						.Take(pageSize)
						.AsNoTracking()
						.ToListAsync());
				}
				
				response.Status = true;
				response.Message = "Success";
				response.Data = new { Diseases = diseaseList, TotalPage =Math.Ceiling((float)diseaseCount/pageSize)};
				
			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		[Authorize]
		public async Task<BaseResponseModel> SearchDisease(string searchText)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var searched = _mapper.Map<DiseaseDto>(await _dbContext.Diseases
					.Where(x => x.Name.ToLower().Contains(searchText.ToLower()))
					.Include(s => s.ListSymptom)
					.AsNoTracking()
					.FirstOrDefaultAsync());

				if(searched == null)
				{
					response.Status = true;
					response.Message = "Không tìm thấy bệnh phù hợp trên hệ thống";
					return response;
				}

				response.Status = true;
				response.Message = "Success";
				response.Data = searched;

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		[Authorize]
		public async Task<BaseResponseModel> UpdatedDisease(CreatedDiseaseModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var symptoms = await _dbContext.Symptoms.Where(x => model.ListSymptom.Contains(x.Id)).ToListAsync();
				var diseaseDetail = await _dbContext.Diseases.Where(x => x.Id == model.Id).Include(y => y.ListSymptom).FirstOrDefaultAsync();
				if (diseaseDetail == null)
				{
					response.Status = false;
					response.Message = "Du lieu khong ton tai";
					return response;

				}
				diseaseDetail.Name = model.Name;
				diseaseDetail.Description = model.Description;
				diseaseDetail.MarkdownContent = model.MarkdownContent;
				diseaseDetail.Image = model.Image;

				//Xoa cac trieu chung k co trong ds moi
				var removeDisease = diseaseDetail.ListSymptom.Where(x => !model.ListSymptom.Contains(x.Id)).ToList();
				foreach(var disease in removeDisease)
				{
					diseaseDetail.ListSymptom.Remove(disease);
				}

				//Them cac trieu chung moi 
				var addDisease = symptoms.Except(diseaseDetail.ListSymptom).ToList();
				foreach (var disease in addDisease)
				{
					diseaseDetail.ListSymptom.Add(disease);
				}

				_dbContext.SaveChanges();

				var responseData = new DiseaseDto()
				{
					Id = diseaseDetail.Id,
					Name = diseaseDetail.Name,
					Description = diseaseDetail.Description,
					MarkdownContent = diseaseDetail.MarkdownContent,
					Image = diseaseDetail.Image,
					ListSymptom = symptoms.Select(x => new SymptomDto()
					{
						Id = x.Id,
						Name = x.Name,
						Description = x.Description,
					}).ToList(),
				};

				response.Status = true;
				response.Message = "Success";
				response.Data = responseData;
				return response;

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
