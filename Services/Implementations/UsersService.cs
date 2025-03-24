using AutoMapper;
using health_backend.Data;
using health_backend.Models;
using health_backend.Models.Dtos;
using health_backend.Models.EntityModels;
using health_backend.Models.RequestModels;
using health_backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace health_backend.Services.Implementations
{
	public class UsersService : IUsersService
	{
		private readonly HealthDbContext _dbContext;
		private readonly IConfiguration _configuration;
		private readonly IMapper _mapper;
        public UsersService(HealthDbContext dbContext, IConfiguration configuration, IMapper mapper)
        {
            _dbContext = dbContext;
			_configuration = configuration;
			_mapper = mapper;
        }
        public async Task<BaseResponseModel> GetUsers(int pageIndex, int pageSize)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var userCount = await _dbContext.Users.CountAsync();
				var userList = await _dbContext.Users.Skip(pageSize * pageIndex).Take(pageSize).OrderByDescending(x => x.Id).ToListAsync();
				
				response.Status = true;
				response.Message = "Success";
				response.Data = new { users = userList, Count = userCount };

			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> Login(LoginRequestModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var user = await _dbContext.Users.Where(x => x.Email == model.Email).FirstOrDefaultAsync();
				if (user == null || !VerifyPassword(user.Password, model.Password))
				{
					response.Status = false;
					response.Message = "Mat khau hoac tai khoan sai.";
					return response;
				}

				return GenerateJwtToken(user);


			}
			catch (Exception)
			{
				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}
		private bool VerifyPassword(string passwordHash, string password)
		{
			return BCrypt.Net.BCrypt.Verify(password, passwordHash);
		}
		private BaseResponseModel GenerateJwtToken(User user)
		{
			BaseResponseModel response = new BaseResponseModel();
			var key = Encoding.UTF8.GetBytes(_configuration["JwtSecurityKey"]);
			var tokenHandler = new JwtSecurityTokenHandler();
			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Issuer = _configuration["JwtIssuer"],
				Audience = _configuration["JwtAudience"],
				Subject = new ClaimsIdentity(new[]
				{
					new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
					new Claim(ClaimTypes.Name, user.FullName),
					new Claim(ClaimTypes.Role, user.Role.ToString())
				}),
				Expires = DateTime.UtcNow.AddHours(1),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};

			var token = tokenHandler.CreateToken(tokenDescriptor);
			response.Status = true;
			response.Message = "Success";
			response.Data = tokenHandler.WriteToken(token);
			return response;
		}

		public async Task<BaseResponseModel> DeleteUser(int userId)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var userDel = await _dbContext.Users.FindAsync(userId);
				if (userDel == null)
				{
					response.Status = false;
					response.Message = "Tai khoan khong ton tai";
					return response;
				}

				_dbContext.Users.Remove(userDel);
				_dbContext.SaveChanges();
				response.Status = true;
				response.Message = "Success";
				response.Data = userDel;
			}
			catch (Exception)
			{

				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> GetUserById(int userId)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var userDetail = _mapper.Map<UserDto>( await _dbContext.Users.Where(x => x.Id == userId).AsNoTracking().FirstAsync());
				if (userDetail == null)
				{
					response.Status = false;
					response.Message = "Tai khoan khong ton tai";
					return response;
				}
               
                response.Status = true;
				response.Message = "Success";
				response.Data = userDetail;
			}
			catch (Exception)
			{

				response.Status = false;
				response.Message = "Đã xảy ra lỗi";
			}
			return response;
		}

		public async Task<BaseResponseModel> Register(RegisterRequestModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			try
			{
				var existUser = await _dbContext.Users.Where(x => x.Email == model.Email).FirstOrDefaultAsync();
				if (existUser != null)
				{
					response.Status = false;
					response.Message = "Email da ton tai";
					return response;
				}

				var hashPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
				var newUser = _mapper.Map<User>(model);
				newUser.Password = hashPassword;

				_dbContext.Users.Add(newUser);
				await _dbContext.SaveChangesAsync();

				response.Status = true;
				response.Message = "Success";
				response.Data = newUser;
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
