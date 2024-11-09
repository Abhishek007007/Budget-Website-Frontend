import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosPrivate from "./../axiosInterceptors/axiosPrivate";

// Fetch the list of bill reminders
export const getBillReminders = createAsyncThunk(
  "billReminders/getBillReminders",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosPrivate.get("api/v1/finance/bills/");
      return resp.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

// Add a new bill reminder
export const addBillReminder = createAsyncThunk(
  "billReminders/addBillReminder",
  async (billData, { rejectWithValue }) => {
    console.log(billData)
    try {
      const resp = await axiosPrivate.post("api/v1/finance/bills/", billData);
      return resp.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

// Update a bill reminder (e.g., mark it as paid or edit details)
export const updateBillReminder = createAsyncThunk(
  "billReminders/updateBillReminder",
  async (billData, { rejectWithValue }) => {
    try {
      const { id, ...updatedData } = billData;
      const resp = await axiosPrivate.put(`api/v1/finance/bills/${id}/`, updatedData);
      return resp.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

// Delete a bill reminder
export const deleteBillReminder = createAsyncThunk(
  "billReminders/deleteBillReminder",
  async (id, { rejectWithValue }) => {
    try {
      await axiosPrivate.delete(`api/v1/finance/bills/${id}/`);
      return id;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export const markBillAsPaid = createAsyncThunk(
    "billReminders/markBillAsPaid",
    async (billId, { rejectWithValue }) => {
      try {
        // Send PATCH request to mark the bill as paid
        const response = await axiosPrivate.patch(`api/v1/finance/bills/${billId}/mark_paid/`);
        return response.data;  // Returning the response (status message)
      } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data);
      }
    }
  );
const initialState = {
  billReminders: [],
  error: null,
  success: false,
  loading: false,
};

export const clearBillReminders = createAction("billReminders/clearBillReminders");

const billReminderSlice = createSlice({
  name: "billReminders",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get bill reminders
      .addCase(getBillReminders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBillReminders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.billReminders = payload;
        state.error = null;
      })
      .addCase(getBillReminders.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      })

      // Add a new bill reminder
      .addCase(addBillReminder.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBillReminder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.billReminders.push(payload); // Add the new bill to the list
      })
      .addCase(addBillReminder.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })

      // Update a bill reminder
      .addCase(updateBillReminder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBillReminder.fulfilled, (state, { payload }) => {
        state.loading = false;
        const index = state.billReminders.findIndex((bill) => bill.id === payload.id);
        if (index !== -1) {
          state.billReminders[index] = payload; // Update the bill in the list
        }
      })
      .addCase(updateBillReminder.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })

      // Delete a bill reminder
      .addCase(deleteBillReminder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBillReminder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.billReminders = state.billReminders.filter((bill) => bill.id !== payload);
      })
      .addCase(deleteBillReminder.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })

      // Clear bill reminders (if needed)
      .addCase(clearBillReminders, (state) => {
        state.billReminders = [];
        state.error = null;
        state.success = false;
      })
      .addCase(markBillAsPaid.pending, (state) => {
        state.loading = true;
      })
      .addCase(markBillAsPaid.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.billReminders = state.billReminders.map((bill) =>
          bill.id === payload.id ? { ...bill, is_paid: true, payment_date: payload.payment_date } : bill
        );
        state.success = true;
      })
      .addCase(markBillAsPaid.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
      });
  },
});

export default billReminderSlice.reducer;
