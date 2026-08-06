import React from "react";
import { Link } from "react-router-dom";
import GlitchIcon from "./glitchIcon";
import { useLanguage } from "../../i18n/LanguageProvider";
const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div className="app-flex app-justify-content-center app-align-items-center app-full-width app-full-height app-c-text-alt">
      <div className="app-inline-flex app-align-items-center app-error-container">
        <div>
          <GlitchIcon />
        </div>
        <div className="app-flex app-flex-column app-mg-l-05">
          <p className="app-font-size-6">
            {t("error.notFound")}
          </p>
          <Link to="/category/all">
            <button className="app-border-bottom-left-radius-large app-border-bottom-right-radius-large app-border-top-left-radius-large app-border-top-right-radius-large app-align-middle app-relative app-justify-content-center app-align-items-center app-inline-flex app-core-button app-core-primary app-overflow-hidden app-cursor-pointer">
              <div className="app-flex app-button-x app-align-items-center app-flex-grow-0">
                <div>{t("error.browseChannels")}</div>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
