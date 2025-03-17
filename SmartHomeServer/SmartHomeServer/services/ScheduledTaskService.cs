using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SmartHomeServer.Classes;
using SmartHomeServer.Hubs;
using System.Text.Json;

namespace SmartHomeServer.services
{
    public class ScheduledTaskService : BackgroundService
    {
        private readonly IHubContext<SystemHub> _systemHubConn;
        private readonly SystemHub _systemHubDict = new();
        private readonly IServiceScopeFactory _scopeFactory;

        public ScheduledTaskService(IServiceScopeFactory scopeFactory, IHubContext<SystemHub> systemHub)
        {
            _scopeFactory = scopeFactory;
            _systemHubConn = systemHub;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        DateTime now = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.UtcNow, "Israel Standard Time");
                        DateTime oneMinuteAgo = now.AddMinutes(-1);
                        var currentHour = now.Hour;
                        var currentMinute = now.Minute;
                        string today = now.DayOfWeek.ToString();

                        var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
                        var tasksToRun =
                            await dbContext.Scheduledtasks.Where(t =>
                                (t.Recurrence == "None" && t.StartTime >= oneMinuteAgo && t.StartTime <= now) ||
                                (t.Recurrence != "None" && t.RecurrenceDay == today && t.StartTime.Hour == currentHour && t.StartTime.Minute == currentMinute))
                            .ToListAsync(stoppingToken);

                        foreach (Scheduledtask task in tasksToRun)
                        {
                            var pair = _systemHubDict.getSystemConnId(task.UserId.ToString());
                            var connId = _systemHubDict.getHouseConnId(task.UserId.ToString());
                            if (!string.IsNullOrEmpty(pair.house))
                            {
                                if(task.Target == "DeviceType" && task.DeviceType != null)
                                {
                                    var status = JsonSerializer.Deserialize<Dictionary<string, string>>(task.Payload);
                                    await _systemHubConn.Clients.Client(pair.house).SendAsync("RecieveActuatorChangeAll", task.DeviceType, task.IsOn, status);
                                    foreach(string dashId in pair.dashboards)
                                    {
                                        await _systemHubConn.Clients.Client(dashId).SendAsync("RecieveActuatorChangeAll", task.DeviceType, task.IsOn, status);
                                    }
                                }
                                else if(task.Target == "DeviceId" && task.DeviceId != null)
                                {
                                    Actuator deviceData = new()
                                    {
                                        Id = task.DeviceId,
                                        Status = JsonSerializer.Deserialize<Dictionary<string, string>>(task.Payload),
                                        IsOn = task.IsOn
                                    };
                                    await _systemHubConn.Clients.Client(pair.house).SendAsync("ReceiveDataChangeNotification", Operation.Update, DeviceType.Actuator.ToString(), deviceData);
                                    foreach (string dashId in pair.dashboards)
                                    {
                                        await _systemHubConn.Clients.Client(dashId).SendAsync("ReceiveDataChangeNotification", Operation.Update, DeviceType.Actuator.ToString(), deviceData);
                                    }
                                }
                            }
                            if(task.Recurrence == "None")
                            {
                                dbContext.Scheduledtasks.Remove(task);
                            }
                        }
                        await dbContext.SaveChangesAsync(stoppingToken);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }

}
