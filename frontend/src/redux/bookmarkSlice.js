import { createSlice } from "@reduxjs/toolkit";
import { fetchBookmarkedJobs, addBookmark, removeBookmark } from "./actions/bookmarkActions";

const initialState = {
  bookmarkedJobs: [],
  loading: false,
  error: null
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    clearBookmarks: (state) => {
      state.bookmarkedJobs = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarkedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarkedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarkedJobs = action.payload || [];
      })
      .addCase(fetchBookmarkedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        if(!state.bookmarkedJobs.includes(action.payload)) {
          state.bookmarkedJobs.push(action.payload);
        }
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarkedJobs = state.bookmarkedJobs.filter(
          (jobId) => jobId !== action.payload
        );
      })
      .addCase(removeBookmark.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});


export default bookmarkSlice.reducer;
