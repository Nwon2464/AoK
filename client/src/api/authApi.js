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
