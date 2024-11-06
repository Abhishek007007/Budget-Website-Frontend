import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPrivate from "./../axiosInterceptors/axiosPrivate";

// Fetch the list of transactions
export const getTransactions = createAsyncThunk(
  "transactions/getTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.get("api/v1/transactions/");
      return resp.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    transactionsList: [],
    error: null,
    success: false,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.transactionsList = payload;
        state.error = null;
      })
      .addCase(getTransactions.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      });
  },
});

export default transactionsSlice.reducer;