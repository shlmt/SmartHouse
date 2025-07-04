import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import User from '../models/User'

axios.defaults.baseURL =  (process.env.REACT_APP_API_URL ?? "https://localhost:7231") + '/api'

axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  console.log("error:" + error.message)
})

class Auth {
    _user = JSON.parse(sessionStorage.getItem('user') ?? '{}')
    _isLoggedIn = this._user.username

    constructor() {
        makeAutoObservable(this)
        this.getUserDetails()
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

    getUserDetails = async () => {
        if(this.user.username) return
        const res = await axios.get('/auth', {withCredentials:true})
        if(res?.status==200){
            const user = new User(res.data)
            if(user instanceof User){
                this.user = user
                this.isLoggedIn = true
                sessionStorage.setItem('user',JSON.stringify(user))
            }
        }
    }

    login = async (email, password, rememberMe=false) => {
        if(email && password){
            const res = await axios.post('/auth/login', {email,password,rememberMe}, {withCredentials:true})
            if(res?.status==200){
                const user = new User(res.data)
                if(user instanceof User){
                    this.user = user
                    this.isLoggedIn = true
                    rememberMe && sessionStorage.setItem('user',JSON.stringify(user))
                }
            }
            else{
                console.log("error in login")
            }
        }
    }

    register = async (username, email, password) => {
        if(email && username && password){
            const res = await axios.post('/auth/register', {username,email,password}, {withCredentials:true})
            if(res?.status==200){
                const user = new User(res.data)
                if(user instanceof User){
                    this.user = user
                    this.isLoggedIn = true
                }
            }
            else {
                console.log("error in register")
            }
        }
    }

    logout = async()=>{
        const res = await axios.get('/auth/logout')
        if(res?.status==200){
            sessionStorage.removeItem('user')
            this.user = {}
            this.isLoggedIn = false
            sessionStorage.clear()
        }
        else {
            console.log("error in logout")
        }
    }

}

export default new Auth()