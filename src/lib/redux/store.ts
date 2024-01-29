import { configureStore } from "@reduxjs/toolkit";
import ModalSlice from "./slices/modalSlice";
import ServiceSlice from "./slices/service/serviceSlice";
import UserSlice from "./slices/user/userSlice";
import TransactionSlice from "./slices/transaction/transactionSlice";
import PaymentSlice from "./slices/payment/paymentSlice";
import ReportSlice from "./slices/report/reportSlice";

export const store = configureStore({
  reducer: {
    modal: ModalSlice,
    service: ServiceSlice,
    user: UserSlice,
    transactions: TransactionSlice,
    payments: PaymentSlice,
    report: ReportSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
