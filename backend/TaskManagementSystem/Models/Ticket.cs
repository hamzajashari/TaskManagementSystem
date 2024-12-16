using TaskSystem.Models;
namespace TaskSystem.Models;

public class Ticket
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime DueDate { get; set; }
    public Priority Priority { get; set; }
    public string UserId { get; set; }
    public AppUser User { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public enum Priority
{
    Low,
    Medium,
    High
}