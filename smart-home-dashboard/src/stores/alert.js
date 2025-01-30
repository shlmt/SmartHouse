import { makeAutoObservable } from "mobx"

class AlertStore {
    alerts = []

    constructor() {
        makeAutoObservable(this)
    }

    addAlert({message, color = 'info', icon=null, seconds=5}) {
        const id = Date.now()
        this.alerts.push({ id, message, color, icon})
        seconds && setTimeout(() => this.removeAlert(id), seconds * 1000)
    }

    removeAlert(id) {
        this.alerts = this.alerts.filter(alert => alert.id !== id);
    }
}

export default new AlertStore()
