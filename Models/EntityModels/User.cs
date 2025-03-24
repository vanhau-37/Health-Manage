namespace health_backend.Models.EntityModels
{
	public class User
	{
		public int Id { get; set; }
		public string FullName { get; set; }
		public GenderType Gender { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }
        public string PhoneNumber { get; set; }
		public RoleType Role { get; set; } = RoleType.User;
		public ICollection<HealthStatus>? ListHealthStatus { get; set; }
		public DateTime CreateDate { get; set; } = DateTime.Now;

	}

	public enum GenderType
	{
		Male,
		Female,
		Other
	}

	public enum RoleType
	{
		Admin,
		User 
	}
}
