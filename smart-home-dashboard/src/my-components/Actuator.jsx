import { Card, Divider, FormControl, Grid, Icon, InputLabel, MenuItem, Select, Switch, Tooltip } from "@mui/material"
import SoftBox from "components/SoftBox"
import SoftButton from "components/SoftButton"
import SoftTypography from "components/SoftTypography"
import { useEffect, useState } from "react"
import EditStatusDialog from "./EditStatusDialog"

const Actuator=(props)=>{
    const { actuators, icon } = props
    const [selectedActuator, setSelectedActuator] = useState('all')
    const [openSelect, setOpenSelect] = useState(false)
    const [turn, setTurn] = useState(selectedActuator.isOn??'')
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(()=>{
      selectedActuator.isOn && setTurn(selectedActuator.isOn)
    },[selectedActuator])

    useEffect(()=>{
      selectedActuator?.id && setSelectedActuator(actuators.find(a=>a.id==selectedActuator.id) ?? selectedActuator)
    },[actuators])

    const handleSwitch=(event)=>{
      setTurn(event.target.checked??false)
      let ac = {...selectedActuator, isOn:event.target.checked??false}
      props.notifyChange && props.notifyChange(ac,'actuator','update')
    }

    const handleApplyStatus=(status)=>{
        let ac = {...selectedActuator, status}
        if(selectedActuator=='all')
          handleChangeAll(null,status)
        props.notifyChange && props.notifyChange(ac,'actuator','update')
    }

    const handleChangeAll=(isOn,status=null)=>{
      props.notifyChangeAll && props.notifyChangeAll(props.name,isOn,status)
    }

    return(<>
        <Card sx={{paddingBottom:'10px'}}>
        <SoftBox p={2} mt={2} mx={3} display="flex" justifyContent="center">
          <SoftBox
            display="grid"
            justifyContent="center"
            alignItems="center"
            bgColor='info'
            color="white"
            width="4rem"
            height="4rem"
            shadow="md"
            borderRadius="lg"
            variant="gradient"
          >
            <Icon fontSize="default">{icon}</Icon>
          </SoftBox>
        </SoftBox>
        <SoftBox pb={2} px={2} textAlign="center" lineHeight={1.25} fontWeight="bold">
          <SoftTypography variant="h4" textTransform="capitalize">
            {props.name}
          </SoftTypography>
          <SoftBox mt={1}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="label" color="dark">Room</InputLabel>
              <Select
                placeholder="room"
                id="select"
                labelId="label"
                value={selectedActuator.id || 'all'}
                open={openSelect}
                onOpen={() => setOpenSelect(true)}
                onClose={() => setOpenSelect(false)}
                onClick={() => setOpenSelect(!openSelect)}
              >
                <MenuItem key='all' value='all' onClick={(e)=>setSelectedActuator('all')}>
                  <Icon sx={{marginRight:'5px'}}>filter_list</Icon>
                  All
                </MenuItem>
                  {actuators.map(a=><MenuItem key={a.id} value={a.id} onClick={()=>setSelectedActuator(a)}>
                  <Icon color={a.isOn?'success':'error'} sx={{marginRight:'5px'}}>{a.isOn?'toggle_on':'toggle_off'}</Icon>{props.name=='other'?a.name+" "+a.room:a.room}</MenuItem>)}
              </Select>
            </FormControl>
          </SoftBox>
          {selectedActuator=='all' ?
            <SoftBox mt={1} display='flex' justifyContent='space-around' flexWrap='wrap'>
              <SoftButton variant="contained" color='light' size='small' circular onClick={()=>handleChangeAll(true)}>turn on</SoftButton>
              <SoftButton variant="contained" color='text' size='small' circular onClick={()=>handleChangeAll(false)}>turn off</SoftButton>
            </SoftBox>
          : <SoftBox mt={1}>
              off <Switch checked={turn ?? selectedActuator.isOn} onChange={handleSwitch}/> on
            </SoftBox>}
          {(selectedActuator.status || props.initStatus) && (<>
          <Divider />
          <Grid container alignItems="center" justifyContent='center' spacing={2}>
            <Grid item sx={11}>
              {selectedActuator.status ? <SoftTypography variant="h6">
                {Object.entries(props.initStatus ?? selectedActuator.status).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {selectedActuator?.status ? selectedActuator?.status[key] : ''}
                  </div>
                ))}
              </SoftTypography>
            : <SoftTypography fontWeight='medium' color='secondary' sx={{ cursor: 'pointer' }} onClick={()=> setOpenDialog(true)}>Edit all</SoftTypography>}
            </Grid>
            <Grid item sx={1}>
              <Tooltip title="edit" placement="top">
                <Icon color='secondary' sx={{ cursor: 'pointer' }} onClick={()=> setOpenDialog(true)}>edit</Icon>
              </Tooltip>
            </Grid>
          </Grid>
        </>)}
        </SoftBox>
      </Card>  
      <EditStatusDialog
        open={openDialog}
        setOpen={setOpenDialog}
        initStatus={props.initStatus}
        currentStatus={selectedActuator.status}
        handleApplyStatus={handleApplyStatus}
      />
    </>)
}

export default Actuator