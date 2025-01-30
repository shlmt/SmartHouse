import * as signalR from "@microsoft/signalr"
import { makeAutoObservable, when } from "mobx"
import auth from "./auth"
import Actuator from "../models/Actuator"
import alert from "./alert"

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
                    alert.addAlert({message:'Error: '+message,color:'error'})
                })      
                        
                conn.on("ReceiveDataChangeNotification", (action, type, device) => { 
                    if (device.id) switch(action){
                        case "Add":
                            this[type.toLowerCase()+'s'].push(device)
                            break
                            case "Remove":
                                this[type.toLowerCase() + 's'] = this[type.toLowerCase() + 's'].filter(d => d.id !== device.id)
                                break
                            case "Update":
                                const index = this[type.toLowerCase() + 's'].findIndex(d => d.id === device.id)
                                if (index !== -1) this[type.toLowerCase() + 's'][index] = { ...device }
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

    get lightActuators() {
        return this.actuators.filter(device => device.name.toLowerCase() === 'light')
    }

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