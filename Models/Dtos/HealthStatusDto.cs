using health_backend.Models.EntityModels;

namespace health_backend.Models.Dtos
{
	public class HealthStatusDto
	{
		public int Id { get; set; }
		public float Weight { get; set; }
		public float Height { get; set; }
		public float Temperature { get; set; }
		public string Status { get; set; }
		public DateTime CreateDate { get; set; } = DateTime.Now;
		public string? DiagnosisOfDisease { get; set; }
	}
}
