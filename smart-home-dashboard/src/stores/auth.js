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
        this.user = {username: localStorage.getItem('userName'), role:'Standard'}
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

    login = async (email, password, rememberMe=false) => {
        if(email && password){
            const res = await axios.post('/login', {email,password}, {withCredentials:true})
            if(res?.status==200){
                const user = new User(res.data)
                if(user instanceof User){
                    this.user = user
                    this.isLoggedIn = true
                    if(rememberMe){
                        localStorage.setItem('isLoggedIn','true')
                        localStorage.setItem('userName',user.username)
                    }
                }
            }
            else{
                console.log("error in login")
                localStorage.removeItem('isLoggedIn')
            }
        }
    }

    register = async (username, email, password) => {
        if(email && username && password){
            const res = await axios.post('/register', {username,email,password}, {withCredentials:true})
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

}

export default new Auth()