using health_backend.Models.EntityModels;
using System.ComponentModel.DataAnnotations;

namespace health_backend.Models.Dtos
{
	public class UserDto
	{
		public int Id { get; set; }
		public string FullName { get; set; }
		public GenderType Gender { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }
		public string PhoneNumber { get; set; }
		public RoleType Role { get; set; }
		public DateTime CreateDate { get; set; } = DateTime.Now;
	}
}
