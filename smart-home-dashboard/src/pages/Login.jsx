import { Link } from "react-router-dom";
import SoftBox from 'components/SoftBox'
import SoftInput from 'components/SoftInput'
import SoftTypography from 'components/SoftTypography'
import CoverLayout from 'layouts/authentication/components/CoverLayout'
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { Switch } from '@mui/material';
import SoftButton from 'components/SoftButton';
import { inject, observer } from 'mobx-react';

const Login=(props)=>{
	const login = props.authStore.login
	let email,password, rememberMe

	const handleSetRememberMe = () => rememberMe=!rememberMe

    return(
        <CoverLayout
          title="Welcome back"
          description="Enter your email and password to sign in"
          image={curved9}
        >
        <SoftBox component="form" role="form">
          <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Email
              </SoftTypography>
            </SoftBox>
            <SoftInput type="email" placeholder="Email" onChange={(e)=>email = e.target.value}/>
          </SoftBox>
          <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Password
              </SoftTypography>
            </SoftBox>
            <SoftInput type="password" placeholder="Password" onChange={(e)=>password = e.target.value}/>
          </SoftBox>
          <SoftBox display="flex" alignItems="center">
            <Switch checked={rememberMe} onChange={handleSetRememberMe} />
            <SoftTypography
              variant="button"
              fontWeight="regular"
            >
              &nbsp;&nbsp;Remember me
            </SoftTypography>
          </SoftBox>
          <SoftBox mt={4} mb={1}>
            <SoftButton variant="gradient" color="info" fullWidth onClick={()=>login(email,password,rememberMe)}>
              sign in
            </SoftButton>
          </SoftBox>
          <SoftBox mt={3} textAlign="center">
            <SoftTypography variant="button" color="text" fontWeight="regular">
              Don&apos;t have an account?{" "}
              <SoftTypography
                component={Link}
                to="/register"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Sign up
              </SoftTypography>
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </CoverLayout>
    )
}

export default inject('authStore')(observer(Login))