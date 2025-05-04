namespace health_backend.Models.RequestModels
{
	public class DiagnosisRequestModel
	{
		public string? Symptom1 { get; set; }
		public string? Symptom2 { get; set; }
		public string? Symptom3 { get; set; }
		public string? Symptom4 { get; set; }
		public string? Symptom5 { get; set; }
		public string? Symptom6 { get; set; }
	}

	public class DiagnosisResult
	{
		public string Disease { get; set; }
		public float Confidence { get; set; }
	}
	
}
