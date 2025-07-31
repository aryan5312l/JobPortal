import axios from "axios";
import { FETCH_RECOMMENDATIONS_REQUEST, FETCH_RECOMMENDATIONS_SUCCESS, FETCH_RECOMMENDATIONS_FAILURE, setAllJobs } from "../jobSlice";

export const fetchJobs = (keyword = "") => async (dispatch) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_JOB_API_END_POINT}/get?keyword=${keyword}`
        );

        if (response.data.success) {
            dispatch(setAllJobs(response.data.jobs));
        }
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
};

export const fetchRecommendedJobs = (page = 1, limit = 9) => async (dispatch) => {
    try {
        dispatch(FETCH_RECOMMENDATIONS_REQUEST());
        
        const response = await axios.get(
            `${import.meta.env.VITE_JOB_API_END_POINT}/recommendations`,
            {
                params: { page, limit },
                withCredentials: true,
                timeout: 10000 // 10 second timeout
            }
        );

        if (response.data.jobs) {
            dispatch(FETCH_RECOMMENDATIONS_SUCCESS({
                jobs: response.data.jobs,
                pagination: {
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    totalJobs: response.data.totalJobs,
                    hasMore: response.data.hasMore
                }
            }));
        } else {
            dispatch(FETCH_RECOMMENDATIONS_FAILURE({
                error: response.data.message,
                actionRequired: response.data.actionRequired
            }));
        }
    } catch (error) {
        dispatch(FETCH_RECOMMENDATIONS_FAILURE({
            error: error.response?.data?.error || "Network error",
            retryable: error.response?.data?.retryable ?? true
        }));
    }
};
