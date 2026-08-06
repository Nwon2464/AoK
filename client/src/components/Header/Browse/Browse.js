import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageProvider";

const Browse = (props) => {
    const { t } = useLanguage();
    return (
        <div className="app-flex app-flex-column app-full-height app-pd-x-1 ">
            <div
                className="app-align-self-center app-flex app-full-height app-justify-content-center app-align-items-center"
            >
                <Link to="/category/all"
                    onClick={() => props.toggleMultipleIndicator("Browse")}>
                    <h3 className="app-flex app-flex-column app-font-size-7 app-cursor-pointer ">
                        {t("common.browse")}
                    </h3>
                </Link>
            </div>
            <div className="navigation-link-indicator-container">
                {props.navInd === "Browse" && (
                    <div className="navigation-link-active-indicator"></div>
                )}
            </div>
        </div>
    );
};
export default Browse;
