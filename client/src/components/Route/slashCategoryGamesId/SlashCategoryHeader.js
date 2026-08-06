import React from "react";

import { checkViewers } from "../../Body/checkViewers";
import { useLanguage } from "../../../i18n/LanguageProvider";

const SlashCategoryHeader = ({ boxImage, gameName, totalViewers }) => {
  const { t } = useLanguage();
  return (
    <section
      className="category-page-banner"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(14, 14, 16, 0.96), rgba(14, 14, 16, 0.76)), url(${boxImage})` }}
    >
      <img
        className="category-page-cover"
        src={boxImage}
        alt={`${gameName} category cover`}
        loading="eager"
        decoding="async"
      />
      <div className="category-page-summary">
        <h1>{gameName}</h1>
        <p>{checkViewers(totalViewers, t("common.viewers"))}</p>
      </div>
    </section>
  );
};

export default SlashCategoryHeader;
