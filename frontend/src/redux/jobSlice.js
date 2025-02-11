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
        },
        setFilteredJobs: (state, action) => { 
            const { location, industry, salary } = action.payload;

            const salaryRanges = {
                "3-6 LPA": [3, 6],
                "6-10 LPA": [6, 10],
                "10-15 LPA": [10, 15],
                "15+ LPA": [15, Infinity]
            };

            state.filteredJobs = state.allJobs.filter(job => {
                const locationMatch = location.length === 0 || location.includes(job.location);
                const industryMatch = industry.length === 0 || industry.includes(job.title);
                const salaryMatch = salary.length === 0 || salary.some(range => {
                    const [min, max] = salaryRanges[range];
                    return job.salary >= min && job.salary <= max;
                });

                return locationMatch && industryMatch && salaryMatch;
            });
        }
    }
});

export const { setAllJobs, updateJobApplications, filterJobs, setFilteredJobs } = jobSlice.actions;
export default jobSlice.reducer;
