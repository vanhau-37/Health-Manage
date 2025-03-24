using health_backend.Models.EntityModels;
using System.ComponentModel.DataAnnotations;

namespace health_backend.Models.Dtos
{
	public class SymptomDto
	{
		public int Id { get; set; }
		[Required(ErrorMessage = "Vui lòng nhập tên triệu chứng.")]
		public string Name { get; set; }
		[Required(ErrorMessage = "Vui lòng nhập mô tả triệu chứng.")]
		public string Description { get; set; }
		////list of disease
		//public ICollection<Disease> ListDisease { get; set; }
	}
}
