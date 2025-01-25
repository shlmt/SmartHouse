import { Link } from "react-router-dom";
import SoftBox from 'components/SoftBox'
import SoftInput from 'components/SoftInput'
import SoftTypography from 'components/SoftTypography'
import { Checkbox } from '@mui/material';
import SoftButton from 'components/SoftButton';
import { inject, observer } from 'mobx-react';
import curved6 from "assets/images/curved-images/curved14.jpg";
import CoverLayout from "layouts/authentication/components/CoverLayout";


const Register=(props)=>{
	const register = props.authStore.register
	let email,password, username, agreement

  const handleSetAgremment = () => agreement=!agreement

    return(
      <CoverLayout
        title="Welcome!"
        description="Enter your name, email and password to sign up"
        image={curved6}
      >
        <SoftBox component="form" role="form">
          <SoftBox mb={2}>
            <SoftInput placeholder="User Name" onChange={(e)=>username = e.target.value}/>
          </SoftBox>
          <SoftBox mb={2}>
            <SoftInput type="email" placeholder="Email" onChange={(e)=>email = e.target.value}/>
          </SoftBox>
          <SoftBox mb={2}>
            <SoftInput type="password" placeholder="Password" onChange={(e)=>password = e.target.value}/>
          </SoftBox>
          <SoftBox display="flex" alignItems="center">
            <Checkbox checked={agreement} onChange={handleSetAgremment} />
            <SoftTypography
              variant="button"
              fontWeight="regular"
              sx={{ cursor: "poiner", userSelect: "none" }}
            >
              &nbsp;&nbsp;I agree the&nbsp;
            </SoftTypography>
            <SoftTypography
              component="a"
              href="#"
              variant="button"
              fontWeight="bold"
              textGradient
            >
              Terms and Conditions
            </SoftTypography>
          </SoftBox>
          <SoftBox mt={4} mb={1}>
            <SoftButton variant="gradient" color="dark" fullWidth onClick={()=>{if(agreement) register(username,email,password)}}>
              sign up
            </SoftButton>
          </SoftBox>
          <SoftBox mt={3} textAlign="center">
            <SoftTypography variant="button" color="text" fontWeight="regular">
              Already have an account?&nbsp;
              <SoftTypography
                component={Link}
                to="/login"
                variant="button"
                color="dark"
                fontWeight="bold"
                textGradient
              >
                Sign in
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </CoverLayout>
    )
}

export default inject('authStore')(observer(Register))