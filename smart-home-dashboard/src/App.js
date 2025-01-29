import { CssBaseline, ThemeProvider } from "@mui/material"
import theme from "assets/theme"
import Sidenav from "examples/Sidenav"
import { inject, observer } from "mobx-react"
import Login from "pages/Login"
import Register from "pages/Register"
import { Navigate, Route, Routes, useLocation } from "react-router"
import Profile from "pages/Profile"
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import Billing from "layouts/billing"
import { useSoftUIController } from "context"
import { useState } from "react"
import { setMiniSidenav } from "context"
import Dashboard from "pages/Dashboard"
import Comp from "Comp"
import routes from "routes"
import Upgarde from "pages/Upgrade"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"

const App = (props) => {
  const isLoggedIn = props.authStore.isLoggedIn
  const user = props.authStore.user
  const isPro = user.creditCard && user.role=='Pro' || false

  const [controller, dispatch] = useSoftUIController()
  const { miniSidenav } = controller
  const [onMouseEnter, setOnMouseEnter] = useState(false)

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false)
      setOnMouseEnter(true)
    }
  }

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true)
      setOnMouseEnter(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        {isLoggedIn ?
        <>
          <DashboardLayout>
            <DashboardNavbar username={user?.username} />
            <Sidenav
              color="dark"
              brandName="smart house"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard"/>}/>
              <Route path="/login" element={<Navigate to="/dashboard"/>}/>
              <Route path="/register" element={<Navigate to="/dashboard"/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/profile" element={<Profile user={user}/>}>
                <Route path="profile/upgrade" element={<>upgrade</>}/>
              </Route>
              <Route path="/billing" element={isPro ? <>billing</> : <Navigate to="./upgrade" />}/>
              <Route path="/scenario" element={isPro ? <>scenario</> : <Navigate to="./upgrade" />}/>
              <Route path="/history" element={isPro ? <>history</> : <Navigate to="./upgrade" />}/>
              <Route path="/logout" action={props.authStore?.logout}/>
            </Routes>
          </DashboardLayout>
        </>
        :
        <Routes>
          <Route path="/" element={<Navigate to="/login"/>}/>
          <Route path="/login" Component={Login}/>
          <Route path="/register" Component={Register}/>
          <Route path="/logout" element={<Navigate to="/login"/>}/>
          <Route path="*" element={<Navigate to="/login"/>}/>
        </Routes>
        }
    </ThemeProvider>
  )
}

export default inject('authStore')(observer(App))