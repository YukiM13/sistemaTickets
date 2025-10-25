using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
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
builder.Services.AddSwaggerGen();




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
