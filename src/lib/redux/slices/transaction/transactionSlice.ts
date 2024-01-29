import { Transaction } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { getTransactions } from "./transactionThunk";

interface TransactionSliceState {
  transactions: Transaction[] | null;
  numberOfPages: number;
  currentPage: number;
  limit: number;
  isLoading: boolean;
  monthlyStats: { month: string; transactions: number }[];
}

const initialState: TransactionSliceState = {
  transactions: null,
  numberOfPages: 0,
  currentPage: 1,
  limit: 10,
  isLoading: false,
  monthlyStats: [
    {
      month: "December 2023",
      transactions: 20,
    },
    {
      month: "November 2023",
      transactions: 15,
    },
  ],
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransaction: (state, action) => {
      state.transactions = action.payload;
    },
    setMonthlyStats: (state, action) => {
      state.monthlyStats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.data.transactions;
        state.numberOfPages = action.payload.data.numberOfPages;
        state.currentPage = action.payload.currentPage || state.currentPage;
        state.isLoading = false;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { setTransaction } = transactionsSlice.actions;

export default transactionsSlice.reducer;
