import axios from "axios";
import Cookies from "js-cookie";

import { userLogout } from "../redux/authSlice";
import { clearBudget } from "../redux/budgetSlice";
import { clearExpense } from "../redux/expenseSlice";
import { clearIncome } from "../redux/incomeSlice";
import { clearTransactions } from "../redux/transactionSlice";

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

async function refreshAccessToken(store) {
  try {
    const resp = await axios.post(
      import.meta.env.VITE_BASE_API_URL + "/api/v1/token/refresh/",
      {
        refresh: Cookies.get("refresh"),
      },
      {
        headers: {
          Authorization: "Bearer " + Cookies.get("access"),
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

    await store.dispatch(userLogout());
    await store.dispatch(clearExpense());
    await store.dispatch(clearIncome());
    await store.dispatch(clearTransactions());
    await store.dispatch(clearBudget());
  }
}
axiosPrivate.interceptors.request.use((config) => {
  config.headers["Authorization"] = "Bearer " + Cookies.get("access");
  return config;
});

export function axiosInterceptor(store) {
  axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        try {
          const newToken = (await refreshAccessToken(store)).access;
          const prevRequest = error.config;
          prevRequest.headers["Authorization"] = "Bearer " + newToken;

          console.log(prevRequest);
          return await axios(prevRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
}

export default axiosPrivate;
