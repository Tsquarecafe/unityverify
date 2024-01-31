import axios from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";

export const getAnnouncement = createAppAsyncThunk(
  "user/getAnnouncement",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/announcement");

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Could not Get Announcement");
    }
  }
);
