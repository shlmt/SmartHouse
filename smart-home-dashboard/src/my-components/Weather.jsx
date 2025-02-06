import { Card } from "@mui/material"
import axios from "axios"
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import { useEffect, useState } from "react"

const Weather = ({coordinates}) => {

    const [currentWeather, setCurrnetWeather] = useState()
    const [updatedHour, setUpdatedhour] = useState()

    useEffect(() => {
        const lastWeather = sessionStorage.getItem('weather')
        const lastUpdateWeather = Number(sessionStorage.getItem('UpdateWeather'))
        const now = (new Date()).getTime()
        if(lastWeather && lastUpdateWeather && now-lastUpdateWeather<3600000){
            setCurrnetWeather(JSON.parse(lastWeather))
            setUpdatedhour(new Intl.DateTimeFormat('en-GB', {hour: '2-digit',minute: '2-digit',}).format(new Date(lastUpdateWeather)))
            return
        }
        if(!coordinates || coordinates.split(' ').length!=2) return
        const latitude = coordinates.split(' ')[0]
        const longitude = coordinates.split(' ')[1]
        if(!latitude || !longitude) return
        const fetchWeather = async () => {
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`)
            if(res.status==200){
                setCurrnetWeather(res.data)
                sessionStorage.setItem('UpdateWeather',now)
                sessionStorage.setItem('weather',JSON.stringify(res.data))
                setUpdatedhour(new Intl.DateTimeFormat('en-GB', {hour: '2-digit',minute: '2-digit',}).format(new Date(now)))
            }
        }  
        fetchWeather() 
      }, [coordinates]) 
    
    return ( <>
    <Card sx={{backgroundColor:'#f8f9fa', width:'250px', maxWidth:'100%'}}>
        <SoftBox
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "center", md: "flex-start" }}
            p={2.5} pb={1.5} pt={3}
        >
            <div style={{display:'flex',flexDirection:'column', gap:0}}>
                <SoftBox display="flex" alignItems='flex-end' flexWrap='wrap' pb={0}>
                    {currentWeather?.main?.temp &&
                    <SoftTypography variant='h2' color='dark' fontSize={28} fontWeight="bold">
                        {currentWeather.main.temp.toFixed(1)}&deg;C
                    </SoftTypography>}
                    {currentWeather?.name &&
                    <SoftTypography variant='p' color='dark' ml={1} fontSize={18} fontWeight='light'>
                        {currentWeather.weather[0].main}
                    </SoftTypography>}
                </SoftBox>
                {currentWeather?.weather[0]?.main &&
                <SoftTypography color='dark' fontSize={16} pb={0.5}>
                    {currentWeather.name}
                </SoftTypography>}
                {updatedHour &&
                <SoftTypography variant='p' color='text' fontSize={12}>
                    updated to {updatedHour}
                </SoftTypography>}
            </div>
            {currentWeather?.weather[0]?.icon && 
            <SoftBox
                display="grid"
                justifyContent="center"
                alignItems="center"
                bgColor='info'
                width="3.75rem"
                height="4rem"
                shadow="md"
                borderRadius="lg"
                variant="gradient"
            >
                <img src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} height='95%' style={{marginTop:'-15px'}}/>
            </SoftBox>}
        </SoftBox>
    </Card>
    </>)
}
 
export default Weather