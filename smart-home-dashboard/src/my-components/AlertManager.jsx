import { Icon } from "@mui/material"
import { inject, observer } from "mobx-react"
import SoftAlert from "components/SoftAlert"

const AlertManager=({alertStore})=>{

    return(
        <div style={{ position: "fixed", bottom: "20px", right: "25px" }}>
            {alertStore.alerts.map(alert => (
                <div style={{width:'250px'}} key={alert.id}>
                    <SoftAlert color={alert.color ?? 'info'} dismissible>
                        {alert.icon && <Icon>{alert.icon}</Icon>}&nbsp;{alert.message}
                    </SoftAlert>
                </div>
            ))}
        </div>
    )
}

export default inject('alertStore')(observer(AlertManager))