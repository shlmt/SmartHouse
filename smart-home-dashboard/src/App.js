import { ThemeProvider } from "@mui/material";
import theme from "assets/theme";
import Comp from "Comp";
import { inject, observer } from "mobx-react";
import Login from "pages/Login";
import Register from "pages/Register";
import { Navigate, Route, Routes } from "react-router";

const App = (props) => {
  const isLoggedIn = props.authStore.isLoggedIn

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {isLoggedIn ?
        <>
        <Route path="/" element={<Navigate to="/dashboard"/>}/>
        <Route path="/login" element={<Navigate to="/dashboard"/>}/>
        <Route path="/register" element={<Navigate to="/dashboard"/>}/>
        <Route path="/dashboard" element={<>hi</>}/>
        </>
        :
        <>
        <Route path="/" element={<Navigate to="/login"/>}/>
        <Route path="/login" Component={Login}/>
        <Route path="/register" Component={Register}/>
        </>
        }
      </Routes>
    </ThemeProvider>
  )
}

export default inject('authStore')(observer(App))