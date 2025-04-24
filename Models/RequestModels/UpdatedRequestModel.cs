using health_backend.Models.EntityModels;
using System.ComponentModel.DataAnnotations;

namespace health_backend.Models.RequestModels
{
	public class UpdatedRequestModel
	{
        public int Id { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập họ tên.")]
		public string FullName { get; set; }

		public GenderType Gender { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập SDT.")]
		[Phone(ErrorMessage = "SDT không hợp lệ.")]
		public string PhoneNumber { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập Email.")]
		[EmailAddress(ErrorMessage = "Email không hợp lệ.")]
		public string Email { get; set; }

		public string Password { get; set; }
		
		[StringLength(20, MinimumLength = 8, ErrorMessage = "Password phải từ 8 đến 20 ký tự.")]
		[RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$",
			ErrorMessage = "Password phải có ít nhất 1 chữ hoa, số và ký tự đặc biệt.")]
		public string PasswordNew { get; set; }

		[Compare("PasswordNew", ErrorMessage = "Mật khẩu nhập lại không khớp.")]
		public string ConfirmPasswordNew { get; set; }
		public RoleType Role { get; set; }
	}
}
