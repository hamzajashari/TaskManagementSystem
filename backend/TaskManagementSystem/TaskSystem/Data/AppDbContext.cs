using TaskSystem.Models;
using TaskSystem.Models.Enum;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace TaskSystem.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<AppUser>(options)
    {
        public DbSet<TaskModel> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var baseDate = new DateTime(2024, 3, 20);
            var userId = "a18be9c0-aa65-4af8-bd17-00bd9344e575"; //ADMIN


            modelBuilder.Entity<TaskModel>().HasData(
                new TaskModel
                {
                    Id = 1,
                    Title = "Complete Project Proposal",
                    Description = "Draft and finalize the project proposal for the new client",
                    IsCompleted = false,
                    DueDate = baseDate.AddDays(7),
                    Priority = Priority.High,
                    CreatedAt = baseDate,
                    UpdatedAt = baseDate,
                    UserId = userId
                },
                new TaskModel
                {
                    Id = 2,
                    Title = "Review Code Changes",
                    Description = "Review pull requests and merge approved changes",
                    IsCompleted = false,
                    DueDate = baseDate.AddDays(2),
                    Priority = Priority.Medium,
                    CreatedAt = baseDate,
                    UpdatedAt = baseDate,
                    UserId = userId
                },
                new TaskModel
                {
                    Id = 3,
                    Title = "Update Documentation",
                    Description = "Update API documentation with recent changes",
                    IsCompleted = true,
                    DueDate = baseDate.AddDays(-1),
                    Priority = Priority.Low,
                    CreatedAt = baseDate.AddDays(-5),
                    UpdatedAt = baseDate,
                    UserId = userId
                }
            );

            // Add stored procedures creation
            modelBuilder.HasDbFunction(() => GetTasksWithFilters(default, default, default, default, default, default, default));

            // Add migration SQL for stored procedures
            var sp_GetTasksWithFilters = @"
            CREATE OR ALTER PROCEDURE [dbo].[GetTasksWithFilters]
                @UserId nvarchar(450),
                @SearchTerm nvarchar(100) = NULL,
                @Priority int = NULL,
                @StartDate datetime2(7) = NULL,
                @EndDate datetime2(7) = NULL
            AS
            BEGIN
                SELECT t.*
                FROM Tasks t
                WHERE t.UserId = @UserId
                    AND (@SearchTerm IS NULL OR (t.Title LIKE '%' + @SearchTerm + '%' OR t.Description LIKE '%' + @SearchTerm + '%'))
                    AND (@Priority IS NULL OR t.Priority = @Priority)
                    AND (@StartDate IS NULL OR t.DueDate >= @StartDate)
                    AND (@EndDate IS NULL OR t.DueDate <= @EndDate)
                ORDER BY t.DueDate;
            END";

            // Add the stored procedure creation to migrations
            modelBuilder.Entity<TaskModel>()
                .ToTable("Tasks", tb => tb.HasTrigger("GetTasksWithFilters"))
                .Metadata.SetPropertyAccessMode(PropertyAccessMode.Field);

            // Add all stored procedures
            var procedures = @"
            CREATE OR ALTER PROCEDURE [dbo].[sp_GetTasks]
                @UserId NVARCHAR(450),
                @IsCompleted BIT = NULL,
                @Priority INT = NULL,
                @SearchTerm NVARCHAR(200) = NULL,
                @DueDateFrom DATETIME2 = NULL,
                @DueDateTo DATETIME2 = NULL
            AS
            BEGIN
                SELECT 
                    Id,
                    Title,
                    Description,
                    IsCompleted,
                    DueDate,
                    Priority,
                    UserId,
                    CreatedAt,
                    UpdatedAt
                FROM Tasks
                WHERE UserId = @UserId
                    AND (@IsCompleted IS NULL OR IsCompleted = @IsCompleted)
                    AND (@Priority IS NULL OR Priority = @Priority)
                    AND (@SearchTerm IS NULL OR Title LIKE '%' + @SearchTerm + '%' OR Description LIKE '%' + @SearchTerm + '%')
                    AND (@DueDateFrom IS NULL OR DueDate >= @DueDateFrom)
                    AND (@DueDateTo IS NULL OR DueDate <= @DueDateTo)
                ORDER BY DueDate ASC;
            END;


            CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateTask]
                @TaskId int,
                @Title nvarchar(200),
                @Description nvarchar(1000),
                @DueDate datetime2(7),
                @Priority int,
                @UserId nvarchar(450)
            AS
            BEGIN
                UPDATE Tasks
                SET Title = @Title,
                    Description = @Description,
                    DueDate = @DueDate,
                    Priority = @Priority
                WHERE Id = @TaskId AND UserId = @UserId;
            END;

            CREATE OR ALTER PROCEDURE [dbo].[sp_DeleteTask]
                @TaskId int,
                @UserId nvarchar(450)
            AS
            BEGIN
                DELETE FROM Tasks
                WHERE Id = @TaskId AND UserId = @UserId;
            END;

            CREATE OR ALTER PROCEDURE [dbo].[sp_ToggleTaskCompletion]
                @TaskId int,
                @UserId nvarchar(450)
            AS
            BEGIN
                UPDATE Tasks
                SET IsCompleted = ~IsCompleted
                WHERE Id = @TaskId AND UserId = @UserId;
            END;";

            modelBuilder.Entity<TaskModel>()
                .ToTable("Tasks", tb =>
                {
                    tb.HasTrigger("GetTasks");
                    tb.HasTrigger("GetTaskById");
                    tb.HasTrigger("CreateTask");
                    tb.HasTrigger("UpdateTask");
                    tb.HasTrigger("DeleteTask");
                    tb.HasTrigger("ToggleTaskCompletion");
                })
                .Metadata.SetPropertyAccessMode(PropertyAccessMode.Field);
        }

        // Define the stored procedure method signature
        public IQueryable<TaskModel> GetTasksWithFilters(
            string userId,
            string searchTerm,
            int? priority,
            string sortBy,
            bool sortDescending,
            DateTime? startDate,
            DateTime? endDate)
            => FromExpression(() => GetTasksWithFilters(userId, searchTerm, priority, sortBy, sortDescending, startDate, endDate));

    }
}
