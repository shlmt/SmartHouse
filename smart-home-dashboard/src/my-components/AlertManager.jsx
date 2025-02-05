import { Icon } from "@mui/material"
import { inject, observer } from "mobx-react"
import SoftAlert from "components/SoftAlert"
import useSound from "use-sound"
import { useEffect } from "react"

const soundUrl = 'warning.wav'

const AlertManager=({alertStore})=>{

    const [play, { stop }] = useSound(soundUrl)
    
    useEffect(() => {
        stop()
        if (alertStore.alerts.some(alert => alert.color === "warning")){
            play()
        } 
    }, [alertStore.alerts, alertStore.alerts.length]) 

    const handleDismiss = (alertId) => {
        stop()
        setTimeout(()=>alertStore.removeAlert(alertId),1000)
    }

    return(
        <div style={{ position: "fixed", bottom: "20px", right: "25px", zIndex:'10000' }}>
            {alertStore.alerts.map(alert => (
                <div key={alert.id}>
                    <SoftAlert color={alert.color ?? 'info'} dismissible onClose={()=>handleDismiss(alert.id)}>
                        {alert.icon && <Icon>{alert.icon}</Icon>}&nbsp;{alert.message}
                    </SoftAlert>
                </div>
            ))}
        </div>
    )
}

export default inject('alertStore')(observer(AlertManager))