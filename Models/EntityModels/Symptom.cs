namespace health_backend.Models.EntityModels
{
	public class Symptom
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
        //list of disease
        public ICollection<Disease> ListDisease { get; set; }
		public DateTime CreateDate { get; set; } = DateTime.Now;

	}
}
