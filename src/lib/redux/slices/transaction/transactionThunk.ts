import axios from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";

interface IGet {
  limit?: number;
  page?: number;
}

export const getTransactions = createAppAsyncThunk(
  "transaction/getAllTransactions",
  async ({ limit, page }: IGet, thunkAPI) => {
    let baseUrl = "/api/transactions";
    if (limit) baseUrl = `${baseUrl}?limit=${limit}`;

    if (page) baseUrl = `${baseUrl}&page=${page}`;
    try {
      const res = await axios.get(baseUrl);

      return { data: res.data, currentPage: page };
    } catch (error) {
      return thunkAPI.rejectWithValue("Could not Verify by Phone");
    }
  }
);
