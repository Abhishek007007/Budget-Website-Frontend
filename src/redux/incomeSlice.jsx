import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPrivate from "./../axiosInterceptors/axiosPrivate";

export const getIncomeSourceList = createAsyncThunk(
  "income/getIncomeSourceList",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.get("api/v1/finance/source/");

      return resp.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const getIncomeItemsList = createAsyncThunk(
  "income/getIncomeItemsList",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.get("api/v1/finance/income/");
      console.log(resp);
      return resp.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const postIncomeSource = createAsyncThunk(
  "income/postIncomeSource",
  async (source_name, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.post("api/v1/finance/source/", {
        source_name: source_name,
      });

      return resp.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const postIncomeItems = createAsyncThunk(
  "income/postIncomeItems",
  async (source_name, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.post("api/v1/finance/income/", {
        source_name: source_name,
      });

      return resp.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const incomeSlice = createSlice({
  name: "income",
  initialState: {
    incomeSourceList: [],
    incomeItemsList: [],
    error: null,
    success: false,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIncomeSourceList.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getIncomeSourceList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.incomeSourceList = payload;
        state.error = false;
      })
      .addCase(getIncomeSourceList.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(getIncomeItemsList.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getIncomeItemsList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.incomeItemsList = payload;
        state.error = false;
      })
      .addCase(getIncomeItemsList.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(postIncomeSource.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(postIncomeSource.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.incomeSourceList.push(payload);
        state.error = false;
      })
      .addCase(postIncomeSource.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      });
  },
});

export default incomeSlice.reducer;
