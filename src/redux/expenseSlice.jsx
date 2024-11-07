import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axiosPrivate from "./../axiosInterceptors/axiosPrivate";

// Fetch expense category list
export const getExpenseCategoryList = createAsyncThunk(
  "expense/getExpenseCategoryList",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.get("api/v1/finance/category/");
      return resp.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

// Add new expense category
export const postExpenseCategory = createAsyncThunk(
  "expense/postExpenseCategory",
  async (category_name, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.post("api/v1/finance/category/", {
        name: category_name,
      });
      return resp.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Delete an expense category
export const deleteExpenseCategory = createAsyncThunk(
  "expense/deleteExpenseCategory",
  async (category_id, { rejectWithValue }) => {
    try {
      await axiosPrivate.delete(`api/v1/finance/category/${category_id}/`);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Edit an expense category
export const editExpenseCategory = createAsyncThunk(
  "expense/editExpenseCategory",
  async ([category_id, category_name], { rejectWithValue }) => {
    try {
      await axiosPrivate.put(`api/v1/finance/category/${category_id}/`, {
        name: category_name,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fetch expense items list
export const getExpenseItemsList = createAsyncThunk(
  "expense/getExpenseItemsList",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.get("api/v1/finance/expense/");
      console.log(resp.data);
      return resp.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

// Add new expense item
export const postExpenseItem = createAsyncThunk(
  "expense/postExpenseItem",
  async (form, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.post("api/v1/finance/expense/", form);
      return resp.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Delete an expense item
export const deleteExpenseItem = createAsyncThunk(
  "expense/deleteExpenseItem",
  async (item_id, { rejectWithValue }) => {
    try {
      await axiosPrivate.delete(`api/v1/finance/expense/${item_id}/`);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Edit an expense item
export const editExpenseItem = createAsyncThunk(
  "expense/editExpenseItem",
  async (item, { rejectWithValue }) => {
    try {
      await axiosPrivate.put(`api/v1/finance/expense/${item.id}/`, {
        category: item.category.id,
        amount: item.amount,
        description: item.description,
        date: item.date,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const clearExpense = createAction("expense/clearExpense");

const initialState = {
  expenseCategoryList: [],
  expenseItemsList: [],
  error: null,
  success: false,
  loading: false,
};

// Expense slice
export const expenseSlice = createSlice({
  name: "expense",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExpenseCategoryList.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getExpenseCategoryList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.expenseCategoryList = payload;
        state.error = false;
      })
      .addCase(getExpenseCategoryList.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(postExpenseCategory.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(postExpenseCategory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.expenseCategoryList.push(payload);
        state.error = false;
      })
      .addCase(postExpenseCategory.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(deleteExpenseCategory.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteExpenseCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = false;
      })
      .addCase(deleteExpenseCategory.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(editExpenseCategory.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(editExpenseCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = false;
      })
      .addCase(editExpenseCategory.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(getExpenseItemsList.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getExpenseItemsList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.expenseItemsList = payload;
        state.error = false;
      })
      .addCase(getExpenseItemsList.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(postExpenseItem.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(postExpenseItem.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.expenseItemsList.push(payload);
        state.error = false;
      })
      .addCase(postExpenseItem.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(deleteExpenseItem.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteExpenseItem.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = false;
      })
      .addCase(deleteExpenseItem.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(editExpenseItem.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(editExpenseItem.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = false;
      })
      .addCase(editExpenseItem.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })
      .addCase(clearExpense, (state) => {
        state = initialState;
      });
  },
});

export default expenseSlice.reducer;
