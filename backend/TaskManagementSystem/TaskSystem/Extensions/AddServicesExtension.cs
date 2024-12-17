using TaskSystem.Services;

namespace TaskSystem.Extensions
{
    public static class AddServicesExtension
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<ISeedDataService, SeedDataService>();
            services.AddScoped<IAccountService, AccountService>();
        }
    }
}
