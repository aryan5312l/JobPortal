import React, { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast"
import { updateJobApplications } from '../../redux/jobSlice';


function JobsDescription() {
    const { toast } = useToast();
    const [hasApplied, setHasApplied] = useState(false);
    const dispatch = useDispatch();

    const { id } = useParams();
    const { allJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();


    // Check if allJobs exists and is not empty before accessing the job
    
    const job = allJobs?.find((job) => job._id === id);

    const checkApplicationStatus = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_APPLICATION_API_END_POINT}/checkApplication`, 
                { jobId: job?._id }, 
                { withCredentials: true }
            );
            //console.log(res);
            if (res.data.applied  && !hasApplied) {
                setHasApplied(true);
            }
        } catch (error) {

            console.log(error);
        }
    };
    
    useEffect(() => {
        if (user && job && !hasApplied) {
            checkApplicationStatus(); // Run only when user or job is available
        }
    }, [user, job, hasApplied]);

    if (!allJobs) {
        return <div>Loading jobs...</div>;
    }
    
    if (!job) {
        console.error('Job not found or allJobs is undefined.');
        return <div>Job not found</div>;
    }
    
    const calculateDaysAgo = (createdAt) => {
        const currentDate = new Date();
        const createdDate = new Date(createdAt);
        const differenceInTime = currentDate - createdDate; // Difference in milliseconds
        return Math.floor(differenceInTime / (1000 * 60 * 60 * 24)); // Convert to days
    };



    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        if (!hasApplied) {
            try {
                console.log(`${import.meta.env.VITE_APPLICATION_API_END_POINT}/apply/${job._id}`);
                const res = await axios.get(`${import.meta.env.VITE_APPLICATION_API_END_POINT}/apply/${job._id}`, { withCredentials: true });
                
                if (res.data.success) {
                    
                    toast({
                        title: res.data.message,
                        variant: "success",
                        className: "bg-green-500 text-white font-bold rounded-lg shadow-lg"
                    })
                    setHasApplied(true);

                    // Extract application ID from response and update Redux
                    const newApplicationId = res.data.applicationId; // Ensure backend sends this

                    dispatch(updateJobApplications({ 
                        jobId: job._id, 
                        applicationId: newApplicationId 
                    }));
                }
            } catch (error) {
                console.log(error);
                toast({
                    title: "Failed to apply",
                    description: error.response?.data?.message || "Something went wrong",
                    variant: "error",
                    className: "bg-red-500 text-white font-bold rounded-lg shadow-lg"
                });
            }
        }
    }

    //const hasApplied = job?.applications?.includes(user?._id);
    //console.log(user._id);
    //console.log(hasApplied);
    return (
        <div className='max-w-5xl mx-auto px-4 lg:px- my-20 '>
            {console.log(id)}
            <div className='flex justify-between'>
                <h1 className='font-bold text-lg'>{job.title}</h1>
                <div className='cursor-pointer ' onClick={handleApply}>
                    <Badge variant="outline" className='px-4'>{user ? (hasApplied ? "Applied" : "Apply") : "Apply"}</Badge>
                </div>
            </div>
            <div className='flex items-center gap-2 mt-2'>
                <Badge className='text-blue-700 font-bold' variant='ghost'>{job.position} position</Badge>
                <Badge className='text-[#F83002] font-bold' variant='ghost'>{job.jobType}</Badge>
                <Badge className='text-[#7209b7] font-bold' variant='ghost'>{job.salary}Lpa</Badge>
            </div>
            <div className='mt-2 py-2  border-b-2'>
                <span>Job Description</span>
            </div>
            <div className='mt-2'>
                <h2>Company: <span className='text-sm text-gray-400'>{job.company.name}</span></h2>
                <h2>Location: <span className='text-sm text-gray-400'>{job.location}</span></h2>
                <h2>Description: <span className='text-sm text-gray-400'> {job.description}</span></h2>
                <h2>Experience: <span className='text-sm text-gray-400'>{job.experienceLevel}</span></h2>
                <h2>Requirements: <span className='text-sm text-gray-400'>{job.requirements}</span></h2>
                <h2>Total Applicants: <span className='text-sm text-gray-400'>{job.applications.length}</span></h2>
                <h2>Posted: <span className='text-sm text-gray-400'>{calculateDaysAgo(job.createdAt)} days ago</span></h2>
            </div>
        </div>
    )
}

export default JobsDescription