import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allJobs: [],
    filteredJobs: [],

    loading: false,
    error: null,
    actionRequired: false,
    retryable: false,
    recommendedJobsByPage: {},
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalJobs: 0,
        hasMore: false
    }
};

const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
            state.filteredJobs = action.payload;
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
                    const rangeValues = salaryRanges[range];
                    if (!rangeValues) return false;
                    const [min, max] = salaryRanges[range];
                    return job.salary >= min && job.salary <= max;
                });
                return locationMatch && industryMatch && salaryMatch;
            });
        },
        // Recommended jobs reducers
        FETCH_RECOMMENDATIONS_REQUEST: (state) => {
            state.loading = true;
            state.error = null;
            state.actionRequired = false;
            state.retryable = false;
        },
        FETCH_RECOMMENDATIONS_SUCCESS: (state, action) => {
            state.loading = false;
            state.error = null;
            state.recommendedJobsByPage = {
                ...state.recommendedJobsByPage,
                [action.payload.page]: action.payload.jobs,
            };
            state.allJobs = action.payload.jobs.map(j => j.job || j); // flatten if needed
            state.pagination = action.payload.pagination;
            state.actionRequired = false;
            state.retryable = false;
        },

        FETCH_RECOMMENDATIONS_FAILURE: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.actionRequired = !!action.payload.actionRequired;
            state.retryable = action.payload.retryable ?? true;
        }
    }
});

export const { setAllJobs, updateJobApplications, filterJobs, setFilteredJobs, FETCH_RECOMMENDATIONS_REQUEST, FETCH_RECOMMENDATIONS_SUCCESS, FETCH_RECOMMENDATIONS_FAILURE } = jobSlice.actions;
export default jobSlice.reducer;
