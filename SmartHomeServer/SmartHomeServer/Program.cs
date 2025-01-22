using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartHomeServer;
using SmartHomeServer.Hubs;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetIsOriginAllowed(origin => true);
    });
});

builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("localDB"),
        ServerVersion.Parse("8.0.40-mysql")
    ));

builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

builder.Services.AddSignalR()
    .AddJsonProtocol(options =>
    {
        options.PayloadSerializerOptions.Converters
           .Add(new JsonStringEnumConverter());
    });

builder.Services.AddControllers();

var key = Encoding.ASCII.GetBytes(builder.Configuration.GetSection("key").Value);

builder.Services
    .AddAuthentication(option =>
    option.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme
   )
    .AddJwtBearer(options =>
    {
        options.Events = new JwtBearerEvents()
        {
            OnMessageReceived = context =>
            {
                var token = "";
                context.Request.Cookies.TryGetValue("X-Access-Token", out token);
                context.Token = token;
                Console.WriteLine(context.Token + " :token");
                return Task.CompletedTask;
            }
        };
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ClockSkew = TimeSpan.Zero,
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<SystemHub>("/systemHub");

app.UseCors();

app.Run();