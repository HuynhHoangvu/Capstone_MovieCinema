import axios from "axios";
const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NyIsIkhldEhhblN0cmluZyI6IjIzLzAzLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3NDIyNDAwMDAwMCIsIm5iZiI6MTc0NzI2NzIwMCwiZXhwIjoxNzc0Mzk2ODAwfQ.8AWlFkAkN_xwXppJe_FTgiJXS4WlItjxLy5olIf33HY";

const api = axios.create({
  baseURL: "https://movienew.cybersoft.edu.vn/api/",
});

api.interceptors.request.use((config) => {
  let userAccessToken = "";

  const keysToCheck = Object.keys(localStorage);

  for (const key of keysToCheck) {
    const item = localStorage.getItem(key);
    if (item?.includes("accessToken")) {
      try {
        userAccessToken = JSON.parse(item).accessToken;
        if (userAccessToken) break;
      } catch { }
    }
  }

  const authHeader = userAccessToken ? `Bearer ${userAccessToken}` : "";

  config.headers = {
    ...config.headers,
    Authorization: authHeader,

    TokenCybersoft: TOKEN_CYBERSOFT,
  }

  return config
}, (error) => {
  return Promise.reject(error);
});

export default api;