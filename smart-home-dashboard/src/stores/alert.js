import { makeAutoObservable } from "mobx"

const mapIcons = {
    error: 'error',
    warning: 'warning',
    success: 'check_circle',
    info: 'info',
    primary: 'circle_notifications',
    light: 'fmd_bad',
    dark: 'fmd_bad',
    secondary: 'fmd_bad'
}

class AlertStore {
    alerts = []

    constructor() {
        makeAutoObservable(this)
    }

    addAlert({message, color = 'info', icon=null, seconds=5}) {
        const id = Date.now()
        this.alerts.push({ id, message, color, icon: icon || mapIcons[color]})
        seconds && setTimeout(() => this.removeAlert(id), seconds * 1000)
    }

    removeAlert(id) {
        this.alerts = this.alerts.filter(alert => alert.id !== id);
    }
}

export default new AlertStore()
