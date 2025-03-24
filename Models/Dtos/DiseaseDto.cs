using health_backend.Models.EntityModels;

namespace health_backend.Models.Dtos
{
	public class DiseaseDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		//list of symptom
		public ICollection<SymptomDto> ListSymptom { get; set; }
		public string Image { get; set; }
	}
}
