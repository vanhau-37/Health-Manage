using health_backend.Models.EntityModels;
using System.ComponentModel.DataAnnotations;

namespace health_backend.Models.RequestModels
{
	public class UpdateUserRequestModel
	{
		public int Id { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập họ tên.")]
		public string FullName { get; set; }

		public GenderType Gender { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập SDT.")]
		[Phone(ErrorMessage = "SDT không hợp lệ.")]
		public string PhoneNumber { get; set; }

		[Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
		public string Password { get; set; }

		[StringLength(20, MinimumLength = 8, ErrorMessage = "Password phải từ 8 đến 20 ký tự.")]
		[RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$",
			ErrorMessage = "Password phải có ít nhất 1 chữ hoa, số và ký tự đặc biệt.")]
		public string PasswordNew { get; set; }
	}
}
