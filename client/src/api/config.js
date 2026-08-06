const PRODUCTION_API_URL = "https://ao-k-s.vercel.app";

export const DEPLOYMENT_URL = process.env.REACT_APP_API_BASE_URL
  || (process.env.NODE_ENV === "development" ? "" : PRODUCTION_API_URL);
