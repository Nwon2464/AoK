import React, { useRef, useState } from "react";
import LoginModal from "./LogIn/LoginModal";
import { CSSTransition } from "react-transition-group";
import ClearIcon from "@material-ui/icons/Clear";

import { Tab } from "semantic-ui-react";
import { getAuthPanes } from "./LogIn/SignupReuse";
import CheckIcon from "@material-ui/icons/Check";
import { useLanguage } from "../../../../i18n/LanguageProvider";
import { useTheme } from "../../../../theme/ThemeProvider";

const DropdownMenu = (props) => {
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);
  const { language: selectedLanguage, setLanguage, t } = useLanguage();
  const { isDarkTheme, toggleTheme } = useTheme();
  const panes = getAuthPanes(t);
  React.useEffect(() => {
    // setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
    // dropdownRef.current.onclose = () => console.log("CLOSED!");
    // return () => {
    //   dropdownRef.current.onclose();
    // };

    if (dropdownRef.current) {
      setMenuHeight(dropdownRef.current.firstChild.offsetHeight);
    }

    const handleOnClose = () => {
      if (dropdownRef.current) {
        dropdownRef.current.onclose = () => console.log("CLOSED!");
      }
    };

    handleOnClose();

    return () => {
      if (dropdownRef.current) {
        dropdownRef.current.onclose = null;
      }
    };


  }, []);

  const calcHeight = (el) => {
    const height = el.offsetHeight;
    setMenuHeight(height);
  };
  const DropdownItem = (props) => {
    const modalRef = React.useRef();

    const openModal = () => {
      if (props.action === "login") {
        modalRef.current.openModal();
      }
    };

    const checkLoggedOrNot = (event) => {
      if (!props.logged) {
        props.goToMenu && setActiveMenu(props.goToMenu);
        openModal();
      } else {
        props.goToMenu && setActiveMenu(props.goToMenu);
      }
    };

    const logout = () => {
      if (props.action === "logout") {
        props.signOut();
      }
    };
    const activateItem = (event) => {
      if (props.languageCode) {
        setLanguage(props.languageCode);
        setActiveMenu("main");
        return;
      }
      if (props.action === "toggle-theme") {
        toggleTheme();
        return;
      }
      checkLoggedOrNot(event);
      logout();
    };
    return (
      <>
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

        <div

          onClick={activateItem}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              activateItem(event);
            }
          }}
          className="menu__item"
          role={props.action === "toggle-theme" ? "menuitemcheckbox" : "menuitem"}
          aria-checked={props.action === "toggle-theme" ? isDarkTheme : undefined}
          tabIndex={0}
        >
          <div className="icon__button">{props.leftIcon}</div>
          <div style={{ flexGrow: 1 }}>
            {props.children ? props.children : <>{props.userEmail}</>}
          </div>
          <div className="icon__right">
            {props.action === "toggle-theme" ? (
              <span className={`theme-toggle${isDarkTheme ? " theme-toggle--active" : ""}`} aria-hidden="true">
                <span className="theme-toggle__thumb" />
              </span>
            ) : props.rightIcon}
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      style={{ height: menuHeight }}
      ref={dropdownRef}
      className="dropdown__"
    >
      <CSSTransition
        in={activeMenu === "main"}
        classNames="menu__primary"
        unmountOnExit
        timeout={500}
        onEnter={calcHeight}
      >
        <div className="menu__">
          {props.allContents.map((contents, index) => {
            return (
              <React.Fragment key={index}>
                <DropdownItem
                  // onSignOut={props.onSignOut}
                  logged={contents.logged ? contents.logged : ""}
                  leftIcon={contents.leftIcon}
                  goToMenu={contents.goToMenu ? contents.goToMenu : ""}
                  rightIcon={contents.rightIcon}
                  signOut={props.onSignOut}
                  userEmail={props.userEmail}
                  action={contents.action}
                >
                  {contents.content}
                </DropdownItem>
              </React.Fragment>
            );
          })}
        </div>
      </CSSTransition>
      <CSSTransition
        in={activeMenu === "settings"}
        classNames="menu__secondary"
        unmountOnExit
        timeout={500}
        onEnter={calcHeight}
      >
        <div className="menu__">
          {props.languages.map((language, index) => {
            return (
              <React.Fragment key={index}>
                <DropdownItem
                  backgroundcolor={
                    language.backgroundcolor ? language.backgroundcolor : ""
                  }
                  logged={language.logged ? language.logged : ""}
                  leftIcon={language.leftIcon ? language.leftIcon : ""}
                  goToMenu={language.goToMenu ? language.goToMenu : ""}
                  languageCode={language.languageCode}
                  rightIcon={language.languageCode === selectedLanguage ? <CheckIcon /> : ""}
                >
                  {language.language}
                </DropdownItem>
              </React.Fragment>
            );
          })}
        </div>
      </CSSTransition>
    </div>
  );
};

export default DropdownMenu;
