using TaskSystem.Data;
using TaskSystem.Models;
using TaskSystem.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace TaskSystem.Services;

public interface ISeedDataService
{
    Task SeedDataAsync();
}

public class SeedDataService : ISeedDataService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IDbContextFactory<AppDbContext> _contextFactory;

    public SeedDataService(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IDbContextFactory<AppDbContext> contextFactory)
    {
        _roleManager = roleManager;
        _userManager = userManager;
        _contextFactory = contextFactory;
    }
    //This method is used to seed the data in the database
    public async Task SeedDataAsync()
    {
        try
        {
            Console.WriteLine("Starting database migration...");
            await MigrateDatabase();
            
            Console.WriteLine("Seeding roles...");
            await SeedRolesIfNotExists();
            
            Console.WriteLine("Seeding admin user...");
            await SeedAdminUserIfNotExists();

            Console.WriteLine("Seeding test user...");
            await SeedTestUserIfNotExists();

            Console.WriteLine("Seeding completed successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during seeding: {ex.Message}");
            throw;
        }
    }

    private async Task MigrateDatabase()
    {
        using var context = _contextFactory.CreateDbContext();
        await context.Database.MigrateAsync();
    }
    private async Task SeedAdminUserIfNotExists()
    {
        if (await _userManager.FindByEmailAsync(ApplicationConstants.AdminAccount.Email) == null)
        {
            // if it doesn't exist, create it
            var user = new AppUser
            {
                FullName = ApplicationConstants.AdminAccount.FullName,
                UserName = ApplicationConstants.AdminAccount.UserName,
                Email = ApplicationConstants.AdminAccount.Email,
                EmailConfirmed = true,
                LockoutEnabled = false,
            };
            var result = await _userManager.CreateAsync(user, ApplicationConstants.AdminAccount.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                throw new Exception(string.Join(Environment.NewLine, errors));
            }
            //Add Admin user to AdminRole
            result = await _userManager.AddToRoleAsync(user, ApplicationConstants.RolesTypes.Admin);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                throw new Exception(string.Join(Environment.NewLine, errors));
            }
        }
    }
    private async Task SeedTestUserIfNotExists()
    {
        if (await _userManager.FindByEmailAsync(ApplicationConstants.TestAccount.Email) == null)
        {
            // if it doesn't exist, create it
            var user = new AppUser
            {
                FullName = ApplicationConstants.TestAccount.FullName,
                UserName = ApplicationConstants.TestAccount.UserName,
                Email = ApplicationConstants.TestAccount.Email,
                EmailConfirmed = true,
                LockoutEnabled = false,
            };
            var result = await _userManager.CreateAsync(user, ApplicationConstants.TestAccount.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                throw new Exception(string.Join(Environment.NewLine, errors));
            }

            // Add Test user to UserRole
            result = await _userManager.AddToRoleAsync(user, ApplicationConstants.RolesTypes.User);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                throw new Exception(string.Join(Environment.NewLine, errors));
            }
        }
    }

    private async Task SeedRolesIfNotExists()
    {
        if (!await _roleManager.RoleExistsAsync(ApplicationConstants.RolesTypes.Admin))
        {
            var roles = new[] { ApplicationConstants.RolesTypes.Admin, ApplicationConstants.RolesTypes.User };
            foreach (var roleValue in roles)
            {
                // if it doesn't exist, create it
                var result = await _roleManager.CreateAsync(new IdentityRole(roleValue));
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description);
                    throw new Exception(string.Join(Environment.NewLine, errors));
                }
            }
        }
    }
}