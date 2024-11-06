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

export const deleteIncomeSource = createAsyncThunk(
  "income/deleteIncomeSource",
  async (source_id, { rejectWithValue }) => {
    try {
      await axiosPrivate.delete(`api/v1/finance/source/${source_id}/`);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editIncomeSource = createAsyncThunk(
  "income/editIncomeSource",
  async ([source_id, source_name], { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.put(
        `api/v1/finance/source/${source_id}/`,
        {
          source_name: source_name,
        }
      );
      console.log(resp);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getIncomeItemsList = createAsyncThunk(
  "income/getIncomeItemsList",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.get("api/v1/finance/income/");
      console.log(resp.data);

      return resp.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const postIncomeItems = createAsyncThunk(
  "income/postIncomeItems",
  async (form, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.post("api/v1/finance/income/", form);

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
      })
      .addCase(deleteIncomeSource.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteIncomeSource.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = false;
      })
      .addCase(deleteIncomeSource.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(editIncomeSource.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(editIncomeSource.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = false;
      })
      .addCase(editIncomeSource.rejected, (state, { error }) => {
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
      .addCase(postIncomeItems.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(postIncomeItems.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.incomeItemsList.push(payload);
        state.error = false;
      })
      .addCase(postIncomeItems.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      });
  },
});

export default incomeSlice.reducer;