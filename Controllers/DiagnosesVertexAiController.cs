using Google.Cloud.AIPlatform.V1;
using health_backend.Models.RequestModels;
using health_backend.Services.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace health_backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class DiagnosesVertexAiController : ControllerBase
	{
		private readonly VertexAiService _vertexAiService;

		public DiagnosesVertexAiController(VertexAiService vertexAiService)
		{
			_vertexAiService = vertexAiService;
		}

		[HttpPost]
		public async Task<IActionResult> Predict(CreateHealthStatusAutoMLTable request)
		{
			var result = await _vertexAiService.DiagnosisDiseaseAutoMLTable(request);
			return Ok(result);
		}
	}
}
