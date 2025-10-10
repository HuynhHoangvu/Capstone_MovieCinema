import axios from "axios";

const  api = axios.create({
    baseURL:"https://movienew.cybersoft.edu.vn/api/",

})

api.interceptors.request.use((config)=>{
    const accessToken = localStorage.getItem("ADMIN_INFO") ? "Bearer " + JSON.parse(localStorage.getItem("ADMIN_INFO")).accessToken : "";
    config.headers = {
        ...config.headers,
        Authorization: accessToken,
       TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NyIsIkhldEhhblN0cmluZyI6IjIzLzAzLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3NDIyNDAwMDAwMCIsIm5iZiI6MTc0NzI2NzIwMCwiZXhwIjoxNzc0Mzk2ODAwfQ.8AWlFkAkN_xwXppJe_FTgiJXS4WlItjxLy5olIf33HY"
    }
    return config
})
export default api;