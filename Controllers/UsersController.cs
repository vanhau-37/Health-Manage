using health_backend.Models.Dtos;
using health_backend.Models;
using health_backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using health_backend.Models.RequestModels;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace health_backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IUsersService _service;
        public UsersController(IUsersService service)
        {
            _service = service;
        }
        // GET: api/<UsersController>
        [HttpGet]
		[Authorize]
		public async Task<IActionResult> Get(int pageIndex = 0, int pageSize = 7)
		{
			var result = await _service.GetUsers(pageIndex, pageSize);
			if (result.Status) return Ok(result);
			return BadRequest(result);
		}

		// GET api/<UsersController>/5
		[HttpGet("{id}")]
		public async Task<IActionResult> Get(int id)
		{
			var result = await _service.GetUserById(id);
			if (result.Status) return Ok(result);
			return BadRequest(result);
		}

		// POST api/<UsersController>
		[HttpPost("Login")]
		public async Task<IActionResult> Post(LoginRequestModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			if (ModelState.IsValid)
			{
				var result = await _service.Login(model);
				if (result.Status) return Ok(result);
				return BadRequest(result);
			}
			response.Status = false;
			response.Message = "Nhập dữ liệu sai";
			return BadRequest(response);

		}

		[HttpPost("Register")]
		public async Task<IActionResult> Post(RegisterRequestModel model)
		{
			BaseResponseModel response = new BaseResponseModel();

			if (ModelState.IsValid)
			{
				var result = await _service.Register(model);
				if (result.Status) return Ok(result);
				return BadRequest(result);
			}
			response.Status = false;
			response.Message = "Nhập dữ liệu sai";
			return BadRequest(response);

		}

		// PUT api/<UsersController>
		[HttpPut]
		public async Task<IActionResult> Put(UpdatedRequestModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			if (ModelState.IsValid)
			{
				var result = await _service.UpdatedUser(model);
				if (result.Status) return Ok(result);
				return BadRequest(result);
			}
			response.Status = false;
			response.Message = "Nhập dữ liệu sai";
			return BadRequest(response);
		}

		// DELETE api/<UsersController>/5
		[HttpDelete("{id}")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> Delete(int id)
		{
			var result = await _service.DeletedUser(id);
			if (result.Status) return Ok(result);
			return BadRequest(result);
		}
	}
}
