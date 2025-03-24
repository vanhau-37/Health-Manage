using health_backend.Models;
using health_backend.Models.Dtos;
using health_backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace health_backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class SymptomsController : ControllerBase
	{
		private readonly ISymptomsService _service;
        public SymptomsController(ISymptomsService service)
        {
            _service = service;
        }
        // GET: api/<SymptomsController>
        [HttpGet]
		public async Task<IActionResult> Get(int pageIndex = 0, int pageSize = 5)
		{
			var result = await _service.GetSymptoms(pageIndex, pageSize);
			if(result.Status) return Ok(result);
			return BadRequest(result);
		}

		// GET api/<SymptomsController>/5
		[HttpGet("{id}")]
		public async Task<IActionResult> Get(int id)
		{
			var result = await _service.GetSymptomById(id);
			if (result.Status) return Ok(result);
			return BadRequest(result);
		}
		[HttpGet]
		[Route("search/{searchText}")]
		public async Task<IActionResult> Get(string searchText)
		{
			var result = await _service.SearchSymptom(searchText);
			if (result.Status) return Ok(result);
			return BadRequest(result);
		}

		// POST api/<SymptomsController>
		[HttpPost]
		public async Task<IActionResult> Post(SymptomDto model)
		{
			BaseResponseModel response = new BaseResponseModel();
			if(ModelState.IsValid)
			{
				var result = await _service.CreateSymptom(model);
				if (result.Status) return Ok(result);
				return BadRequest(result);
			}
			response.Status = false;
			response.Message = "Nhập dữ liệu sai";
			return BadRequest(response);

		}

		// PUT api/<SymptomsController>/5
		[HttpPut]
		public async Task<IActionResult> Put(SymptomDto model)
		{
			BaseResponseModel response = new BaseResponseModel();
			if (ModelState.IsValid)
			{
				var result = await _service.UpdateSymptom(model);
				if (result.Status) return Ok(result);
				return BadRequest(result);
			}
			response.Status = false;
			response.Message = "Nhập dữ liệu sai";
			return BadRequest(response);

		}

		// DELETE api/<SymptomsController>/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var result = await _service.DeleteSymptom(id);
			if (result.Status) return Ok(result);
			return BadRequest(result);
		}
	}
}
