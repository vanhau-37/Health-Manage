using health_backend.Models.EntityModels;
using Microsoft.EntityFrameworkCore;

namespace health_backend.Data
{
	public class HealthDbContext : DbContext
	{
        public HealthDbContext(DbContextOptions options ):base(options)
        {
            
        }
        public DbSet<Disease> Diseases { get; set; }
        public DbSet<Symptom> Symptoms { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<HealthStatus> HealthStatuses { get; set; }
        public DbSet<Diagnosis> Diagnoses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<HealthStatus>()
				.HasOne(hs => hs.Diagnosis)  // Một HealthStatus có một Diagnosis
				.WithOne(d => d.HealthStatus) // Một Diagnosis có một HealthStatus
				.HasForeignKey<Diagnosis>(d => d.HealthStatusId) // Diagnosis phụ thuộc vào HealthStatus
				.OnDelete(DeleteBehavior.Cascade); // Xóa HealthStatus thì xóa luôn Diagnosis

			base.OnModelCreating(modelBuilder);
		}
	}
}
