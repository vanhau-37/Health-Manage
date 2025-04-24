using health_backend.Models.EntityModels;

namespace health_backend.Models.Dtos
{
	public class HealthStatusDto
	{
		public int Id { get; set; }
		public float Weight { get; set; }
		public float Height { get; set; }
		public float Temperature { get; set; }
		public List<int> ListIdStatus { get; set; }
		public List<SymptomDto> ListSymptom { get; set; }
		public DateTime CreateDate { get; set; } = DateTime.Now;
		public string? DiagnosisOfDisease { get; set; }
	}

	public class HealthStatusDetail : HealthStatusDto
	{
        public UserDto User { get; set; }
        //      public string FullName { get; set; }
        //public GenderType Gender { get; set; }
        //public string PhoneNumber { get; set; }
    }
}
