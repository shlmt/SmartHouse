using AutoMapper;
using Newtonsoft.Json;
using SmartHomeServer.Classes;

namespace SmartHomeServer
{
    public class AutoMapper : Profile
    {
        public AutoMapper() {
            CreateMap<Scheduledtask, ScheduledTaskDTO>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src =>
                    string.IsNullOrEmpty(src.Payload)
                        ? new Dictionary<string, string>()
                        : JsonConvert.DeserializeObject<Dictionary<string, string>>(src.Payload)))
                .ReverseMap()
                .ForMember(dest => dest.Payload, opt => opt.MapFrom(src =>
                    src.Status != null
                        ? JsonConvert.SerializeObject(src.Status)
                        : null));
        }
    }
}
