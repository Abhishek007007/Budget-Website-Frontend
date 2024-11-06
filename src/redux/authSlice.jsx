import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";

export const userLogin = createAsyncThunk(
  "auth/login",
  async (form, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const resp = await axios.post(
        import.meta.env.VITE_BASE_API_URL + "/api/v1/login/",
        form,
        config
      );
      Cookies.set("access", resp.data.access);
      Cookies.set("refresh", resp.data.refresh);
      Cookies.set("user", JSON.stringify(resp.data.user));
      return resp.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);


export const userLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(import.meta.env.VITE_BASE_API_URL + "/api/v1/logout/", {
        refresh: Cookies.get("refresh"),
      });
      Cookies.remove("access");
      Cookies.remove("refresh");
      Cookies.remove("user");
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
    access_token: Cookies.get("access"),
    refresh_token: Cookies.get("refresh"),
    error: null,
    success: false,
    loading: false,
  },
  // reducers: {
  //   set_data: (state, action) => {
  //     state.id = action.payload.id;
  //     state.username = action.payload.username;
  //     state.email = action.payload.email;
  //     state.access_token = action.payload.access_token;
  //     state.refresh_token = action.payload.refresh_token;
  //     state.isLoggedIn = action.payload.isLoggedIn;
  //   },
  // },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.loading = false;
        state.user = payload.user;
        state.access_token = payload.access;
        state.refresh_token = payload.refresh;
        state.success = true;
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      })
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.access_token = "";
        state.refresh_token = "";
        state.success = true;
      })
      .addCase(userLogout.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const { set_data } = authSlice.actions;

export default authSlice.reducer;
