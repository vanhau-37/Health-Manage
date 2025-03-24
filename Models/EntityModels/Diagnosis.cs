namespace health_backend.Models.EntityModels
{
	public class Diagnosis
	{
        public int Id { get; set; }
        public int HealthStatusId { get; set; }
        public HealthStatus HealthStatus { get; set; }
		public int DiseaseId { get; set; }
		public Disease Disease { get; set; }
	}
}
