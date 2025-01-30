import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Switch, TextField } from "@mui/material"
import SoftBox from "components/SoftBox"
import SoftInput from "components/SoftInput"
import { useEffect, useState } from "react"

const EditStatusDialog=(props)=>{
    const {open, setOpen, handleApplyStatus} = props
    const [status,setStatus] = useState(props.status)

    const handleClose = () => {
      setOpen(false)
    }

    useEffect(() => {
      setStatus(props.status)
    }, [props.status])

    const handleInputChange = (key, value) => {
        setStatus((prev) => ({
          ...prev,
          [key]: value,
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
          <DialogContent sx={{display:'flex',flexDirection:'column',gap:'15px'}}>
            {Object.entries(status).map(([key, value]) => (<SoftBox>
               { value.toLowerCase() === "true" || value.toLowerCase() === "false" ?
                  <FormControlLabel
                      key={key}
                      control={
                          <Switch
                            checked={value=='true'}
                            onChange={(e) => handleInputChange(key, e.target.checked.toString())}
                            color="info"
                          />
                      }
                      label={key}
                      sx={{marginLeft:'5px'}}
                  />
                : <SoftInput
                    key={key}
                    label={key}
                    value={value}
                    type={/^\d+$/.test(value) ? "number" : "text"} 
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