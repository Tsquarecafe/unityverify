import { createSlice } from "@reduxjs/toolkit";
import { Announcement } from "@prisma/client";
import { getAnnouncement } from "./announcementThunk";

interface AnnouncementSliceState {
  announcements: Announcement[] | null;

  isLoading: boolean;
}

const initialState: AnnouncementSliceState = {
  announcements: null,

  isLoading: false,
};

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAnnouncement.fulfilled, (state, action) => {
        state.announcements = action.payload;

        state.isLoading = false;
      })
      .addCase(getAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const {} = announcementSlice.actions;

export default announcementSlice.reducer;
