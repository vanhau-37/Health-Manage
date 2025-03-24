namespace health_backend.Models.EntityModels
{
	public class HealthStatus
	{
		public int Id { get; set; }
        public float Weight { get; set; }
		public float Height { get; set; }
        public float Temperature { get; set; }
        public string Status { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.Now;
        //Khóa ngoại với User
        public int UserId { get; set; }
        public User User { get; set; }
        //Khóa ngoại với Diagnosis
        public int? DiagnosisId { get; set; }
        public Diagnosis? Diagnosis { get; set; }
    }
}
