import React, { useRef } from "react";
import { Tab } from "semantic-ui-react";
import ClearIcon from "@material-ui/icons/Clear";

import { getAuthPanes } from "./RenderAuth/NavBar/LogIn/SignupReuse";
import LoginModal from "./RenderAuth/NavBar/LogIn/LoginModal";
import { useLanguage } from "../../i18n/LanguageProvider";

const LoginSignUpButton = () => {
  const { t } = useLanguage();
  const panes = getAuthPanes(t);
  const modalRef = React.useRef();
  const tryRef = useRef();
  const modalRef2 = React.useRef();
  const openLoginModal = () => {
    modalRef.current.openModal();
  };
  const openLoginModal2 = () => {
    modalRef2.current.openModal();
  };
  return (
    <div className="app-flex app-flex-nowrap">
      <div className="app-pd-x-03">
        <button
          className="app-border-bottom-left-radius-large app-border-bottom-right-radius-large app-border-top-left-radius-large app-border-top-right-radius-large app-core-secondary app-align-middle app-relative app-justify-content-center app-align-items-center app-inline-flex app-core-button app-overflow-hidden app-cursor-pointer"
          onClick={openLoginModal}

        >
          <div className="app-button-x app align-items-center app-flex app-flex-grow-0">
            <div className="app-flex-grow-0 app-font-color">{t("nav.login")}</div>
          </div>
        </button>

        <LoginModal ref={modalRef}>
          <div className="clear__btn" onClick={() => modalRef.current.close()}>
            <ClearIcon className="clear__icon" style={{ fontSize: "2rem" }} />
          </div>
          <Tab
            style={{ width: "100%" }}
            panes={panes}
            menu={{ secondary: true, pointing: true, attached: "bottom" }}
            defaultActiveIndex={0}
          />
        </LoginModal>
      </div>
      <div className="app-pd-x-03">
        <button
          onClick={openLoginModal2}
          style={{ marginRight: "5px" }}
          className="app-border-bottom-left-radius-large app-border-bottom-right-radius-large app-border-top-left-radius-large app-border-top-right-radius-large app-align-middle app-relative app-justify-content-center app-align-items-center app-inline-flex app-core-button app-core-primary app-overflow-hidden app-cursor-pointer"
        >
          <div className="app-button-x app align-items-center app-flex app-flex-grow-0">
            <div className="app-flex-grow-0">{t("nav.signup")}</div>
          </div>
        </button>
        <LoginModal ref={modalRef2}>
          <div className="clear__btn" onClick={() => modalRef2.current.close()}>
            <ClearIcon className="clear__icon" style={{ fontSize: "2rem" }} />
          </div>
          <Tab
            ref={tryRef}
            style={{ width: "100%" }}
            panes={panes}
            menu={{ secondary: true, pointing: true, attached: "bottom" }}
            defaultActiveIndex={1}
          />
        </LoginModal>
      </div>
    </div >
  );
};
export default LoginSignUpButton;
