import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { useEffect, useState } from "react"

const EditStatusDialog=(props)=>{
    const {open, setOpen, handleApplyStatus} = props
    const [status,setStatus] = useState(props.status)

    const handleClose = () => {
      setOpen(false)
    }

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
          <DialogContent>
            {Object.entries(status).map(([key, value]) => (
                <TextField
                    color='info'
                    key={key}
                    label={key}
                    value={value}
                    variant="standard"
                    margin="dense"
                    fullWidth
                    onChange={(e) => handleInputChange(key, e.target.value)}
                />
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