namespace health_backend.Models.EntityModels
{
	public class Disease
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		//list of symptom
        public ICollection<Symptom> ListSymptom { get; set; }
        public string Image { get; set; }
		public DateTime CreateDate { get; set; } = DateTime.Now;

	}
}
