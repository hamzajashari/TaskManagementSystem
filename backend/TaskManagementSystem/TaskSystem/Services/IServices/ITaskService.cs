using TaskSystem.Models;
using TaskSystem.ViewModels;
namespace TaskSystem.Services.IServices;

public interface ITaskService
{
    Task<IEnumerable<TaskDTO>> GetTasksAsync(TaskFilterParams filterParams);
    Task<TaskDTO> GetTaskByIdAsync(int id);
    Task<TaskDTO> CreateTaskAsync(CreateTaskDTO taskDto);
    Task<TaskDTO> UpdateTaskAsync(int id, UpdateTaskDTO taskDto);
    Task DeleteTaskAsync(int id);
    Task ToggleTaskCompletionAsync(int id);
}