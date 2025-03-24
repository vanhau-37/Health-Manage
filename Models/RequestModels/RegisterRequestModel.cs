using health_backend.Models.EntityModels;
using System.ComponentModel.DataAnnotations;

namespace health_backend.Models.RequestModels
{
	public class RegisterRequestModel
	{

		[Required(ErrorMessage = "Vui lòng nhập họ tên.")]
		public string FullName { get; set; }

		public GenderType Gender { get; set; }

		[Phone]
		[Required(ErrorMessage = "Vui lòng nhập SDT.")]
		public string PhoneNumber { get; set; }

		[EmailAddress]
		[Required(ErrorMessage = "Vui lòng nhập Email.")]
		public string Email { get; set; }

		[StringLength(20, MinimumLength = 8, ErrorMessage = "Password phải từ 8 đến 20 ký tự.")]
		[RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$", 
			ErrorMessage = "Password phải có ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt.")]
		public string Password { get; set; }

		[Compare("Password", ErrorMessage = "Mật khẩu nhập lại không khớp.")]
		public string ConfirmPassword { get; set; }
		public RoleType Role { get; set; }
	}
}
