import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookmarkedJobs: [],
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    addBookmark: (state, action) => {
      const jobId = action.payload;
      if (!state.bookmarkedJobs.includes(jobId)) {
        state.bookmarkedJobs.push(jobId);
      }
    },
    removeBookmark: (state, action) => {
      const jobId = action.payload;
      state.bookmarkedJobs = state.bookmarkedJobs.filter(id => id !== jobId);
    },
  },
});

export const { addBookmark, removeBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
