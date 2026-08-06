import axios from "axios";

import { DEPLOYMENT_URL } from "./config";

export const signUp = (formValues) => (
  axios.post(`${DEPLOYMENT_URL}/auth/signup`, {
    ...formValues,
  })
);

export const login = (formValues) => (
  axios.post(`${DEPLOYMENT_URL}/auth/login`, {
    ...formValues,
  })
);

export const getCurrentUser = (token) => (
  axios.get(`${DEPLOYMENT_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
);

export const updateLanguagePreference = (token, language) => (
  axios.patch(`${DEPLOYMENT_URL}/auth/preferences/language`, { language }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
);
