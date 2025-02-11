import axios from "axios"
import SoftBox from "components/SoftBox"
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard"
import { useEffect, useState } from "react"

const Profile=(props)=>{

    const user = props.user
    const [location, setLocation] = useState()

    useEffect(()=>{
        const cachedLocation = sessionStorage.getItem('location')
        if(cachedLocation && cachedLocation != ''){
            setLocation(cachedLocation)
            return
        }
        if(!user.coordinates || user.coordinates.split(' ').length!=2) return
        const latitude = user.coordinates.split(' ')[0]
        const longitude = user.coordinates.split(' ')[1]
        const fetchLocation = async () => {
            const res = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=${process.env.REACT_APP_GEO_API_KEY}&language=en&no_annotations=1&pretty=1`)
            if(res.status==200 && res?.data?.results?.length>0 && res?.data?.results[0].components) {
                const loc = `${res.data.results[0].components.town}, ${res.data.results[0].components.country}`
                sessionStorage.setItem('location',loc)
                setLocation(loc)
            }
        }  
        fetchLocation() 
    },[user.coordiante])

    return(<>
        <SoftBox mt={5} mb={3} mr='50%' sx={{width:'250px'}}>
            <ProfileInfoCard
                title="user profile"
                info={{
                    fullName: user.username,
                    email: user.email,
                    location
                }}
                social={[ ]}
                action={{ route: "", tooltip: "Edit Profile" }}
            />
        </SoftBox>
    </>)
}

export default Profile