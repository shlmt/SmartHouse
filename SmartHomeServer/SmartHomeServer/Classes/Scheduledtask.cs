namespace SmartHomeServer.Classes;

public partial class Scheduledtask
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public Guid UserId { get; set; }

    public DateTime StartTime { get; set; }

    public string Recurrence { get; set; } = null!;

    public string? RecurrenceDay { get; set; }

    public string Target { get; set; } = null!;

    public string? DeviceId { get; set; }

    public string? DeviceType { get; set; }

    public bool IsOn { get; set; }

    public string? Payload { get; set; }

    public virtual User User { get; set; } = null!;
}
