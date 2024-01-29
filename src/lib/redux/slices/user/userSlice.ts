import { User } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { getAllUsers, getUser } from "./userThunk";

interface UserSliceState {
  user: User | null;
  allUsers: User[] | null;
  currentPage: number;
  isLoading: boolean;
  limit: number;
  numberOfPages: number;
}

const initialState: UserSliceState = {
  user: null,
  allUsers: null,
  currentPage: 1,
  isLoading: false,
  limit: 10,
  numberOfPages: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload.data.usersNoPassword;
        state.numberOfPages = action.payload.data.numberOfPages;
        state.currentPage = action.payload.currentPage || 1;
        state.isLoading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
