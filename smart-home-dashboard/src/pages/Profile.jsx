import SoftBox from "components/SoftBox"
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard"

const Profile=(props)=>{

    const user = props.user

    console.log(props,user);
    

    return(<>
        <SoftBox mt={5} mb={3} mr='50%' sx={{width:'20%'}}>
            <ProfileInfoCard
                title="user profile"
                info={{
                    fullName: user.username,
                    email: user.email,
                    location: user.coordiante,
                }}
                social={[ ]}
                action={{ route: "", tooltip: "Edit Profile" }}
            />
        </SoftBox>
    </>)
}

export default Profile