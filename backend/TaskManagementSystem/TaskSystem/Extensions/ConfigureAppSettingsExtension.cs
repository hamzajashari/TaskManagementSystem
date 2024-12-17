using TaskSystem.Configurations;

namespace TaskSystem.Extensions
{
    public static class ConfigureAppSettingsExtension
    {
        public static void ConfigureAppSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JwtConfig>(configuration.GetSection(nameof(JwtConfig)));
        }
    }
}
