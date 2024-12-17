using Xunit;
using Moq;
using TaskSystem.Controllers;
using TaskSystem.Services.IServices;
using TaskSystem.Models;
using Microsoft.AspNetCore.Mvc;
using TaskSystem.Models.Enum;

namespace TaskSystem.Tests.Controllers
{
    public class TaskControllerTests
    {
        private readonly Mock<ITaskService> _mockTaskService;
        private readonly TasksController _controller;

        public TaskControllerTests()
        {
            _mockTaskService = new Mock<ITaskService>();
            _controller = new TasksController(_mockTaskService.Object);
        }

        [Fact]
        public async Task GetTasks_ReturnsOkResult_WithListOfTasks()
        {
            var filterParams = new TaskFilterParams();
            var expectedTasks = new List<TaskDTO>
            {
                new TaskDTO 
                { 
                    Id = 1, 
                    Title = "Test Task", 
                    Description = "Test Description",
                    Priority = Priority.Medium
                }
            };

            _mockTaskService.Setup(service => 
                service.GetTasksAsync(It.IsAny<TaskFilterParams>()))
                .ReturnsAsync(expectedTasks);

            var result = await _controller.GetTasks(filterParams);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedTasks = Assert.IsType<List<TaskDTO>>(okResult.Value);

            Assert.Single(returnedTasks);
            Assert.Equal(expectedTasks[0].Title, returnedTasks[0].Title);
        }

        [Fact]
        public async Task CreateTask_ReturnsOkResult_WithCreatedTask()
        {
            var createTaskDto = new CreateTaskDTO
            {
                Title = "New Task",
                Description = "New Description",
                Priority = Priority.High,
                DueDate = DateTime.Now.AddDays(1),
                CreatedAt = DateTime.Now,
            };

            var createdTaskDto = new TaskDTO
            {
                Id = 1,
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,
                Priority = createTaskDto.Priority,
                DueDate = createTaskDto.DueDate,
                CreatedAt = createTaskDto.CreatedAt,
            };

            _mockTaskService.Setup(service => 
                service.CreateTaskAsync(It.IsAny<CreateTaskDTO>()))
                .ReturnsAsync(createdTaskDto);

            var result = await _controller.CreateTask(createTaskDto);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedTask = Assert.IsType<TaskDTO>(okResult.Value);
            Assert.Equal(createTaskDto.Title, returnedTask.Title);
        }
    }
} 