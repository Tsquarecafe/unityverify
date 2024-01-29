import { Payment, User } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import {
  getAllUsersPayments,
  getPayments,
  updatePayment,
} from "./paymentThunk";

interface AllPaymentType extends Payment {
  createdBy: User;
}

interface PaymentSliceState {
  yourPayments: Payment[] | null;
  creditedPayments: number;
  initiatedPayments: number;
  failedPayments: number;
  totalAmount: number;
  isLoading: boolean;
  allPayments: AllPaymentType[] | null;
  limit: number;
  currentPage: number;
  numberOfPages: number;
  mostRecentPaymentRef: string | null;
}

const initialState: PaymentSliceState = {
  yourPayments: null,
  creditedPayments: 0,
  initiatedPayments: 0,
  failedPayments: 0,
  totalAmount: 0,
  isLoading: false,
  allPayments: null,
  limit: 10,
  currentPage: 1,
  numberOfPages: 0,
  mostRecentPaymentRef: null,
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setPayment: (state, action) => {
      state.yourPayments = action.payload.yourPayments;
      state.creditedPayments = action.payload.creditedPayments;
      state.initiatedPayments = action.payload.initiatedPayments;
      state.failedPayments = action.payload.failedPayments;
      state.totalAmount = action.payload.totalAmount;
    },

    setMostRecentPaymentRef: (state, action) => {
      state.mostRecentPaymentRef = action.payload.paymentRef;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.yourPayments = action.payload.yourPayments;
        state.creditedPayments = action.payload.creditedPayments;
        state.initiatedPayments = action.payload.initiatedPayments;
        state.failedPayments = action.payload.failedPayments;
        state.totalAmount = action.payload.totalAmount;
        state.isLoading = false;
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getAllUsersPayments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsersPayments.fulfilled, (state, action) => {
        state.allPayments = action.payload.payments;
        state.numberOfPages = action.payload.numberOfPages;

        state.isLoading = false;
      })
      .addCase(getAllUsersPayments.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(updatePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePayment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { setPayment, setMostRecentPaymentRef } = paymentSlice.actions;

export default paymentSlice.reducer;
