import CreditCard from "examples/Icons/CreditCard";
import Profile from "pages/Profile";
import Billing from "pages/Billing";
import Dashboard from "pages/Dashboard";
import { AutoGraphRounded, DashboardRounded, Person4Rounded, Timelapse } from "@mui/icons-material";

const routes = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      route: "/dashboard",
      icon: <DashboardRounded size="12px" />,
      component: <Dashboard/>,
      noCollapse: true,
    },
    {
      type: "collapse",
      name: "Scenario",
      key: "scenario",
      route: "/scenario",
      icon: <Timelapse size="12px" />,
      component: <>trigers</>,
      noCollapse: true,
    },
    {
      type: "collapse",
      name: "History",
      key: "history",
      route: "/history",
      icon: <AutoGraphRounded size="12px" />,
      component: <>history</>,
      noCollapse: true,
    },
    { type: "title", title: "Account", key: "account-pages" },
    {
      type: "collapse",
      name: "Profile",
      key: "profile",
      route: "/profile",
      icon: <Person4Rounded size="12px" />,
      component: <Profile/>,
      noCollapse: true,
    },
    {
      type: "collapse",
      name: "Billing",
      key: "billing",
      route: "/billing",
      icon: <CreditCard size="12px" />,
      component: <Billing/>,
      noCollapse: true,
    }
  ];  

export default routes;
