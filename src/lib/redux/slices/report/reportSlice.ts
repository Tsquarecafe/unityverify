import { createSlice } from "@reduxjs/toolkit";
import { getReport } from "./reportThunk";

interface ReportSliceState {
  totalIncome: number;
  numOfUsers: number;
  numOfPayments: number;
  numOfTransaction: number;
  monthlySummary: {} | null;
  isLoading: boolean;
}

const initialState: ReportSliceState = {
  totalIncome: 0,
  numOfUsers: 0,
  numOfPayments: 0,
  numOfTransaction: 0,
  monthlySummary: null,
  isLoading: false,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReport.fulfilled, (state, action) => {
        state.totalIncome = action.payload.totalIncome;
        state.numOfUsers = action.payload.numOfUsers;
        state.numOfPayments = action.payload.numOfPayments;
        state.numOfTransaction = action.payload.numOfTransaction;
        state.monthlySummary = action.payload.monthlySummary;

        state.isLoading = false;
      })
      .addCase(getReport.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const {} = reportSlice.actions;

export default reportSlice.reducer;
