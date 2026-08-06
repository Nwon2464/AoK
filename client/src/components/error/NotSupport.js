import React from "react";
import GlitchIcon from "./glitchIcon";
import { useLanguage } from "../../i18n/LanguageProvider";
const NotSupport = () => {
    const { t } = useLanguage();
    return (
        <div className="app-flex app-justify-content-center app-align-items-center app-full-width app-full-height app-c-text-alt">
            <div className="app-inline-flex app-align-items-center app-error-container">
                <div>
                    <GlitchIcon />
                </div>
                <div className="app-flex app-flex-column app-mg-l-05">

                    <p className="app-font-size-6">
                        {t("error.smallScreenTitle")}
                    </p>
                    <p className="app-font-size-6">{t("error.smallScreenBody")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotSupport;
