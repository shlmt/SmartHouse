using Microsoft.AspNetCore.SignalR;
using SmartHomeServer.Classes;
using System.Collections.Concurrent;

namespace SmartHomeServer.Hubs
{
    public class SystemHub:Hub
    {
        private static readonly ConcurrentDictionary<string, (string house, List<string> dashboards)> SystemConnections = new();
        public async Task ConnectHouse(string systemId, Device[] devices)
        {
            if (SystemConnections.TryGetValue(systemId, out var pair) && pair.dashboards != null)
            {
                SystemConnections[systemId] = (Context.ConnectionId, pair.dashboards);
                foreach (var dashId in pair.dashboards)
                {
                    await Clients.Client(dashId).SendAsync("HouseConnected",devices);
                }
            }
            else
            {
                SystemConnections[systemId] = (Context.ConnectionId, new List<string>());
            }
            await Clients.Caller.SendAsync("Connected", "house connected successfully.");
        }

        public async Task ConnectDashboard(string systemId)
        {
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

        public async Task SendMessage(string systemId, string senderType, string message)
        {

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

        public async Task SendDataToSpecificDashboard(string systemId, string dashId, Device[] devices)
        {
            if (SystemConnections.TryGetValue(systemId, out var pair))
            {
                if (pair.dashboards.Contains(dashId))
                {
                    await Clients.Client(dashId).SendAsync("ReceiveInitData", devices);
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

        public async Task NotifyDataChange(string systemId, Operation action, Device deviceData)
        {
            if(deviceData == null)
            {
                await Clients.Caller.SendAsync("Error", "deviceData is null.");
                return;
            }
            if (SystemConnections.TryGetValue(systemId, out var pair))
            {
                if(pair.house != Context.ConnectionId)
                {
                    if(deviceData.Type != DeviceType.Actuator)
                    {
                        await Clients.Caller.SendAsync("Error", $"dashboard can't change {deviceData.Type} status.");
                        return;
                    }
                    await Clients.Client(pair.house).SendAsync("ReceiveDataChangeNotification", action, deviceData);
                }
                foreach (var dashId in pair.dashboards)
                {
                    if(dashId != Context.ConnectionId)
                        await Clients.Client(dashId).SendAsync("ReceiveDataChangeNotification", action, deviceData);
                }
            }
            else
            {
                await Clients.Caller.SendAsync("Error", "systemId not found.");
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var systemId = SystemConnections.FirstOrDefault(x => x.Value.house == Context.ConnectionId || x.Value.dashboards.Contains(Context.ConnectionId)).Key;

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
            return base.OnConnectedAsync();
        }

    }
}
