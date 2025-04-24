using health_backend.Models;
using health_backend.Models.EntityModels;
using health_backend.Models.RequestModels;
using health_backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace health_backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class DiseasesController : ControllerBase
	{
		private readonly IDiseasesService _service;
        public DiseasesController(IDiseasesService service)
        {
            _service = service;
        }
        // GET: api/<DiseaseController>
        [HttpGet]
		public async Task<IActionResult> Get(string? stringText, int pageIndex = 0, int pageSize = 5)
		{
			var result = await _service.GetDiseases(stringText, pageIndex, pageSize);
			if(result.Status) return Ok(result);
			return BadRequest(result);
		}

		// GET api/<DiseaseController>/5
		[HttpGet("{id}")]
		public async Task<IActionResult> Get(int id)
		{
			var result = await _service.GetDiseaseById(id);
			if (result.Status) return Ok(result);
			return BadRequest(result);
		}
		
		[HttpGet]
		[Route("search/{searchText}")]
		public async Task<IActionResult> Get(string searchText)
		{
			var result = await _service.SearchDisease(searchText);
			if (result.Status) return Ok(result);
			return BadRequest(result);
		}

		// POST api/<DiseaseController>
		[HttpPost]
		public async Task<IActionResult> Post(CreatedDiseaseModel model)
		{
			BaseResponseModel response = new BaseResponseModel();
			
			if (ModelState.IsValid)
			{
				var result = await _service.CreatedDisease(model);
				if (result.Status) return Ok(result);
				return BadRequest(result);
			}
			response.Status = false;
			response.Message = "Nhập dữ liệu sai";
			return BadRequest(response);
		}

		[HttpPost]
		[Route("upload-Disease-image")]
		public async Task<IActionResult> Post(IFormFile imgFile, [FromForm] string? oldImageUrl)
		{
			var result = await _service.AddImgDisease(imgFile, oldImageUrl, HttpContext);
			if (result.Status) 
				return Ok(result);
			return BadRequest(result);
		}

		// PUT api/<DiseaseController>
		[HttpPut]
		public async Task<IActionResult> Put(CreatedDiseaseModel model)
		{
			BaseResponseModel response = new BaseResponseModel();

			if (ModelState.IsValid)
			{
				var result = await _service.UpdatedDisease(model);
				if (result.Status) return Ok(result);
				return BadRequest(result);
			}
			response.Status = false;
			response.Message = "Nhập dữ liệu sai";
			return BadRequest(response);
		}

		// DELETE api/<DiseaseController>/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var result = await _service.DeletedDisease(id);
			if (result.Status) return Ok(result);
			return BadRequest(result);
		}
	}
}
