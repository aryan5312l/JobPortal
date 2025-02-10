import axios from "axios";
import { setAllJobs } from "../jobSlice";


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
