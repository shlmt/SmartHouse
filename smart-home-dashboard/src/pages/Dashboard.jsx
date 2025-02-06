import { Grid } from "@mui/material"
import SoftBox from "components/SoftBox"
import { inject, observer } from "mobx-react"
import Actuator from "my-components/Actuator"
import Meter from "my-components/Meter"
import Weather from "my-components/Weather"

const actuatorsTypes = ['light','air conditioner']
const actuatorsStates = {
  'light':{tmp:['1000','7000'],power:['40','80']},
  'air conditioner':{mode:['cool','warm'],tmp:['12','38'],fun:['0','5'],isTurbo:['true','false']}
}

const Dashboard=({devicesStore,authStore})=>{

    return(<>
            {authStore?.user?.coordinates && <Weather coordinates={authStore.user.coordinates}/>}
            <SoftBox mt={3}>
            {devicesStore.actuators?.length>0 && <Grid container spacing={3} paddingBottom={3}>
                  {['light','air conditioner'].map(type=>{
                    return <Grid item xs={12} md={6} xl={3} key={type}>
                      <Actuator
                        key={type}
                        icon={type.split(' ')[0]}
                        name={type}
                        actuators={devicesStore.actuators.filter(a=>a.name==type)}
                        notifyChange={devicesStore.causeDeviceUpdate}
                        notifyChangeAll={devicesStore.causeActuatorUpdateAll}
                        initStatus={actuatorsStates[type]}
                      />
                    </Grid>
                  })}
                  <Grid item xs={12} md={6} xl={3} key='other'>
                    <Actuator
                      key='other'
                      icon='home_mini_rounded'
                      name='other'
                      actuators={devicesStore.actuators.filter(a=>!(actuatorsTypes.find(type=>type==a.name)))}
                      notifyChange={devicesStore.causeDeviceUpdate}
                      notifyChangeAll={devicesStore.causeActuatorUpdateAll}
                    />
                  </Grid>
                </Grid>}
                <Grid container spacing={3} paddingBottom={3}>
                  {devicesStore.meters.map(m=>{
                    return <Grid item xs={12} md={6} xl={3} key={m.id}>
                      <Meter meter={m}/>            
                    </Grid>
                  })}
                </Grid>
            </SoftBox>
    </>)
}

export default inject('devicesStore','authStore')(observer(Dashboard))