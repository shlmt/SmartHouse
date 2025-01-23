import * as signalR from "@microsoft/signalr"
import { makeAutoObservable, when } from "mobx"
import Device from "../models/Device"
import auth from "./auth"

const systemId = '1234' // meantime
const url = process.env.HUB_ADDRESS ?? "https://localhost:7231/systemHub"
const conn = new signalR.HubConnectionBuilder()
            .withUrl(url, { withCredentials:true })
            .withAutomaticReconnect()
            .build()

class Devices {
    _devices = []

    constructor() {
        makeAutoObservable(this) 
        when(()=>auth.isLoggedIn,
            ()=>conn.start().then(() => {
                conn.invoke("connectDashboard",systemId)
                
                conn.on("Connected", (message) => {
                    console.log("dashboardConnected:",message)
                    conn.invoke("SendMessage", systemId, "DASHBOARD", "Hello from DASHBOARD!");
                })
                conn.on("ReceiveInitData", (data) => {
                    this.devices = data
                    console.log(`ReceiveInitData:`,data)
                })
                conn.on("HouseConnected", (data) => {
                    this.devices = data
                    console.log('HouseConnected',data)
                })
                conn.on("HouseDisconnected", (message) => {
                    console.log('HouseDisconnected',message)
                })
                conn.on("ReceiveMessage", (message) => {
                    console.log(`ReceiveMessage: ${message}`)
                })
                conn.on("Error", (message) => {
                    console.error("Error:", message)
                })      
                        
                conn.on("ReceiveDataChangeNotification", (action, device) => {                    
                    console.log(`Action ${action} on childId: ${device.id}`, device)
                    switch(action){
                        case "Add":
                            if(device.id)
                                this.devices.push(device)
                            break
                        case "Remove":
                            this.devices = this.devices.filter(d => d.id != device.id)
                            break
                        case "Update":
                            this.devices = this.devices.map(d => d.id == device.id ? device : d)
                            break
                        default:
                            console.log("no action")
                    }
                })
            }).catch(err => console.error('connection error: '+err))
        )
    }

    set devices(devices){
        this._devices = devices
    }

    get devices(){
        return this._devices
    }

    get actuatorsDevices() {
        return this.devices.filter(device => device.type === 'Actuator')
    }

    get sensorsDevices() {
        return this.devices.filter(device => device.type === 'Sensor')
    }

    get metersDevices() {
        return this.devices.filter(device => device.type === 'Meter')
    }

    causeDeviceUpdate = (device,action="add") => {
        let d = new Device(device)
        if(d instanceof Device && conn.state=='Connected')
            conn?.invoke("NotifyDataChange", systemId, action, d)
                .catch(err => console.error('NotifyDataChange error: '+err))
    }
}

export default new Devices()