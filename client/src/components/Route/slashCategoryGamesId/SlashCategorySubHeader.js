import React from "react";
import { useLanguage } from "../../../i18n/LanguageProvider";

const SlashCategorySubHeader = ({
  gameName = "",
  languages = [],
  tags = [],
  selectedLanguage = "",
  selectedTag = "",
  onLanguageChange,
  onTagChange,
}) => {
  const { t } = useLanguage();
  const showFilters = Boolean(onLanguageChange && onTagChange);

  return (
    <div className="category-page-subheader app-pd-l-2 app-pd-r-2 app-pd-t-2 app-pd-b-2">
      <div className="app-flex app-full-width app-relative app-height-15">
        <div className="app-font-size-9 app-flex app-flex-grow-1 app-justify-content-start app-full-height app-align-items-center">
          <div className="app-flex app-flex-column app-full-height">
            <div className="app-align-self-center app-flex app-full-height app-justify-content-center app-align-items-center">
              <h3 className="app-flex app-flex-column app-font-size-9">
                {gameName ? (
                  <span>
                    {t("category.livePrefix")}{" "}
                    <span className="category-page-game-name">{gameName}</span>
                    {" "}{t("category.liveSuffix")}
                  </span>
                ) : t("home.liveChannels")}
              </h3>
            </div>
            <div className="navigation-link-indicator-container category-page-tab-indicator">
              <div className="navigation-link-active-indicator" />
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="category-page-filters">
            <select
              value={selectedLanguage}
              onChange={(event) => onLanguageChange(event.target.value)}
              aria-label={t("nav.language")}
            >
              <option value="">{t("nav.language")}</option>
              {languages.map((language) => (
                <option key={language} value={language}>{language.toUpperCase()}</option>
              ))}
            </select>
            <select
              value={selectedTag}
              onChange={(event) => onTagChange(event.target.value)}
              aria-label={t("common.tag")}
            >
              <option value="">{t("common.tag")}</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlashCategorySubHeader;
