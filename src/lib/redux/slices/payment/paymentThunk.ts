import axios from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { PaymentStatus } from "@prisma/client";

export const getPayments = createAppAsyncThunk(
  "payments/getAllPayments",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/payments");

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Could not retrieve user payment history"
      );
    }
  }
);

interface IGet {
  limit?: number;
  page?: number;
  status?: string;
  method?: string;
  duration?: string;
  search?: string;
}

export const getAllUsersPayments = createAppAsyncThunk(
  "payments/getAllUsersPayments",
  async ({ status, limit, page, method, duration, search }: IGet, thunkAPI) => {
    let baseUrl = `/api/payments/all?limit=${limit || 10}`;

    if (page) baseUrl = `${baseUrl}&page=${page}`;

    if (status) baseUrl = `${baseUrl}&status=${status}`;
    if (method) baseUrl = `${baseUrl}&method=${method}`;
    if (duration) baseUrl = `${baseUrl}&duration=${duration}`;
    if (search) baseUrl = `${baseUrl}&search=${search}`;

    try {
      const res = await axios.get(baseUrl);

      return { ...res.data, currentPage: page };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Could not retrieve all users payment history"
      );
    }
  }
);

export const updatePayment = createAppAsyncThunk(
  "payments/updatePayment",
  async (
    {
      paymentId,
      status,
    }: {
      paymentId: string;
      status: PaymentStatus;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.patch("/api/payments", {
        paymentId,
        status,
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Could not update user payment history"
      );
    }
  }
);

interface IGet {
  limit?: number;
  page?: number;
  status?: string;
}
