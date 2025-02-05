import { VolumeDown, VolumeUp } from "@mui/icons-material"
import { Grid, Slider, Stack } from "@mui/material"
import SoftBox from "components/SoftBox"
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard"
import MediaPlayer from "layouts/virtual-reality/components/MediaPlayer"
import { inject, observer } from "mobx-react"
import Actuator from "my-components/Actuator"
import Weather from "my-components/Weather"

const actuatorsTypes = ['light','air conditioner']
const actuatorsStates = {
  'light':{tmp:['1000','7000'],power:['40','80']},
  'air conditioner':{mode:['cool','warm'],tmp:['12','38'],fun:['0','5'],isTurbo:['true','false']}
}

const Dashboard=(props)=>{

    const actuators = props.devicesStore.actuators

    return(<>
            <Weather />
            <SoftBox mt={5}>
            {actuators?.length>0 && <Grid container spacing={3} paddingBottom={3}>
                  {['light','air conditioner'].map(type=>{
                    return <Grid item xs={12} md={6} xl={3} key={type}>
                      <Actuator
                        key={type}
                        icon={type.split(' ')[0]}
                        name={type}
                        actuators={actuators.filter(a=>a.name==type)}
                        notifyChange={props.devicesStore.causeDeviceUpdate}
                        notifyChangeAll={props.devicesStore.causeActuatorUpdateAll}
                        initStatus={actuatorsStates[type]}
                      />
                    </Grid>
                  })}
                  <Grid item xs={12} md={6} xl={3} key='other'>
                    <Actuator
                      key='other'
                      icon='home_mini_rounded'
                      name='other'
                      actuators={actuators.filter(a=>!(actuatorsTypes.find(type=>type==a.name)))}
                      notifyChange={props.devicesStore.causeDeviceUpdate}
                      notifyChangeAll={props.devicesStore.causeActuatorUpdateAll}
                    />
                  </Grid>
                </Grid>}
                <Grid container spacing={3} paddingBottom={3}>
                  {props.devicesStore.meters.map(meter=>{
                    return <Grid item xs={12} md={6} xl={3} key={meter.id}>
                      <MiniStatisticsCard
                        title={{ text: meter.name }}
                        count={meter.value}
                        percentage={{ color: "error", text: "" }}
                        icon={{ color: "success", component: meter.name }}
                      />                
                    </Grid>
                  })}
                </Grid>
            </SoftBox>
    </>)
}

export default inject('devicesStore')(observer(Dashboard))