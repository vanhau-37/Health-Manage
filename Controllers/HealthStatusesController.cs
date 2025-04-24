using health_backend.Models;
using health_backend.Models.EntityModels;
using health_backend.Models.RequestModels;
using health_backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace health_backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class HealthStatusesController : ControllerBase
	{
		private readonly IHealthStatusService _service;
        public HealthStatusesController(IHealthStatusService service)
        {
            _service = service;
        }
        // GET: api/<HealthStatusesController>
        [HttpGet]
		public async Task<IActionResult> Get(int pageIndex = 0, int pageSize = 7)
		{
			var result = await _service.GetHealthStatuses(pageIndex, pageSize);
			if(result.Status)
				return Ok(result);
			return BadRequest(result);
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> Get(int id, DateTime? from, DateTime? to, int pageIndex = 0, int pageSize = 5)
		{
			var result = await _service.GetHealthStatusesById(id, pageIndex, pageSize, from, to);
			if (result.Status)
				return Ok(result);
			return BadRequest(result);
		}

		// GET api/<HealthStatusesController>/5
		//[HttpGet("{id}")]
		//public async Task<IActionResult> Get(int id)
		//{
		//	var result = await _service.GetHealthStatusById(id);
		//	if (result.Status)
		//		return Ok(result);
		//	return BadRequest(result);
		//}

		// POST api/<HealthStatusesController>
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post(CreatedHealthStatusModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

			if(userId == null) return Unauthorized();
			
			if (ModelState.IsValid)
			{
				var result = await _service.CreatedHealthStatus(int.Parse(userId), model);
				if (result.Status) return Ok(result);
				return BadRequest(result);
			}
			response.Status = false;
			response.Message = "Nhập dữ liệu sai";
			return BadRequest(response);
		}

		// PUT api/<HealthStatusesController>/5
		[HttpPut]
		public async Task<IActionResult> Put(CreatedHealthStatusModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			userId = "1";
			if (userId == null) return Unauthorized();

			if (ModelState.IsValid)
			{
				var result = await _service.UpdatedHealthStatus(model);
				if (result.Status) return Ok(result);
				return BadRequest(result);
			}
			response.Status = false;
			response.Message = "Nhập dữ liệu sai";
			return BadRequest(response);
		}

		// DELETE api/<HealthStatusesController>/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var result = await _service.DeletedHealthStatus(id);
			if (result.Status)
				return Ok(result);
			return BadRequest(result);
		}

	}
}
