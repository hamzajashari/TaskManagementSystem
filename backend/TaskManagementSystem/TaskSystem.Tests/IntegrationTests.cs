using Microsoft.EntityFrameworkCore;
using TaskSystem.Data;
using TaskSystem.Models;
using TaskSystem.Models.Enum;
using TaskSystem.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;
using System.Security.Claims;

namespace TaskSystem.Tests
{
    public class IntegrationTests
    {
        private readonly AppDbContext _context;
        private readonly TaskService _taskService;
        private readonly IConfiguration _configuration;
        private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;

        public IntegrationTests()
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

            _taskService = new TaskService(_configuration, _mockHttpContextAccessor.Object);
        }

        [Fact]
        public async Task CreateAndRetrieveTask_WorksCorrectly()
        {
            var createTaskDto = new CreateTaskDTO
            {
                Title = "Integration Test Task",
                Description = "Testing the full flow",
                Priority = Priority.High,
                DueDate = DateTime.Now.AddDays(1),
                CreatedAt = DateTime.Now,

            };

            var createdTask = await _taskService.CreateTaskAsync(createTaskDto);
            var filterParams = new TaskFilterParams();
            var retrievedTasks = await _taskService.GetTasksAsync(filterParams);

            // Check if the created task is stored and validate the presence of the Title
            Assert.NotNull(createdTask);
            Assert.NotEmpty(retrievedTasks);
            Assert.Equal(createTaskDto.Title, createdTask.Title);
            Assert.Contains(retrievedTasks, t => t.Title == createTaskDto.Title);
        }

        [Fact]
        public async Task UpdateTask_WorksCorrectly()
        {
            var createTaskDto = new CreateTaskDTO
            {
                Title = "Original Title",
                Description = "Original Description",
                Priority = Priority.Low,
                DueDate = DateTime.Now.AddDays(1),
                CreatedAt = DateTime.Now,
            };

            var createdTask = await _taskService.CreateTaskAsync(createTaskDto);

            var updateTaskDto = new UpdateTaskDTO
            {
                Title = "Updated Title",
                Description = "Updated Description",
                Priority = Priority.High,
                DueDate = DateTime.Now.AddDays(2)
            };

            var updatedTask = await _taskService.UpdateTaskAsync(createdTask.Id, updateTaskDto);

            Assert.NotNull(updatedTask);
            Assert.Equal(updateTaskDto.Title, updatedTask.Title);
            Assert.Equal(updateTaskDto.Description, updatedTask.Description);
            Assert.Equal(updateTaskDto.Priority, updatedTask.Priority);
        }

        [Fact]
        public async Task DeleteTask_WorksCorrectly()
        {
            var createTaskDto = new CreateTaskDTO
            {
                Title = "Task to Delete",
                Description = "This task will be deleted",
                Priority = Priority.Medium,
                DueDate = DateTime.Now.AddDays(1),
                CreatedAt = DateTime.Now,
            };

            var createdTask = await _taskService.CreateTaskAsync(createTaskDto);

            await _taskService.DeleteTaskAsync(createdTask.Id);
            var filterParams = new TaskFilterParams();
            var remainingTasks = await _taskService.GetTasksAsync(filterParams);

            // Check if the task is present in the remainingTasks
            Assert.DoesNotContain(remainingTasks, task => task.Id == createdTask.Id);
        }

        public void Dispose()
        {
            _context.Tasks.RemoveRange(_context.Tasks);
            _context.SaveChanges();
            _context.Dispose();
        }
    }
}
