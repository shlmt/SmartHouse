import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Icon, Slider, Switch, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material"
import SoftBox from "components/SoftBox"
import SoftInput from "components/SoftInput"
import SoftTypography from "components/SoftTypography"
import { useEffect, useState } from "react"

const EditStatusDialog=(props)=>{
    const {open, setOpen, handleApplyStatus} = props
    const [status,setStatus] = useState(props.currentStatus ?? {})

    const handleClose = () => {
      setOpen(false)
    }

    useEffect(() => {
      setStatus(props.currentStatus ?? {})
    }, [props.currentStatus])

    const handleInputChange = (key, value) => {
      setStatus((prev) => ({
        ...prev,
        [key]: value.toString()
      }))
    }
  
    return (
      <>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault()
              handleApplyStatus(status)
              handleClose()
            },
          }}
        >
          <DialogTitle>Edit</DialogTitle>
          <DialogContent sx={{display:'flex', flexDirection:'column', gap:'10px', width:'450px', maxWidth:'90%'}}>
            {Object.entries(props.initStatus ?? status).map(([key, values]) => (
              <SoftBox key={key+'Box'}>
                <SoftTypography color='info' variant='h6'>{key}</SoftTypography>
                {values.includes('true') && values.includes('false') && values.length==2 ?
                  <FormControlLabel
                      key={key}
                      control={
                        <Switch
                          defaultChecked={status[key]=='true'}
                          onChange={(e) => handleInputChange(key, e.target.checked)}
                          color="info"
                        />
                      }
                      label={key}
                      sx={{marginLeft:'5px'}}
                  />
                : Array.isArray(values) ? values.length==2 && /^\d+$/.test(values[0]) ?
                  <Slider
                    key={key}
                    min={Number(values[0])}
                    max={Number(values[1])}
                    value={Number(status[key]??values[0])}
                    valueLabelDisplay="auto"
                    marks
                    step={Number(status[key])>=1000 ? 100 : Number(status[key])>=40 ? 10 : 1}
                    onChange={e=>handleInputChange(key,e.target.value)}
                  />
                : <ToggleButtonGroup
                    key={key}
                    value={status[key]}
                    exclusive
                    onChange={e=>handleInputChange(key,e.target.value)}
                    aria-label="text alignment"
                  >
                    {values.map(option=><ToggleButton value={option}>{option}</ToggleButton>)}
                  </ToggleButtonGroup>        
                 : <SoftInput
                    key={key}
                    label={key}
                    value={status[key]}
                    type={/^\d+$/.test(values[0]) ? "number" : "text"} 
                    onChange={(e) => handleInputChange(key, e.target.value)}
                />}</SoftBox>
            ))} 
          </DialogContent>
          <DialogActions>
            <Button color='light' onClick={handleClose}>Cancel</Button>
            <Button color='dark' type="submit">Apply</Button>
          </DialogActions>
        </Dialog>
      </>)
}

export default EditStatusDialog