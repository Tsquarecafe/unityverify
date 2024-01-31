import axios from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";

interface IGet {
  limit?: number;
  page?: number;
  status?: string;
  slipyType?: string;
}

export const getTransactions = createAppAsyncThunk(
  "transaction/getAllTransactions",
  async ({ limit, page, status, slipyType }: IGet, thunkAPI) => {
    let baseUrl = `/api/transactions?limit=${limit || 10}`;

    if (page) baseUrl = `${baseUrl}&page=${page}`;
    if (status) baseUrl = `${baseUrl}&status=${status}`;
    if (slipyType) baseUrl = `${baseUrl}&slipyType=${slipyType}`;

    try {
      const res = await axios.get(baseUrl);

      return { data: res.data, currentPage: page };
    } catch (error) {
      return thunkAPI.rejectWithValue("Could not Verify by Phone");
    }
  }
);
