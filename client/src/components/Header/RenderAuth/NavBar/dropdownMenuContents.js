
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LanguageIcon from "@material-ui/icons/Language";
import Brightness2OutlinedIcon from "@material-ui/icons/Brightness2Outlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import SupervisedUserCircleOutlinedIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import SubscriptionsOutlinedIcon from "@material-ui/icons/SubscriptionsOutlined";
import SettingsApplicationsOutlinedIcon from "@material-ui/icons/SettingsApplicationsOutlined";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { languageOptions } from "../../../../i18n/translations";

export const getYetLoggedInContents = (t) => [
    {
      content: t("nav.language"),
      rightIcon: <ChevronRightIcon />,
      leftIcon: <LanguageIcon />,
      goToMenu: "settings",
    },
    {
      content: t("nav.darkTheme"),
      leftIcon: <Brightness2OutlinedIcon />,
      action: "toggle-theme",
    },
    {
      content: t("nav.login"),
      leftIcon: <ExitToAppIcon />,
      action: "login",
    },
  ];
export const getLoggedInContents = (t) => [
    {
      content: "",
      leftIcon: <AccountCircleOutlinedIcon />,
  
      logged: true,
      online: "Online",
      offline: "offline",
    },
    {
      content: t("nav.creatorDashboard"),
      leftIcon: <DashboardOutlinedIcon />,
      logged: true,
    },
    {
      content: t("nav.friends"),
      leftIcon: <SupervisedUserCircleOutlinedIcon />,
      logged: true,
    },
    {
      content: t("nav.subscriptions"),
      leftIcon: <SubscriptionsOutlinedIcon />,
      logged: true,
    },
  
    {
      content: t("nav.settings"),
      leftIcon: <SettingsApplicationsOutlinedIcon />,
      logged: true,
    },
    {
      content: t("nav.language"),
      goToMenu: "settings",
      rightIcon: <ChevronRightIcon />,
      leftIcon: <LanguageIcon />,
      logged: true,
    },
  
    {
      content: t("nav.darkTheme"),
      leftIcon: <Brightness2OutlinedIcon />,
      logged: true,
      action: "toggle-theme",
    },
    {
      content: t("nav.logout"),
      leftIcon: <ExitToAppIcon />,
      logged: true,
      action: "logout",
    },
  ];
export const getLanguages = (t) => [
    {
      language: t("nav.selectLanguage"),
      leftIcon: <ChevronLeftIcon />,
      goToMenu: "main",
      backgroundcolor: "#EFEFF1",
      logged: true,
    },
    ...languageOptions.map(({ code, label }) => ({
      language: label,
      languageCode: code,
      logged: true,
    })),
  ];
