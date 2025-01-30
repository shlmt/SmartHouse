import { inject, observer } from "mobx-react"
import { useEffect } from "react"

const Logout=({logout})=>{

    useEffect(()=>{
        logout && logout()
    },[logout])

}

export default Logout