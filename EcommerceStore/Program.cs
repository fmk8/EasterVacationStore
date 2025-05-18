using EcommerceStore.Data;
using EcommerceStore.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not found in configuration"))),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// Add Custom Services
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<DbSeeder>();

// Register the service classes
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<OrderService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EcommerceStore API", Version = "v1" });
    
    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

// Add enhanced request logging middleware with error handling
app.Use(async (context, next) => {
    var path = context.Request.Path;
    var method = context.Request.Method;
    var requestId = Guid.NewGuid().ToString()[..8]; // Short ID for log correlation
    
    var sw = System.Diagnostics.Stopwatch.StartNew();
    try {
        Console.WriteLine($"[{requestId}] Starting {method} {path}");
        await next();
    }
    catch (Exception ex) {
        // Log the exception
        Console.WriteLine($"[{requestId}] Error processing {method} {path}: {ex.Message}");
        
        // Don't re-throw as this will be handled by the Error handler middleware
        if (!context.Response.HasStarted) {
            context.Response.StatusCode = 500;
        }
    }
    finally {
        sw.Stop();
        var statusCode = context.Response.StatusCode;
        
        // Use different colors for different status codes
        var statusMessage = statusCode switch {
            >= 500 => $"\u001b[31m{statusCode}\u001b[0m", // Red for 5xx
            >= 400 => $"\u001b[33m{statusCode}\u001b[0m", // Yellow for 4xx
            >= 300 => $"\u001b[36m{statusCode}\u001b[0m", // Cyan for 3xx
            _ => $"\u001b[32m{statusCode}\u001b[0m"      // Green for 2xx
        };
        
        Console.WriteLine($"[{requestId}] Completed {method} {path} {statusMessage} in {sw.ElapsedMilliseconds}ms");
    }
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();
    seeder.SeedDataAsync().Wait();
}

app.Run();
