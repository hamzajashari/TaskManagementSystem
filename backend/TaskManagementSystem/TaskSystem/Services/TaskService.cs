using System.Data;
using Microsoft.Data.SqlClient;
using TaskSystem.Services.IServices;
using TaskSystem.Models;
using TaskSystem.Models.Enum;
using System.Security.Claims;
using TaskSystem.Exceptions;
using Dapper;
using System.Threading.Tasks;

namespace TaskSystem.Services;

public class TaskService : ITaskService
{
    private readonly string _connectionString;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TaskService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        _connectionString = configuration.GetConnectionString("AppDbContextConnection") 
            ?? throw new ArgumentNullException("Connection string not found");
        _httpContextAccessor = httpContextAccessor;
    }

    private string GetCurrentUserId()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User not authenticated");

        //return "a18be9c0-aa65-4af8-bd17-00bd9344e575";
    }

    public async Task<IEnumerable<TaskDTO>> GetTasksAsync(TaskFilterParams filterParams)
    {
        using (var conn = new SqlConnection(_connectionString))
        {
            using (var cmd = new SqlCommand("sp_GetTasks", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", GetCurrentUserId());
                cmd.Parameters.AddWithValue("@IsCompleted", filterParams.IsCompleted);
                cmd.Parameters.AddWithValue("@Priority", filterParams.Priority);
                cmd.Parameters.AddWithValue("@SearchTerm", filterParams.SearchTerm ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DueDateFrom", filterParams.DueDateFrom ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DueDateTo", filterParams.DueDateTo ?? (object)DBNull.Value);
                var tasks = new List<TaskDTO>();
                await conn.OpenAsync();

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        tasks.Add(new TaskDTO
                        {
                            Id = reader.GetInt32("Id"),
                            Title = reader.GetString("Title"),
                            Description = reader.GetString("Description"),
                            DueDate = reader.GetDateTime("DueDate"),
                            CreatedAt = reader.GetDateTime("CreatedAt"),
                            UpdatedAt = reader.IsDBNull(reader.GetOrdinal("UpdatedAt"))
                            ? null
                            : reader.GetDateTime("UpdatedAt"),
                            IsCompleted = reader.GetBoolean("IsCompleted"),
                            Priority = (Priority)reader.GetInt32("Priority"),
                            UserId = reader.GetString("UserId")
                        });
                    }
                }

                // Apply sorting if not handled by stored procedure
                if (!string.IsNullOrEmpty(filterParams.SortBy))
                {
                    tasks = filterParams.SortBy.ToLower() switch
                    {
                        "title" => filterParams.SortDescending ?? true
                            ? tasks.OrderByDescending(t => t.Title).ToList()
                            : tasks.OrderBy(t => t.Title).ToList(),
                        "duedate" => filterParams.SortDescending ?? true
                            ? tasks.OrderByDescending(t => t.DueDate).ToList()
                            : tasks.OrderBy(t => t.DueDate).ToList(),
                        "createdat" => filterParams.SortDescending ?? true
                       ? tasks.OrderByDescending(t => t.CreatedAt).ToList()
                       : tasks.OrderBy(t => t.CreatedAt).ToList(),
                        "updateat" => filterParams.SortDescending ?? true
                            ? tasks.OrderByDescending(t => t.UpdatedAt).ToList()
                            : tasks.OrderBy(t => t.UpdatedAt).ToList(),
                        "priority" => filterParams.SortDescending ?? true
                            ? tasks.OrderByDescending(t => t.Priority).ToList()
                            : tasks.OrderBy(t => t.Priority).ToList(),
                        "completed" => filterParams.SortDescending ?? true
                            ? tasks.OrderByDescending(t => t.IsCompleted).ToList()
                            : tasks.OrderBy(t => t.IsCompleted).ToList(),
                        _ => tasks
                    };
                }

                return tasks;
            }
        }
    }

    public async Task<TaskDTO> GetTaskByIdAsync(int id)
    {

        using (SqlConnection conn = new SqlConnection(_connectionString))
        {
            DynamicParameters parameter = new DynamicParameters();
            parameter.Add("@TaskId", id, DbType.String, ParameterDirection.Input);
            parameter.Add("@UserId", GetCurrentUserId(), DbType.String, ParameterDirection.Input);

            await conn.OpenAsync();

            var res = await conn.QueryAsync<TaskDTO>(
            "[dbo].[sp_GetTaskById]",
            parameter,
            commandType: System.Data.CommandType.StoredProcedure
            );

            // Check if a task was found
            var task = res.FirstOrDefault();
            if (task == null)
            {
                throw new NotFoundException($"Task with ID {id} was not found.");
            }

            return task;
           
        }
    }

    public async Task<TaskDTO> CreateTaskAsync(CreateTaskDTO taskDto)
    {
        using (var conn = new SqlConnection(_connectionString))
        {
            using (var cmd = new SqlCommand("sp_CreateTask", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Title", taskDto.Title);
                cmd.Parameters.AddWithValue("@Description", taskDto.Description);
                cmd.Parameters.AddWithValue("@DueDate", taskDto.DueDate);
                cmd.Parameters.AddWithValue("@CreatedAt", taskDto.CreatedAt);
                cmd.Parameters.AddWithValue("@Priority", taskDto.Priority);
                cmd.Parameters.AddWithValue("@UserId", GetCurrentUserId());

                SqlParameter outputIdParam = new SqlParameter("@TaskId", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(outputIdParam);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                int newTaskId = (int)outputIdParam.Value;
                return await GetTaskByIdAsync(newTaskId);
            }
        }
    }

    public async Task<TaskDTO> UpdateTaskAsync(int id, UpdateTaskDTO taskDto)
    {
        using (var conn = new SqlConnection(_connectionString))
        {
            using (var cmd = new SqlCommand("sp_UpdateTask", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TaskId", id);
                cmd.Parameters.AddWithValue("@Title", taskDto.Title);
                cmd.Parameters.AddWithValue("@Description", taskDto.Description);
                cmd.Parameters.AddWithValue("@DueDate", taskDto.DueDate);
                cmd.Parameters.AddWithValue("@Priority", taskDto.Priority);
                cmd.Parameters.AddWithValue("@UserId", GetCurrentUserId());

                await conn.OpenAsync();
                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                if (rowsAffected == 0)
                    throw new NotFoundException($"Task with ID {id} not found");

                return await GetTaskByIdAsync(id);
            }
        }
    }

    public async Task DeleteTaskAsync(int id)
    {
        using (var conn = new SqlConnection(_connectionString))
        {
            using (var cmd = new SqlCommand("sp_DeleteTask", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TaskId", id);
                cmd.Parameters.AddWithValue("@UserId", GetCurrentUserId());

                await conn.OpenAsync();
                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                if (rowsAffected == 0)
                    throw new NotFoundException($"Task with ID {id} not found");
            }
        }
    }

    public async Task ToggleTaskCompletionAsync(int id)
    {
        using (var conn = new SqlConnection(_connectionString))
        {
            using (var cmd = new SqlCommand("sp_ToggleTaskCompletion", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@TaskId", id);
                cmd.Parameters.AddWithValue("@UserId", GetCurrentUserId());

                await conn.OpenAsync();
                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                if (rowsAffected == 0)
                    throw new NotFoundException($"Task with ID {id} not found");
            }
        }
    }
}