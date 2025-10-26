using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using sistemaTickets_backend.BusinessLogic.Services;
using sistemaTickets_backend.DataAccess;
using sistemaTickets_backend.DataAccess.Repositorys;

namespace sistemaTickets_backend.BusinessLogic
{
    public static class ServiceConfiguration
    {
        public static void DataAccess(this IServiceCollection services)
        {
            // Registramos FirebaseContext como singleton
            services.AddSingleton<FirebaseContext>();

            // Registramos todos los repositorios que tus servicios usan
            ConfigureRepositories(services);
        }

        private static void ConfigureRepositories(IServiceCollection services)
        {
            // Repositorios
            services.AddScoped<usuariosRepository>();
            services.AddScoped<categoriasRepository>();
            services.AddScoped<ticketsRepository>();
            services.AddScoped<rolesRepository>();

        }

        public static void BusinessLogic(this IServiceCollection services)
        {
            // Servicios
            services.AddScoped<usuarioServices>();
            services.AddScoped<categoriaServices>();
            services.AddScoped<ticketServices>();
            services.AddScoped<rolServices>();

        }
    }
}
