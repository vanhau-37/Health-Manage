using Google.Cloud.AIPlatform.V1;
using health_backend.Data;
using health_backend.Services.Implementations;
using health_backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

//Add database
builder.Services.AddDbContext<HealthDbContext>( option =>
{
	option.UseSqlServer(builder.Configuration["ConnectionStrings:ConnectedDb"]);
});

builder.Services.AddHttpClient();

//Add automapper
builder.Services.AddAutoMapper(typeof(Program));

//Add memory cache
builder.Services.AddMemoryCache();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	var jwtSecurityScheme = new OpenApiSecurityScheme
	{
		BearerFormat = "JWT",
		Name = "Authorization",
		In = ParameterLocation.Header,
		Type = SecuritySchemeType.Http,
		Scheme = JwtBearerDefaults.AuthenticationScheme,
		Description = "Enter your JWT Access Token",
		Reference = new OpenApiReference
		{
			Id = JwtBearerDefaults.AuthenticationScheme,
			Type = ReferenceType.SecurityScheme
		}
	};

	options.AddSecurityDefinition("Bearer", jwtSecurityScheme);
	options.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{ jwtSecurityScheme, Array.Empty<string>() }
	});
});

builder.Services.AddScoped<IDiseasesService, DiseasesService>();
builder.Services.AddScoped<ISymptomsService, SymptomsService>();
builder.Services.AddScoped<IHealthStatusService, HealthStatusesService>();
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IDiagnosesService, DiagnosesService>();
builder.Services.AddScoped<VertexAiService>();

//them cau hinh authentication voi jwt
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(option =>
	{
		option.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			ValidIssuer = builder.Configuration["JwtIssuer"],
			ValidAudience = builder.Configuration["JwtAudience"],
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSecurityKey"]))
		};
	});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseStaticFiles(new StaticFileOptions
{
	FileProvider = new PhysicalFileProvider(@"D:\Project .Net\w-Health\Back-End\health-backend\health-backend\ImageDiseases"),
	RequestPath = "/StaticFiles"
});

app.UseCors(builder =>
	{
		builder
		.WithOrigins("http://localhost:3001") // FE URL chính xác
		.AllowAnyMethod()
		.AllowAnyHeader()
		.AllowCredentials(); // Bắt buộc nếu FE dùng withCredentials
	}
);

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
