import axios from "axios"
import { useEffect} from "react"
import { useDispatch } from "react-redux"
import { setAllJobs } from "../../redux/jobSlice";


const useGetAllJobs = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_JOB_API_END_POINT}/get`, {withCredentials: true})
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    }, [dispatch])
    
}

export default useGetAllJobs;