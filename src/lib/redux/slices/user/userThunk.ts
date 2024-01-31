import axios, { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";

export const getUser = createAppAsyncThunk(
  "user/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/users/single");

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Could not Verify by Phone");
    }
  }
);

interface IGet {
  limit?: number;
  page?: number;
  search?: string;
}
export const getAllUsers = createAppAsyncThunk(
  "user/getAllUser",
  async ({ limit, page, search }: IGet, thunkAPI) => {
    let baseUrl = `/api/users?limit=${limit || 10}`;

    if (page) baseUrl = `${baseUrl}&page=${page}`;
    if (search) baseUrl = `${baseUrl}&search=${search}`;
    try {
      const res = await axios.get(baseUrl);

      return { data: res.data, currentPage: page };
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      return thunkAPI.rejectWithValue("Could not retrieve Users Details");
    }
  }
);
interface Iupdate {
  newPassword: string;
  currentPassword: string;
}
