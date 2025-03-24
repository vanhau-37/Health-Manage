using System.ComponentModel.DataAnnotations;

namespace health_backend.Models.RequestModels
{
	public class LoginRequestModel
	{
		[Required(ErrorMessage = "Vui lòng nhập Email.")]
		[EmailAddress(ErrorMessage = "Vui lòng nhập đúng định đạng Email.")]
		public string Email { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
		public string Password { get; set; }
	}
}
