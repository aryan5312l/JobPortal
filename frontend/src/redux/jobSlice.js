import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        filteredJobs: [] // Added for filtering
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
            state.filteredJobs = action.payload; // Initialize with all jobs
        },
        updateJobApplications: (state, action) => {
            const { jobId, applicationId } = action.payload;
            const job = state.allJobs.find(job => job._id === jobId);
            if (job && !job.applications.includes(applicationId)) {
                job.applications.push(applicationId); 
            }
        },
        filterJobs: (state, action) => {
            const keyword = action.payload.toLowerCase();
            state.filteredJobs = state.allJobs.filter(job =>
                job.title.toLowerCase().includes(keyword) ||
                job.description.toLowerCase().includes(keyword) || 
                job.jobType.toLowerCase().includes(keyword) ||
                job.company.name.toLowerCase().includes(keyword)
            );
        }
    }
});

export const { setAllJobs, updateJobApplications, filterJobs } = jobSlice.actions;
export default jobSlice.reducer;
