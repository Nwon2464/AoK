import React from "react";
import { useLanguage } from "../../../../../i18n/LanguageProvider";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";
const ErrorMessage = (props) => {
  const { t } = useLanguage();
  return (
    <div className="error app__flex">
      <ErrorOutlineOutlinedIcon className="error__icon" />
      <div style={{ color: "black" }}>
        <strong>{t("common.error")}: </strong>
        {props.error}
      </div>
    </div>
  );
};

export default ErrorMessage;
