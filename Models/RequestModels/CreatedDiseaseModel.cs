using health_backend.Models.EntityModels;
using System.ComponentModel.DataAnnotations;

namespace health_backend.Models.RequestModels
{
	public class CreatedDiseaseModel
	{
		public int Id { get; set; }
		[Required(ErrorMessage ="Vui lòng nhập tên bệnh.")]
		public string Name { get; set; }
		[Required(ErrorMessage = "Vui lòng nhập mô tả bệnh.")]
		public string Description { get; set; }
		//list of symptom
		public List<int> ListSymptom { get; set; }
		public string Image { get; set; }
	}
}
