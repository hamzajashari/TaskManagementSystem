using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskSystem.Models;
using TaskSystem.Services.IServices;
using TaskSystem.Services;
namespace TaskSystem.Controllers;


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
        return Ok(await _taskService.GetTaskByIdAsync(id));
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