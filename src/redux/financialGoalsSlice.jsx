import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axiosPrivate from "./../axiosInterceptors/axiosPrivate";

// Fetch all goals
export const getGoals = createAsyncThunk(
  "goals/getGoals",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.get("api/v1/finance/goals/");
      return resp.data; // Assuming the response contains an array of goals
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create a new goal
export const createGoal = createAsyncThunk(
  "goals/createGoal",
  async (goalData, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.post("api/v1/finance/goals/", goalData);
      return resp.data; // Assuming the response contains the newly created goal
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update an existing goal
export const updateGoal = createAsyncThunk(
  "goals/updateGoal",
  async ({ goalId, updatedData }, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.put(
        `api/v1/finance/goals/${goalId}/`,
        updatedData
      );
      return resp.data; // Assuming the response contains the updated goal
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Delete a goal
export const deleteGoal = createAsyncThunk(
  "goals/deleteGoal",
  async (goalId, { rejectWithValue }) => {
    try {
      await axiosPrivate.delete(`api/v1/finance/goals/${goalId}/`);
      return goalId; // Return the ID of the deleted goal
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  goals: [],
  error: null,
  success: false,
  loading: false,
};

export const clearGoals = createAction("goals/clearGoals");

const goalsSlice = createSlice({
  name: "goals",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGoals.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.goals = payload;
        state.error = null;
      })
      .addCase(getGoals.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(createGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.goals.push(payload);
        state.error = null;
      })
      .addCase(createGoal.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      })
      .addCase(updateGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        const index = state.goals.findIndex((goal) => goal.id === payload.id);
        if (index !== -1) {
          state.goals[index] = payload;
        }
        state.error = null;
      })
      .addCase(updateGoal.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      })
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGoal.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.goals = state.goals.filter((goal) => goal.id !== payload);
      })
      .addCase(deleteGoal.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(clearGoals, (state) => {
        state = initialState;
      });
  },
});

export default goalsSlice.reducer;
