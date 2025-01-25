import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import User from '../models/User'

axios.defaults.baseURL = process.env.REACT_APP_API_URL ?? "https://localhost:7231/api/auth"

axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  console.log("error:" + error.message)
})

class Auth {
    _user = {}
    _isLoggedIn = false

    constructor() {
        makeAutoObservable(this)
        this.isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') ?? false)
    }

    get user() {
        return this._user
    }

    get isLoggedIn(){
        return this._isLoggedIn
    }

    set user(user) {
        this._user = user
    }

    set isLoggedIn(isLoggedIn) {
        this._isLoggedIn = isLoggedIn
    }

    login = async (username, password) => {
        if(username && password){
            const res = await axios.post('/login', {username,password}, {withCredentials:true})
            if(res?.status==200){
                const user = new User(res.data)
                if(user instanceof User){
                    this.user = user
                    this.isLoggedIn = true
                    localStorage.setItem('isLoggedIn','true')
                }
            }
            else{
                console.log("error in login")
                localStorage.removeItem('isLoggedIn')
            }
        }
    }
}

export default new Auth()