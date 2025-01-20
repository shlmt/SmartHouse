namespace SmartHomeServer.Classes
{
    public class Device
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Room { get; set; }
        public DeviceType Type { get; set; }
        public bool? IsOn { get; set; }
        public Dictionary<string,string> Status { get; set; }
    }
}
