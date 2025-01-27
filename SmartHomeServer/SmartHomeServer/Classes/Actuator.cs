namespace SmartHomeServer.Classes
{
    public class Actuator
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Room { get; set; }
        public bool IsOn { get; set; }
        public Dictionary<string,string> Status { get; set; }
    }
}
