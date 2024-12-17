using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskSystem.Models;
using TaskSystem.Services.IServices;
using TaskSystem.Services;
using TaskSystem.Exceptions;
namespace TaskSystem.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskDTO>>> GetTasks([FromQuery] TaskFilterParams filterParams)
    {
        return Ok(await _taskService.GetTasksAsync(filterParams));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDTO>> GetTask(int id)
    {
        try
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            return Ok(task);
        }
        catch (NotFoundException ex)
        {
            // Return a 404 status code with a message when the task is not found
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Return a 500 status code for any other unexpected errors
            return StatusCode(500, new { message = "An error occurred while processing your request", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<TaskDTO>> CreateTask(CreateTaskDTO taskDto)
    {
        return Ok(await _taskService.CreateTaskAsync(taskDto));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskDTO>> UpdateTask(int id, UpdateTaskDTO taskDto)
    {
        return Ok(await _taskService.UpdateTaskAsync(id, taskDto));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id)
    {
        await _taskService.DeleteTaskAsync(id);
        return NoContent();
    }

    [HttpPatch("{id}/complete")]
    public async Task<ActionResult> ToggleTaskCompletion(int id)
    {
        await _taskService.ToggleTaskCompletionAsync(id);
        return NoContent();
    }
}