import { Card } from "@mui/material"
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import { useEffect, useState } from "react"

const Clock =()=> {

    const [time, setTime] = useState(new Date())

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(new Date())
      }, 1000)
      return () => clearInterval(interval)
    }, [])
  
    const hour = time.getHours().toString().padStart(2, "0")
    const minutes = time.getMinutes().toString().padStart(2, "0")
    const dayName = time.toLocaleDateString("en-US", { weekday: "short" })
    const formattedDate = `${dayName} ${time.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })}`
  
    return (
    <Card sx={{display:'flex',backgroundColor:'#f8f9fa', width:'160px', maxWidth:'100%', height:'120px'}}>
        <SoftBox
            display="flex"
            justifyContent="center"
            alignItems={{ xs: "center", md: "flex-start" }}
            p={1} pt={3} pb={0.5}
        >
            <SoftBox
                display="flex"
                justifyContent="center"
                alignItems="end"
                bgColor='light'
                color='dark'
                width="3rem"
                height="3.25rem"
                shadow="md"
                borderRadius="lg"
                variant="gradient"
            >
                <SoftTypography fontSize={30}>{hour}</SoftTypography>
            </SoftBox>
            <SoftTypography fontSize={40} fontWeight='regular' color='dark' mt={-1} mr={0.75} ml={0.75}>:</SoftTypography>
            <SoftBox
                display="flex"
                justifyContent="center"
                alignItems="end"
                bgColor='light'
                color='dark'
                width="3rem"
                height="3.25rem"
                shadow="md"
                borderRadius="lg"
                variant="gradient"  
            >
                <SoftTypography fontSize={30}>{minutes}</SoftTypography>
            </SoftBox>
        </SoftBox>
        <SoftBox display='flex' justifyContent='center'>
            <SoftTypography fontSize={16} color='dark'>{formattedDate}</SoftTypography>
        </SoftBox>
    </Card>
    )
}

export default Clock