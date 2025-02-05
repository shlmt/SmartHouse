using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using SmartHomeServer.Classes;
using System;
using System.Collections.Concurrent;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SmartHomeServer.Hubs
{
    [Authorize]
    public class SystemHub:Hub
    {
        private static readonly ConcurrentDictionary<string, (string house, List<string> dashboards)> SystemConnections = new();
        public async Task ConnectHouse(Actuator[] actuators, Meter[] meters)
        {
            string systemId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(systemId))
            {
                await Clients.Caller.SendAsync("Auth Error", "invalid systemId. please login");
                return;
            }
            if (SystemConnections.TryGetValue(systemId, out var pair) && pair.dashboards != null)
            {
                SystemConnections[systemId] = (Context.ConnectionId, pair.dashboards);
                foreach (var dashId in pair.dashboards)
                {
                    await Clients.Client(dashId).SendAsync("HouseConnected", new { actuators, meters });
                }
            }
            else
            {
                SystemConnections[systemId] = (Context.ConnectionId, new List<string>());
            }
            await Clients.Caller.SendAsync("Connected", "house connected successfully.");
        }

        public async Task ConnectDashboard()
        {
            string systemId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(systemId))
            {
                await Clients.Caller.SendAsync("Auth Error", "invalid systemId. please login");
                return;
            }
            if (SystemConnections.TryGetValue(systemId, out var pair))
            {
                if (pair.house != null)
                {
                    SystemConnections[systemId].dashboards.Add(Context.ConnectionId);
                    await Clients.Client(pair.house).SendAsync("DashboardConnected", Context.ConnectionId);
                    await Clients.Caller.SendAsync("Connected", "dashboard connected successfully.");
                }
                else
                {
                    pair.dashboards.Add(Context.ConnectionId);
                    await Clients.Caller.SendAsync("Connected", "No HOUSE found for this systemId.");
                }
            }
            else
            {
                SystemConnections[systemId] = (null, new List<string> { Context.ConnectionId });
                await Clients.Caller.SendAsync("Connected", "No SYSTEM found for this systemId.");
            }
        }

        public async Task SendMessage(string senderType, string message)
        {
            string systemId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(systemId))
            {
                await Clients.Caller.SendAsync("Auth Error", "invalid systemId. please login");
                return;
            }
            if (SystemConnections.TryGetValue(systemId, out var pair))
            {
                if (senderType == "HOUSE" && pair.dashboards != null)
                {
                    foreach (var dashId in pair.dashboards)
                    {
                        await Clients.Client(dashId).SendAsync("ReceiveMessage", message);
                    }
                }
                else if (senderType == "DASHBOARD" && pair.house != null)
                {
                    await Clients.Client(pair.house).SendAsync("ReceiveMessage", message);
                }
            }
        }

        public async Task SendDataToSpecificDashboard(string dashId, Actuator[] actuators, Meter[] meters)
        {
            string systemId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(systemId))
            {
                await Clients.Caller.SendAsync("Auth Error", "invalid systemId. please login");
                return;
            }
            if (SystemConnections.TryGetValue(systemId, out var pair))
            {
                if (pair.dashboards.Contains(dashId))
                {
                    await Clients.Client(dashId).SendAsync("ReceiveInitData", new { actuators, meters });
                }
                else
                {
                    await Clients.Caller.SendAsync("Error", "The specified dashboard is not connected under this systemId.");
                }
            }
            else
            {
                await Clients.Caller.SendAsync("Error", "systemId not found.");
            }
        }

        public async Task NotifyActuatorChange(Operation action, Actuator deviceData)
        {
            string systemId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(systemId))
            {
                await Clients.Caller.SendAsync("Auth Error", "invalid systemId. please login");
                return;
            }
            if (deviceData == null)
            {
                await Clients.Caller.SendAsync("Error", "deviceData is null.");
                return;
            }
            if (SystemConnections.TryGetValue(systemId, out var pair))
            {
                if(pair.house != null && pair.house != Context.ConnectionId)
                {
                    await Clients.Client(pair.house).SendAsync("ReceiveDataChangeNotification", action, DeviceType.Actuator.ToString(), deviceData);
                }
                foreach (var dashId in pair.dashboards)
                {
                    await Clients.Client(dashId).SendAsync("ReceiveDataChangeNotification", action, DeviceType.Actuator.ToString(), deviceData);
                }
            }
            else
            {
                await Clients.Caller.SendAsync("Error", "systemId not found.");
            }
        }

        public async Task NotifyActuatorChangeAll(string name, bool? isOn, Dictionary<string, string> status)
        {
            string systemId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(systemId))
            {
                await Clients.Caller.SendAsync("Auth Error", "invalid systemId. please login");
                return;
            }
            if (string.IsNullOrEmpty(name))
            {
                await Clients.Caller.SendAsync("Error", "invalid name");
                return;
            }
            if (SystemConnections.TryGetValue(systemId, out var pair))
            {
                if (pair.house != null && pair.house != Context.ConnectionId)
                {
                    await Clients.Client(pair.house).SendAsync("RecieveActuatorChangeAll", name, isOn, status );
                }
                foreach (var dashId in pair.dashboards)
                {
                    await Clients.Client(dashId).SendAsync("RecieveActuatorChangeAll", name, isOn, status);
                }
            }
            else
            {
                await Clients.Caller.SendAsync("Error", "systemId not found.");
            }
        }

        public async Task NotifyMeterChange(Operation action, Meter data)
        {
            string systemId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(systemId))
            {
                await Clients.Caller.SendAsync("Auth Error", "invalid systemId. please login");
                return;
            }
            if (data == null)
            {
                await Clients.Caller.SendAsync("Error", "data is null.");
                return;
            }
            if (SystemConnections.TryGetValue(systemId, out var pair))
            {
                if (pair.house != Context.ConnectionId)
                {
                    if(action == Operation.Update)
                    {
                        await Clients.Caller.SendAsync("Error", $"Dashboard can't update meter data.");
                        return;
                    }
                    await Clients.Client(pair.house).SendAsync("ReceiveDataChangeNotification", action, "meter", data);
                }
                foreach (var dashId in pair.dashboards)
                {
                    await Clients.Client(dashId).SendAsync("ReceiveDataChangeNotification", action, "meter", data);
                }
            }
            else
            {
                await Clients.Caller.SendAsync("Error", "systemId not found.");
            }
        }

        public async Task NotifySensorAlert(string sensor, string room, string msg)
        {
            string systemId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(systemId))
            {
                await Clients.Caller.SendAsync("Auth Error", "invalid systemId. please login");
                return;
            }
            if (string.IsNullOrEmpty(sensor))
            {
                await Clients.Caller.SendAsync("Error", "which sensor sent this alert?");
                return;
            }
            if (SystemConnections.TryGetValue(systemId, out var pair))
            {
                if (pair.house != Context.ConnectionId)
                {
                    await Clients.Caller.SendAsync("Error", "Dashboard can't send sonsor's alert.");
                    return;
                }
                foreach (var dashId in pair.dashboards)
                {
                    await Clients.Client(dashId).SendAsync("NotifySensorAlert", sensor, room, msg);
                }
            }
            else
            {
                await Clients.Caller.SendAsync("Error", "systemId not found.");
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string systemId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(systemId))
            {
                await Clients.Caller.SendAsync("Auth Error", "invalid systemId. please login");
                return;
            }
            if (!string.IsNullOrEmpty(systemId))
            {
                var pair = SystemConnections[systemId];

                if (pair.house == Context.ConnectionId)
                {
                    foreach (var dashId in pair.dashboards)
                    {
                        await Clients.Client(dashId).SendAsync("HouseDisconnected", "house has disconnected.");
                    }
                    if(pair.dashboards.Count == 0)
                        SystemConnections.TryRemove(systemId, out _);
                    else
                        SystemConnections[systemId] = (null, pair.dashboards);
                }
                else if (pair.dashboards.Contains(Context.ConnectionId))
                {
                    pair.dashboards.Remove(Context.ConnectionId);
                    if (pair.dashboards.Count == 0 && pair.house==null)
                    {
                        SystemConnections.TryRemove(systemId, out _);
                    }
                }
            }
            await base.OnDisconnectedAsync(exception);
        }

        public override Task OnConnectedAsync()
        {
            Console.WriteLine("UserConnected " + Context.ConnectionId);
            Console.WriteLine(Context.User?.FindFirst(ClaimTypes.Role)?.Value);
            Console.WriteLine(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return base.OnConnectedAsync();
        }

    }
}
