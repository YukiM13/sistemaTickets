using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.OpenApi.Models;
using sistemaTickets_backend.API1.Extensions;
using sistemaTickets_backend.API1.Helpers;
using sistemaTickets_backend.BusinessLogic;
using sistemaTickets_backend.DataAccess;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.DataAccess();
builder.Services.BusinessLogic();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });

    // Configuraci?n de ApiKey
    c.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        Description = "Ingrese la ApiKey en el encabezado 'X-Api-Key'",
        Type = SecuritySchemeType.ApiKey,
        Name = "X-Api-Key",
        In = ParameterLocation.Header,
        Scheme = "ApiKeyScheme"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "ApiKey"
                }
            },
            new string[] {}
        }
    });
});


builder.Services.AddSingleton<ApiKeyAuthorizationFilter>();
builder.Services.AddSingleton<IApiKeyValidator, ApiKeyValidator>();

builder.Services.AddAutoMapper(config =>
{
    config.AddProfile(typeof(MappingProfileExtensions));
});




var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var firebaseContext = scope.ServiceProvider.GetRequiredService<FirebaseContext>();
        Console.WriteLine("Conexión a Firebase establecida correctamente");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al conectar con Firebase: {ex.Message}");
        throw;
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
