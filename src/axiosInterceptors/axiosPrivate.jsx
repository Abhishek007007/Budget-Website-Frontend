import axios from "axios";
import Cookies from "js-cookie";

const refresh = Cookies.get("refresh");
const access = Cookies.get("access");

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    Authorization: "Bearer " + access,
  },
});

async function refreshAccessToken() {
  try {
    const resp = await axios.post(
      import.meta.env.VITE_BASE_API_URL + "/api/v1/token/refresh/",
      {
        refresh: refresh,
      },
      {
        headers: {
          Authorization: "Bearer " + access,
        },
      }
    );
    console.log(resp.data);
    Cookies.set("access", resp.data.access);
    Cookies.set("refresh", resp.data.refresh);
    return resp.data;
  } catch (error) {
    console.log(error);
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("user");
  }
}

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const newToken = (await refreshAccessToken()).access;
        axios.defaults.headers.common["Authorization"] = newToken;
        const prevRequest = error.config;
        prevRequest.headers["Authorization"] = newToken;
        return axios(prevRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosPrivate;
