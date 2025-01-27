import * as signalR from "@microsoft/signalr"
import { makeAutoObservable, when } from "mobx"
import auth from "./auth"
import Actuator from "../models/Device"

const url = process.env.HUB_ADDRESS ?? "https://localhost:7231/systemHub"
const conn = new signalR.HubConnectionBuilder()
            .withUrl(url, { withCredentials:true })
            .withAutomaticReconnect()
            .build()

class Devices {
    _actuators = []
    _sensors = []
    _meters = []

   constructor() {
        makeAutoObservable(this) 
        when(()=>auth.isLoggedIn,
            ()=>conn.start().then(() => {
                conn.invoke("connectDashboard")
                
                conn.on("Connected", (message) => {
                    console.log("dashboardConnected:",message)
                })
                conn.on("ReceiveInitData", (data) => {
                    this.actuators = data.actuators ?? []
                    this.sensors = data.sensors ?? []
                    this.meters = data.meters ?? []
                    console.log(`ReceiveInitData:`,data)
                })
                conn.on("HouseConnected", (data) => {
                    this.actuators = data.actuators ?? []
                    this.sensors = data.sensors ?? []
                    this.meters = data.meters ?? []
                    console.log('HouseConnected',data)
                })
                conn.on("HouseDisconnected", (message) => {
                    console.log('HouseDisconnected',message)
                })
                conn.on("ReceiveMessage", (message) => {
                    console.log(`ReceiveMessage: ${message}`)
                })
                conn.on("Auth Error", (message) => {
                    auth.isLoggedIn = false
                    console.error("Auth Error:", message)
                })      
                conn.on("Error", (message) => {
                    console.error("Error:", message)
                })      
                        
                conn.on("ReceiveDataChangeNotification", (action, type, device) => {                    
                    console.log(action, type, device)
                    const typeMap = {
                        Actuator: this.actuators,
                        Meter: this.meters,
                        Sensor: this.sensors,
                    }

                    const targetArray = typeMap[type]
                    if (!targetArray) {
                        console.log("Error ReceiveDataChangeNotification: Unknown type:", type)
                        return
                    }                
                
                    switch(action){
                        case "Add":
                            if (device.id) targetArray.push(device)
                            break
                        case "Remove":
                            typeMap[type] = targetArray.filter(d => d.id !== device.id)
                            break
                        case "Update":
                            typeMap[type] = targetArray.map(d => d.id === device.id ? device : d)
                            break
                        default:
                            console.log("Error ReceiveDataChangeNotification: Unknown action :",action)
                    }
                })
            }).catch(err => console.error('connection error: '+err))
        )
    }

    set actuators(actuators){
        this._actuators = actuators
    }

    get actuators(){
        return this._actuators
    }

    set sensors(sensors){
        this._sensors = sensors
    }

    get sensors(){
        return this._sensors
    }

    set meters(meters){
        this._meters = meters
    }

    get meters(){
        return this._meters
    }

    // get lightActuators() {
    //     return this.actuators.filter(device => device.name.toLowerCase() === 'light')
    // }

    causeDeviceUpdate = (device,type,action="add") => {
        if(type.toLowerCase()=='actuator') {
            let d = new Actuator(device)
            if(d instanceof Actuator && conn.state=='Connected')
                conn?.invoke("NotifyActuatorChange", action, device)
                    .catch(err => console.error('NotifyActuatorChange error: '+err))
        }
        else {
            if(conn.state=='Connected')
                conn?.invoke("NotifyChange", action, type, device)
                    .catch(err => console.error('NotifyChange error: '+err))
        }       
    }
}

export default new Devices()