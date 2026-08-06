import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { completeGoogleLogin } from "../../actions";
import "./googleAuth/GoogleAuthCallback.css";
import { useLanguage } from "../../i18n/LanguageProvider";

const GoogleAuthCallback = ({ completeGoogleLogin: acceptToken, history, location }) => {
  const { t } = useLanguage();
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fragment = new URLSearchParams(location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(location.search);
    const token = fragment.get("token");

    if (!token) {
      setError(
        query.get("error") === "google_auth_failed"
          ? "Google login was not completed."
          : "Google did not return a valid login token."
      );
      return undefined;
    }

    window.history.replaceState(
      null,
      document.title,
      `${location.pathname}${location.search}`
    );

    const finishLogin = async () => {
      const accepted = await acceptToken(token);
      if (cancelled) return;

      if (accepted) {
        history.replace("/");
        return;
      }

      setError("The Google login token is invalid or expired.");
    };

    finishLogin();

    return () => {
      cancelled = true;
    };
  }, [acceptToken, history, location.hash, location.search]);

  return (
    <main className="google-auth-callback">
      {error ? (
        <div role="alert" className="google-auth-status">
          <h1>{t("auth.googleFailed")}</h1>
          <p>{error}</p>
          <Link to="/">{t("auth.returnHome")}</Link>
        </div>
      ) : (
        <div className="google-auth-status" role="status" aria-label={t("auth.completing")}>
          <span className="google-auth-spinner" aria-hidden="true" />
        </div>
      )}
    </main>
  );
};

export default connect(null, { completeGoogleLogin })(GoogleAuthCallback);
