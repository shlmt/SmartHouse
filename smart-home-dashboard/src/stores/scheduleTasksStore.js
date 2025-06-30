import axios from 'axios'
import { makeAutoObservable } from "mobx"

axios.defaults.baseURL = (process.env.REACT_APP_API_URL ?? "https://localhost:7231") + '/api'

axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  console.log("error:" + error.message)
})

class ScheduledTaskStore {
    tasks = []

    constructor() {
        makeAutoObservable(this)
    }

    fetchTasks = async() => {
        const res = await axios.get('/ScheduledTasks', {withCredentials:true})
        if(res?.status==200)
            this.tasks = res.data
    }

    addTask = async(task) => {
        await axios.post('/', task, {withCredentials:true})
        this.fetchTasks()
    }

    async updateTask(task) {
        await axios.put('/ScheduledTasks', task, {withCredentials:true})
        this.fetchTasks()
    }

    async deleteTask(id) {
        await axios.delete(`/ScheduledTasks/${id}`, {withCredentials:true})
        this.fetchTasks()
    }
}

export default new ScheduledTaskStore()

