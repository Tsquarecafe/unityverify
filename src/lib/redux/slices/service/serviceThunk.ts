import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import axios from "axios";

interface IupdateTransaction {
  transactionId: string;
  slipId: string;
  reference: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

const updateTransaction = async ({
  transactionId,
  slipId,
  reference,
  status,
}: IupdateTransaction) => {
  await axios.patch("/api/transactions", {
    transactionId,
    slipId,
    reference,
    status,
  });
};

const updateFailedTransaction = async () => {
  await axios.patch("/api/transactions?failed=true", {
    status: "FAILED",
  });
};

export const verifyByNIN = createAppAsyncThunk(
  "services/verifyByNIN",
  async (
    {
      nin,
      transactionId,
      slipId,
    }: {
      nin: string;
      transactionId: string;
      slipId: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post("/api/services/verify/nin", { nin });

      if (res.status === 200) {
        await updateTransaction({
          transactionId,
          slipId,
          reference: res.data.reference,
          status: "SUCCESS",
        });
      }

      return res.data;
    } catch (error) {
      await updateFailedTransaction();
      return thunkAPI.rejectWithValue("Could not Verify by NIN");
    }
  }
);
export const verifyByVNIN = createAppAsyncThunk(
  "services/verifyByVNIN",
  async (
    {
      vnin,
      transactionId,
      slipId,
    }: {
      vnin: string;
      transactionId: string;
      slipId: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post("/api/services/verify/nin", { vnin });

      if (res.status === 200) {
        await updateTransaction({
          transactionId,
          slipId,
          reference: res.data.reference,
          status: "SUCCESS",
        });
      }

      return res.data;
    } catch (error) {
      await updateFailedTransaction();
      return thunkAPI.rejectWithValue("Could not Verify by VNIN");
    }
  }
);

export const verifyByDemography = createAppAsyncThunk(
  "services/verifyByDemography",
  async (
    {
      firstname,
      lastname,
      dob,
      gender,
      transactionId,
      slipId,
    }: {
      firstname: string;
      lastname: string;
      dob: string;
      gender: string;
      transactionId: string;
      slipId: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post("/api/services/verify/demography", {
        firstname,
        lastname,
        dob,
        gender,
      });

      if (res.status === 200) {
        await updateTransaction({
          transactionId,
          slipId,
          reference: res.data.reference,
          status: "SUCCESS",
        });
      }

      return res.data;
    } catch (error) {
      await updateFailedTransaction();
      return thunkAPI.rejectWithValue("Could not Verify by Demography");
    }
  }
);
export const verifyByPhone = createAppAsyncThunk(
  "services/verifyByPhone",
  async (
    {
      phone,
      transactionId,
      slipId,
    }: {
      phone: string;
      transactionId: string;
      slipId: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post("/api/services/verify/nin/phone", { phone });

      if (res.status === 200) {
        await updateTransaction({
          transactionId,
          slipId,
          reference: res.data.reference,
          status: "SUCCESS",
        });
      }

      return res.data;
    } catch (error) {
      await updateFailedTransaction();
      return thunkAPI.rejectWithValue("Could not Verify by Phone");
    }
  }
);
export const getAllSlips = createAppAsyncThunk(
  "services/getAllSlips",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/slips");

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Could not Verify by Phone");
    }
  }
);
