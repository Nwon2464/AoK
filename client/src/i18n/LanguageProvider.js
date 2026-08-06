import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { getCurrentUser, updateLanguagePreference } from "../api/authApi";
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  translate,
} from "./translations";

const LanguageContext = createContext(null);

const getStoredLanguage = () => {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isSupportedLanguage(stored) ? stored : DEFAULT_LANGUAGE;
};

export const LanguageProvider = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const [language, setLanguageState] = useState(getStoredLanguage);
  const languageRef = useRef(language);
  const selectionVersionRef = useRef(0);

  const persistLocally = useCallback((nextLanguage) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    languageRef.current = nextLanguage;
    setLanguageState(nextLanguage);
  }, []);

  const setLanguage = useCallback(async (nextLanguage) => {
    if (!isSupportedLanguage(nextLanguage)) return;

    selectionVersionRef.current += 1;
    persistLocally(nextLanguage);
    if (auth.jwtToken && localStorage.token) {
      try {
        await updateLanguagePreference(localStorage.token, nextLanguage);
      } catch (error) {
        // The local selection remains usable; account sync retries at the next login.
      }
    }
  }, [auth.jwtToken, persistLocally]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!auth.jwtToken || !localStorage.token) return undefined;

    let active = true;
    const syncVersion = selectionVersionRef.current;
    const syncAccountLanguage = async () => {
      try {
        const response = await getCurrentUser(localStorage.token);
        const accountLanguage = response.data?.user?.language;

        if (selectionVersionRef.current !== syncVersion) {
          await updateLanguagePreference(localStorage.token, languageRef.current);
          return;
        }

        if (isSupportedLanguage(accountLanguage)) {
          if (active) persistLocally(accountLanguage);
          return;
        }

        await updateLanguagePreference(localStorage.token, languageRef.current);
      } catch (error) {
        // Authentication handling remains owned by the auth flow.
      }
    };

    syncAccountLanguage();
    return () => {
      active = false;
    };
  }, [auth.jwtToken, auth.jwtUsername]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key, params) => translate(language, key, params),
  }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
};
