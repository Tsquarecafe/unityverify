import axios from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";

export const getReport = createAppAsyncThunk(
  "user/getReport",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/report");

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Could not Verify by Phone");
    }
  }
);
