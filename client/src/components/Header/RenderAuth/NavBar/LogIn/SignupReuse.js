import React from "react";
import SubmitValidationForm from "./SubmitValidationForm";
import { ReactComponent as TwitchIcon } from "../../../headerIcons/twitch-seeklogo.com.svg";
import { Tab } from "semantic-ui-react";
import LoginModalForm from "./LoginModalForm";
import { DEPLOYMENT_URL } from "../../../../../api/config";

export const getAuthPanes = (t) => [
  {
    menuItem: t("nav.login"),
    render: () => (
      <>
        <div className="app__join" style={{ backgroundColor: "inherit" }}>
          <figure className="app__flex app__margin__0">
            <TwitchIcon />
          </figure>
          <div className="app__marginLeft__0_5">
            <h4 className="app__fontSize__1_7 app__fontWeight__b">
              {t("auth.loginTitle")}
            </h4>
          </div>
        </div>
        <Tab.Pane attached={false} style={{ backgroundColor: "inherit" }}>
          <LoginModalForm />
        </Tab.Pane>
      </>
    ),
  },
  {
    menuItem: t("nav.signup"),
    render: () => (
      <>
        <div className="app__join">
          <figure className="app__flex app__margin__0">
            <TwitchIcon />
          </figure>
          <div className="app__marginLeft__0_5">
            <h4 className="app__fontSize__1_7 app__fontWeight__b">
              {t("auth.signupTitle")}
            </h4>
          </div>
        </div>
        <Tab.Pane attached={false} style={{ backgroundColor: "var(--theme-surface-raised)" }}>
          <SubmitValidationForm />
        </Tab.Pane>
      </>
    ),
  },
  {
    menuItem: {
      as: "a",
      className: "google-auth-menu-item",
      content: (
        <span className="google-auth-menu-content">
          <span className="login-google-mark" aria-hidden="true">G</span>
          <span>{t("nav.loginGoogle")}</span>
        </span>
      ),
      href: `${DEPLOYMENT_URL}/auth/google`,
      key: "google-login",
    },
    render: () => null,
  },
];
