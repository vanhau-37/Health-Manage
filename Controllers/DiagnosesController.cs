using health_backend.Models.EntityModels;
using health_backend.Models.RequestModels;
using health_backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace health_backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class DiagnosesController : ControllerBase
	{
		private readonly IDiagnosesService _service;
        public DiagnosesController(IDiagnosesService service)
        {
            _service = service;
        }

        // POST api/<DiagnosesController>
        [HttpPost]
		[Authorize]
		public async Task<IActionResult> Post(CreatedHealthStatusModel model)
		{
			var result = await _service.DiagnosisDisease(model);
			if (result.Status)
				return Ok(result);
			return BadRequest(result);
		}

		[HttpPost("CozeAi")]
		public async Task<IActionResult> Post([FromBody]string description)
		{
			var result = await _service.DiagnosisDiseaseCozeAI(description);
			if (result.Status)
				return Ok(result);
			return BadRequest(result);
		}

		//[HttpPost("AutoMLTable")]
		//public async Task<IActionResult> PostAutoMLTable(CreateHealthStatusAutoMLTable model)
		//{
		//	var result = await _service.DiagnosisDiseaseAutoMLTable(model);
		//	if (result.Status)
		//		return Ok(result);
		//	return BadRequest(result);
		//}

	}
}
