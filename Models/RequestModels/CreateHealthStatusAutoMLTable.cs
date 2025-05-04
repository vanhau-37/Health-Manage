using System.ComponentModel.DataAnnotations;

namespace health_backend.Models.RequestModels
{
	public class CreateHealthStatusAutoMLTable
	{
		public int Id { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập cân nặng.")]
		[Range(1, 300, ErrorMessage = "Cân nặng phải từ 1 - 300 kg.")]
		[RegularExpression(@"^\d+(\.\d{1,2})?$", ErrorMessage = "Cân nặng phải là số.")]
		public float Weight { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập chiều cao.")]
		[Range(0.1, 3, ErrorMessage = "Chiều cao phải từ 0.1 - 3 m.")]
		[RegularExpression(@"^\d+(\.\d{1,2})?$", ErrorMessage = "Chiều cao phải là số.")]
		public float Height { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập nhiệt độ.")]
		[Range(10, 45, ErrorMessage = "Nhiệt độ phải từ 10 - 45.")]
		[RegularExpression(@"^\d+(\.\d{1,2})?$", ErrorMessage = "Nhiêt độ phải là số.")]
		public float Temperature { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập trạng thái hiện tại.")]
		public string Status { get; set; }
		
	}
}
