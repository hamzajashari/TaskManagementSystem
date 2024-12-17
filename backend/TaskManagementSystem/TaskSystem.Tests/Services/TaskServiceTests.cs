using Xunit;
using Microsoft.EntityFrameworkCore;
using TaskSystem.Data;
using TaskSystem.Models.Enum;
using TaskSystem.Services;
using TaskSystem.Models;
using Moq;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace TaskSystem.Tests.Services
{
    public class TaskServiceTests
    {
        private readonly AppDbContext _context;
        private readonly TaskService _service;
        private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;
        private readonly IConfiguration _configuration;

        public TaskServiceTests()
        {
            // Setup configuration
            _configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Test.json")
                .Build();

            // Create in-memory database for testing
            var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(_configuration.GetConnectionString("AppDbContextConnection"))
            .Options;

            _context = new AppDbContext(options);

            // Mock the HttpContextAccessor
            _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();

            // Create mock user with claims
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, "test-user"),
            new Claim(ClaimTypes.NameIdentifier, "a18be9c0-aa65-4af8-bd17-00bd9344e575"),
        };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);

            var httpContext = new DefaultHttpContext();
            httpContext.User = principal;
            httpContext.Items["UserId"] = "a18be9c0-aa65-4af8-bd17-00bd9344e575";

            _mockHttpContextAccessor.Setup(x => x.HttpContext).Returns(httpContext);

            // Create the TaskService with the mocked IConfiguration and mocked HttpContextAccessor
            _service = new TaskService(_configuration, _mockHttpContextAccessor.Object);
        }

       

        [Fact]
        public async Task CreateTask_SavesTaskToDatabase()
        {
            var createTaskDto = new CreateTaskDTO
            {
                Title = "Test Task",
                Description = "Test Description",
                Priority = Priority.High,
                DueDate = DateTime.Now.AddDays(1),
                CreatedAt = DateTime.Now,
            };

            var result = await _service.CreateTaskAsync(createTaskDto);

            Assert.NotNull(result);
            Assert.Equal(createTaskDto.Title, result.Title);

            var savedTask = await _context.Tasks.FirstOrDefaultAsync(x => x.Id == result.Id);

            Assert.NotNull(savedTask);
            Assert.Equal(createTaskDto.Title, savedTask.Title);
        }

        [Fact]
        public async Task GetTasks_WithSorting_ReturnsOrderedTasks()
        {
            var userId = _mockHttpContextAccessor.Object.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var filterParams = new TaskFilterParams
            {
                SortBy = "title",
                SortDescending = true
            };

            var tasks = new List<TaskModel>
    {
        new TaskModel { Title = "Z Task", Description = "Z Description", Priority = Priority.Low, DueDate = DateTime.Now, CreatedAt = DateTime.Now, UserId = userId },
        new TaskModel { Title = "A Task", Description = "A Description", Priority = Priority.High, DueDate = DateTime.Now.AddDays(1), CreatedAt = DateTime.Now, UserId = userId }
    };

            _context.Tasks.AddRange(tasks);
            await _context.SaveChangesAsync();

            var result = await _service.GetTasksAsync(filterParams);

            var orderedTasks = result.ToList();

            // Check that tasks are ordered correctly in descending order by title
            Assert.Equal("Z Task", orderedTasks.FirstOrDefault()?.Title);
            Assert.Equal("A Task", orderedTasks.LastOrDefault()?.Title);
        }

        public void Dispose()
        {
            _context.Tasks.RemoveRange(_context.Tasks);
            _context.SaveChanges();
        }
    }
}
