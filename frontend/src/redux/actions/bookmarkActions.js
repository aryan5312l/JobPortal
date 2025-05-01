import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const fetchBookmarkedJobs = createAsyncThunk(
    "bookmarks/fetchBookmarkedJobs",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BOOKMARK_API_END_POINT}`,
          { withCredentials: true }
        );
        
        return response.data.bookmarks?.map(job => ({
            _id: job._id,
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            skills: job.skills,
            jobType: job.jobType,
            position: job.position,
            salary: job.salary,
            location: job.location,
            createdAt: job.createdAt,
            companyName: job.companyName,
            companyLogo: job.companyLogo,
            company: {
              _id: job.company?._id,
              name: job.company?.name || job.companyName,
              logo: job.company?.logo || job.companyLogo,
              about: job.company?.about,
              website: job.company?.website
            },
            savedAt: job.savedAt || new Date().toISOString() // Add saved timestamp
          })) || [];

      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch bookmarks");
      }
    }
  );

export const addBookmark = createAsyncThunk(
  "bookmarks/addBookmark",
  async (jobId, {rejectWithValue}) => {
    try {
        

        // if(!user){
        //     return rejectWithValue("User not authenticated");
        //     }

        console.log("Sending request to backend with jobId:", jobId);

        const response = await axios.post(
        `${import.meta.env.VITE_BOOKMARK_API_END_POINT}`,
        { jobId},
        { withCredentials: true }
      );

      if(!response.data.success){
        return rejectWithValue(response.data.message);
      }

      return jobId;

    } catch (error) {
      console.error("Error adding bookmark:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to add bookmark")
    }
  }
);

export const removeBookmark = createAsyncThunk(
  "bookmarks/removeBookmark",
  async (jobId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BOOKMARK_API_END_POINT}/${jobId}`,
        { withCredentials: true }
      );
      return jobId;
    } catch (error) {
      console.error("Error removing bookmark:", error);
      throw error;
    }
  }
);