import * as signalR from "@microsoft/signalr"
import { makeAutoObservable, when } from "mobx"
import auth from "./auth"
import Actuator from "../models/Actuator"
import alert from "./alert"

const url = (process.env.REACT_APP_API_URL ?? "https://localhost:7231") + "/systemHub"
const conn = new signalR.HubConnectionBuilder()
            .withUrl(url, { withCredentials:true })
            .withAutomaticReconnect()
            .build()

class Devices {
    _actuators = []
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
                    this.meters = data.meters ?? []
                })
                conn.on("HouseConnected", (data) => {
                    this.actuators = data.actuators ?? []
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
                                if (index !== -1) {
                                    this[type.toLowerCase() + 's'][index] = {
                                        ...this[type.toLowerCase() + 's'][index], 
                                        ...Object.fromEntries(Object.entries(device).filter(([_, value]) => value !== null))
                                    }
                                }                                                                break
                        default:
                            console.log("Error ReceiveDataChangeNotification: Unknown action :",action)                        
                    }
                })

                conn.on("RecieveActuatorChangeAll",(name,isOn,status)=>{
                    this.actuators = this.actuators.map(a=>{
                        return a.name == name ? 
                        {
                            ...a,
                            status: {...a.status, ...Object.fromEntries(Object.entries(status).filter(([_, value]) => value !== null))},
                            isOn: isOn!=null ? isOn : a.isOn
                        }
                        : a
                    })
                })

                conn.on("NotifySensorAlert",(sensor,room,msg)=>{
                    alert.addAlert({message:`Warning: ${sensor} in ${room??'house'}. ${msg}`,color:'warning',seconds:null})
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
                conn?.invoke("NotifyMeterChange", action, type, device)
                    .catch(err => console.error('NotifyMeterChange error: '+err))
        }       
    }

    causeActuatorUpdateAll = (name,isOn,status=null) => {
        if(conn.state=='Connected' && name!='')
            conn?.invoke("NotifyActuatorChangeAll", name, isOn, status)
                .catch(err => console.error('NotifyActuatorChangeAll error: '+err))
    }
}

export default new Devices()