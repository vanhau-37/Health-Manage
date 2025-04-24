using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace health_backend.Data.Migrations
{
    /// <inheritdoc />
    public partial class DeleteDiagnosisIdInHS : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiagnosisId",
                table: "HealthStatuses");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DiagnosisId",
                table: "HealthStatuses",
                type: "int",
                nullable: true);
        }
    }
}
