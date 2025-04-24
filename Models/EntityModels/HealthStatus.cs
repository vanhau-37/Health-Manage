using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace health_backend.Models.EntityModels
{
	public class HealthStatus
	{
		public int Id { get; set; }
        public float Weight { get; set; }
		public float Height { get; set; }
        public float Temperature { get; set; }
        public string Status { get; set; }
		[NotMapped]
		public List<int> ListIdStatus
		{
			get
			{
				try
				{
					return string.IsNullOrEmpty(Status)
						? new List<int>()
						: JsonSerializer.Deserialize<List<int>>(Status) ?? new List<int>();
				}
				catch
				{
					return new List<int>();
				}
			}
			set
			{
				Status = JsonSerializer.Serialize(value);
			}
		}
		public DateTime CreateDate { get; set; } = DateTime.Now;
        //Khóa ngoại với User
        public int UserId { get; set; }
        public User User { get; set; }

        public Diagnosis? Diagnosis { get; set; }
    }
}
