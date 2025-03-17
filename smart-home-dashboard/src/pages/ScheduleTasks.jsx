import React, { useEffect, useState } from "react"
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Switch,
  Grid,
  CardContent,
  Card} from "@mui/material"
import { Delete, Edit } from "@mui/icons-material"
import { inject, observer } from "mobx-react"
import SoftButton from "components/SoftButton"
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"

const ScheduledTasks = ({scheduledTasksStore}) => {
  const [open, setOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)

  useEffect(() => {
    scheduledTasksStore.fetchTasks()
  }, [])

  const deleteTask = (id) =>{
    alert('delete '+id)
  }

  const handleOpen = (task = null) => {
    setCurrentTask(task || { name: "", recurrence: "none", hour: "", isOn: true, deviceId: "", deviceType: "" })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setCurrentTask(null)
  }

  const handleChange = (e) => {
    setCurrentTask({ ...currentTask, [e.target.name]: e.target.value })
  }

  const handleToggle = (e) => {
    setCurrentTask({ ...currentTask, isOn: e.target.checked })
  }

  const handleSubmit = () => {
    if (currentTask.id) {
      scheduledTasksStore.updateTask(currentTask)
    } else {
      scheduledTasksStore.addTask(currentTask)
    }
    handleClose()
  }

  return (
    <Container>
      <SoftBox pb={2}>
        {scheduledTasksStore?.tasks ?
        <Grid container spacing={2}>
            {scheduledTasksStore.tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card variant="outlined">
                <CardContent>
									<SoftTypography variant="h6">{task.name}</SoftTypography>
									<SoftTypography color="textSecondary">
									{`hour: ${task.hour}, recurrence type: ${task.recurrence}`}
									</SoftTypography>
									<IconButton aria-label="edit" onClick={() => handleOpen(task)}>
										<Edit />
									</IconButton>
									<IconButton aria-label="delete" onClick={() => deleteTask(task.id)}>
										<Delete />
									</IconButton>
                </CardContent>
              </Card>
            </Grid>
            ))}
        </Grid>
      : <>not found</>}
      </SoftBox>

      <SoftButton variant="gradient" color="info" onClick={() => handleOpen()}>
        schedule new task
      </SoftButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentTask?.id ? "edit" : "add"}</DialogTitle>
        <DialogContent>
          <TextField label="name" name="name" fullWidth margin="dense" value={currentTask?.name || ""} onChange={handleChange} />

          <FormControl fullWidth margin="dense">
            <InputLabel>recurrence type</InputLabel>
            <Select name="recurrence" value={currentTask?.recurrence || "none"} onChange={handleChange}>
              <MenuItem value="none">Once</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </Select>
          </FormControl>

          {currentTask?.recurrence === "weekly" && (
          <FormControl fullWidth margin="dense">
            <InputLabel>day of week</InputLabel>
            <Select name="dayOfWeek" value={currentTask?.dayOfWeek || "none"} onChange={handleChange}>
              <MenuItem value="sunday">Sunday</MenuItem>
              <MenuItem value="monday">Monday</MenuItem>
              <MenuItem value="tuesday">Tuesday</MenuItem>
              <MenuItem value="wednesday">Wednesday</MenuItem>
              <MenuItem value="thursday">Thursday</MenuItem>
              <MenuItem value="friday">Friday</MenuItem>
              <MenuItem value="saturday">Saturday</MenuItem>
            </Select>
          </FormControl>
          )}

          <TextField label="hour" name="hour" type="time" fullWidth margin="dense" value={currentTask?.hour || ""} onChange={handleChange} />

          <FormControl fullWidth margin="dense">
            <InputLabel>choose by</InputLabel>
            <Select name="deviceSelection" value={currentTask?.deviceId ? "deviceId" : "deviceType"} onChange={handleChange}>
              <MenuItem value="deviceId">single device</MenuItem>
              <MenuItem value="deviceType">device type</MenuItem>
            </Select>
          </FormControl>

          {currentTask?.deviceSelection === "deviceId" ? (
            <TextField label="device" name="deviceId" fullWidth margin="dense" value={currentTask?.deviceId || ""} onChange={handleChange} />
						// select
          ) : (
            <TextField label="deviceType" name="deviceType" fullWidth margin="dense" value={currentTask?.deviceType || ""} onChange={handleChange} />
						// select
          )}

          <FormControl fullWidth margin="dense">
            <InputLabel>status</InputLabel>
            <Select name="isOn" value={currentTask?.isOn} onChange={(e) => handleToggle({ target: { checked: e.target.value === "on" } })}>
              <MenuItem value="true">turn on</MenuItem>
              <MenuItem value="false">turn of</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {currentTask?.id ? "update" : "apply"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default inject('scheduledTasksStore')(observer(ScheduledTasks))
