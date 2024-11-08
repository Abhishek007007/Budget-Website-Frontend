import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPrivate from "./../axiosInterceptors/axiosPrivate";

// Fetch groups
export const getGroups = createAsyncThunk(
  "groups/getGroups",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.get("/api/v1/finance/group/");
      return resp.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a group
export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (groupData, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.post("/api/v1/finance/group/", groupData);
      return resp.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add a member to a group
export const addGroupMember = createAsyncThunk(
  "groups/addGroupMember",
  async (data, { rejectWithValue }) => {
    try {
      const { groupId, username } = data;
      const resp = await axiosPrivate.post(
        `/api/v1/finance/group/${groupId}/add-member/`,
        { username }
      );
      return { groupId, user: resp.data.user };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch group details
export const getGroupDetails = createAsyncThunk(
  "groups/getGroupDetails",
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(`/api/v1/finance/group/${groupId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove a group member
export const removeGroupMember = createAsyncThunk(
  "groups/removeGroupMember",
  async (data, { rejectWithValue }) => {
    try {
      const { groupId, username } = data;
      if (!username) {
        return rejectWithValue("Username is required");
      }
      await axiosPrivate.delete(
        `/api/v1/finance/group/${groupId}/delete-member/${username}/`
      );
      return { groupId, username };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a group
export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (groupId, { rejectWithValue }) => {
    try {
      await axiosPrivate.delete(`/api/v1/finance/group/${groupId}/`);
      return groupId; // Return the group ID to be removed from the state
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get group expenses
export const getExpenses = createAsyncThunk(
  "expenses/getExpenses",
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(
        `/api/v1/finance/groupexpense/`
      );
      return { groupId, expenses: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create an expense
export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async ({ groupId, expenseData }, { rejectWithValue }) => {
    try {
      console.log("Expense Data:", expenseData);
      const response = await axiosPrivate.post(
        `/api/v1/finance/groupexpense/`, // Your endpoint
        {
          group: groupId,          // Assuming the 'group' field needs the group's ID
          ...expenseData           // Spreading the expense data (title, amount, description, etc.)
        }
      );
      return { groupId, expense: response.data }; // Returning the groupId and the created expense
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Handle error appropriately
    }
  }
);


export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async ({expenseId }, { rejectWithValue }) => {
    try {
      console.log(expenseId)
      await axiosPrivate.delete(`/api/v1/finance/groupexpense/${expenseId}/`);
      return { expenseId }; // Returning groupId and expenseId to remove it from state
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
  
const groupsSlice = createSlice({
  name: "groups",
  initialState: {
    groupsList: [],
    groupDetails: null,
    expenses: {}, // Initialize expenses as an empty object
    error: null,
    success: false,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get groups
      .addCase(getGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroups.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.groupsList = payload;
        state.error = null;
      })
      .addCase(getGroups.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      })
      // Create a new group
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.groupsList.push(payload);
        state.error = null;
      })
      .addCase(createGroup.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      })
      // Add a group member
      .addCase(addGroupMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGroupMember.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        const group = state.groupsList.find((g) => g.id === payload.groupId);
        if (group) {
          group.members.push(payload.user);
        }
        state.error = null;
      })
      .addCase(addGroupMember.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      })
      // Remove a group member
      .addCase(removeGroupMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeGroupMember.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        const group = state.groupsList.find((g) => g.id === payload.groupId);
        if (group) {
          group.members = group.members.filter(
            (member) => member.username !== payload.username
          );
        }
        state.error = null;
      })
      .addCase(removeGroupMember.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      })
      // Delete a group
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.groupsList = state.groupsList.filter(
          (group) => group.id !== payload
        );
        state.error = null;
      })
      .addCase(deleteGroup.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      })
      // Get group details
      .addCase(getGroupDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroupDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.groupDetails = payload;
        state.error = null;
      })
      .addCase(getGroupDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Get expenses
      .addCase(getExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExpenses.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.expenses[payload.groupId] = payload.expenses; // Store expenses by groupId
        state.error = null;
      })
      .addCase(getExpenses.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Create expense
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, { payload }) => {
        state.loading = false;
        const groupId = payload.groupId;
        if (state.expenses[groupId]) {
          state.expenses[groupId].push(payload.expense);
        }
        state.error = null;
      })
      .addCase(createExpense.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { groupId, expenseId } = payload;
        if (state.expenses[groupId]) {
          // Remove the expense from the expenses array of the specified group
          state.expenses[groupId] = state.expenses[groupId].filter(
            (expense) => expense.id !== expenseId
          );
        }
        state.error = null;
      })
      .addCase(deleteExpense.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      });
  },
});

export default groupsSlice.reducer;
