import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPrivate from "./../axiosInterceptors/axiosPrivate";

// Fetch the current budget details
export const getBudget = createAsyncThunk(
  "budget/getBudget",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.get("api/v1/finance/budgets/");
      return resp.data; // Assuming the response contains an array of budget objects
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create a new budget
export const createBudget = createAsyncThunk(
  "budget/createBudget",
  async (budgetData, { rejectWithValue, getState }) => {
    try {
      // Check if a budget already exists
      const state = getState();
      if (state.budget.budgets.length > 0) {
        return rejectWithValue("A budget already exists. You can only have one active budget.");
      }

      const resp = await axiosPrivate.post("api/v1/finance/budgets/", budgetData);
      return resp.data; // Assuming the response contains the newly created budget
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateBudget = createAsyncThunk(
    "budget/updateBudget",
    async ({ budgetId, updatedData }, { rejectWithValue }) => {
      try {
        const resp = await axiosPrivate.put(`api/v1/finance/budgets/${budgetId}/`, updatedData);
        return resp.data; // Assuming the response contains the updated budget
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );
  

// Delete a budget
export const deleteBudget = createAsyncThunk(
  "budget/deleteBudget",
  async (budgetId, { rejectWithValue }) => {
    try {
      await axiosPrivate.delete(`api/v1/finance/budgets/${budgetId}/`);
      return budgetId; // Return the ID of the deleted budget
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    budgets: [], // Array to store multiple budgets
    error: null,
    success: false,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all budget details
      .addCase(getBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBudget.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.budgets = payload; // Assuming payload is an array of budgets
        state.error = null;
      })
      .addCase(getBudget.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      // Create a new budget
      .addCase(createBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.budgets.push(payload); // Add the new budget to the array
        state.error = null;
      })
      .addCase(createBudget.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload; // Use the rejected value for error message
        state.success = false;
      })
      // Update an existing budget
      .addCase(updateBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
      
        // Find the budget to update
        const index = state.budgets.findIndex(budget => budget.id === payload.id);
        if (index !== -1) {
          state.budgets[index] = payload; // Update the existing budget with the updated payload
        }
      
        state.error = null;
      })
      .addCase(updateBudget.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload; // Use the rejected value for error message
        state.success = false;
      })
      // Delete a budget
      .addCase(deleteBudget.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBudget.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.budgets = state.budgets.filter((budget) => budget.id !== payload); // Remove the deleted budget from the array
      })
      .addCase(deleteBudget.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      });
  },
});

export default budgetSlice.reducer;
