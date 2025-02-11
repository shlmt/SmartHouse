namespace SmartHomeServer.Classes
{
    public class ScheduledTaskDTO
    {
        public string Id { get; set; }
        public string Name { get; set; } = null!;

        public DateTime StartTime { get; set; }

        public string Recurrence { get; set; } = null!;

        public string? RecurrenceDay { get; set; }

        public string Target { get; set; } = null!;

        public string? DeviceId { get; set; }

        public string? DeviceType { get; set; }

        public bool IsOn { get; set; }

        public Dictionary<string,string>? Status { get; set; }
    }

}
