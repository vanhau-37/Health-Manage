using health_backend.Models.EntityModels;
using System.ComponentModel.DataAnnotations;

namespace health_backend.Models.RequestModels
{
	public class CreatedHealthStatusModel
	{
		public int Id { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập cân nặng.")]
		public float Weight { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập chiều cao.")]
		public float Height { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập nhiệt độ.")]
		public float Temperature { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập trạng thái.")]
		public string Status { get; set; }

		//Khóa ngoại với User
		//public int UserId { get; set; }
		//public User User { get; set; }
		//Khóa ngoại với Diagnosis
		//public int? DiagnosisId { get; set; }
		//public Diagnosis? Diagnosis { get; set; }
	}
}
