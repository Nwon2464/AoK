
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LanguageIcon from "@material-ui/icons/Language";
import ToggleOffOutlinedIcon from "@material-ui/icons/ToggleOffOutlined";
import Brightness2OutlinedIcon from "@material-ui/icons/Brightness2Outlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import SupervisedUserCircleOutlinedIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import SubscriptionsOutlinedIcon from "@material-ui/icons/SubscriptionsOutlined";
import SettingsApplicationsOutlinedIcon from "@material-ui/icons/SettingsApplicationsOutlined";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

export const yetLoggedInContents = [
    {
      content: "Language",
      rightIcon: <ChevronRightIcon />,
      leftIcon: <LanguageIcon />,
      goToMenu: "settings",
    },
    {
      content: "Dark Theme",
      rightIcon: <ToggleOffOutlinedIcon />,
      leftIcon: <Brightness2OutlinedIcon />,
    },
    {
      content: "Log In",
      leftIcon: <ExitToAppIcon />,
    },
  ];
  
export const loggedInContents = [
    {
      content: "",
      leftIcon: <AccountCircleOutlinedIcon />,
  
      logged: true,
      online: "Online",
      offline: "offline",
    },
    {
      content: "Creator Dashboard",
      leftIcon: <DashboardOutlinedIcon />,
      logged: true,
    },
    {
      content: "Friends",
      leftIcon: <SupervisedUserCircleOutlinedIcon />,
      logged: true,
    },
    {
      content: "Subscriptions",
      leftIcon: <SubscriptionsOutlinedIcon />,
      logged: true,
    },
  
    {
      content: "Settings",
      leftIcon: <SettingsApplicationsOutlinedIcon />,
      logged: true,
    },
    {
      content: "Language",
      goToMenu: "settings",
      rightIcon: <ChevronRightIcon />,
      leftIcon: <LanguageIcon />,
      logged: true,
    },
  
    {
      content: "Dark Theme",
      rightIcon: <ToggleOffOutlinedIcon />,
      leftIcon: <Brightness2OutlinedIcon />,
      logged: true,
    },
    {
      content: "Log Out",
      leftIcon: <ExitToAppIcon />,
      logged: true,
    },
  ];
export const languages = [
    {
      language: "Select",
      leftIcon: <ChevronLeftIcon />,
      goToMenu: "main",
      backgroundcolor: "#EFEFF1",
      logged: true,
    },
    {
      language: "English",
      logged: true,
    },
    {
      language: "Dansk",
      logged: true,
    },
    {
      language: "English - UK",
      logged: true,
    },
    {
      language: "Español - España",
      logged: true,
    },
    {
      language: "中文 简体",
      logged: true,
    },
    {
      language: "日本語",
      logged: true,
    },
    {
      language: "한국어",
      logged: true,
    },
  ];
  