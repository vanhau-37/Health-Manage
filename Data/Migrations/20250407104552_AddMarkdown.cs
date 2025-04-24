using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace health_backend.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMarkdown : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MarkdownContent",
                table: "Diseases",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MarkdownContent",
                table: "Diseases");
        }
    }
}
