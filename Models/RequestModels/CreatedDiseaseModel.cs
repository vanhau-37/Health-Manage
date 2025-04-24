using health_backend.Models.EntityModels;
using System.ComponentModel.DataAnnotations;

namespace health_backend.Models.RequestModels
{
	public class CreatedDiseaseModel
	{
		public int Id { get; set; }
		[Required(ErrorMessage ="Vui lòng nhập tên bệnh.")]
		public string Name { get; set; }
		[Required(ErrorMessage = "Vui lòng nhập thông tin bệnh.")]
		public string Description { get; set; }
		public string MarkdownContent { get; set; }
		//list of symptom
		[CheckList(ErrorMessage = "Vui lòng chọn ít nhất 1 triệu chứng.")]
		public List<int> ListSymptom { get; set; }
		[Required(ErrorMessage = "Vui lòng chọn hình ảnh.")]
		public string Image { get; set; }
	}

	public class CheckList : ValidationAttribute
	{
		public override bool IsValid(object value)
		{
			if(value is List<int> list)
			{
				return list.Count > 0;
			}
			return false;
		}
	}
}
