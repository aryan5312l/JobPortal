import { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast"
import { updateJobApplications } from '../../redux/jobSlice';
import { Briefcase, Building2, CalendarDays, DollarSign, ListCheck, MapPin, User } from 'lucide-react';
import { Button } from '../ui/button';


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

    
    
    useEffect(() => {
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
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Sticky Header with Title & Apply */}
            <div className="sticky top-0 z-10 bg-white shadow-sm py-4 flex justify-between items-center border-b">
                <div>
                    <h1 className="text-2xl font-semibold">{job.title}</h1>
                    <p className="text-gray-500 text-sm">
                        {job.company.name} • {job.location}
                    </p>
                </div>
                <Button
                    variant={hasApplied ? "secondary" : "default"}
                    onClick={handleApply}
                    disabled={hasApplied}
                    className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-all"
                >
                    {user ? (hasApplied ? "Applied" : "Apply Now") : "Login to Apply"}
                </Button>
            </div>

            {/* Job Highlights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md border">
                    <h4 className="text-sm font-medium text-gray-600">Job Type</h4>
                    <p className="text-base font-semibold text-black">{job.jobType}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border">
                    <h4 className="text-sm font-medium text-gray-600">Experience Level</h4>
                    <p className="text-base font-semibold text-black">{job.experienceLevel}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border">
                    <h4 className="text-sm font-medium text-gray-600">Salary</h4>
                    <p className="text-base font-semibold text-black">{job.salary} LPA</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border">
                    <h4 className="text-sm font-medium text-gray-600">Applicants</h4>
                    <p className="text-base font-semibold text-black">{job.applications.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border">
                    <h4 className="text-sm font-medium text-gray-600">Posted</h4>
                    <p className="text-base font-semibold text-black">{calculateDaysAgo(job.createdAt)} days ago</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border">
                    <h4 className="text-sm font-medium text-gray-600">Position</h4>
                    <p className="text-base font-semibold text-black">{job.position}</p>
                </div>
            </div>

            {/* Description Section */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description}
                </p>
            </div>

            {/* Requirements */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.requirements}
                </p>
            </div>

            {/* Company Info */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-3">About the Company</h2>
                <div className="bg-white p-4 border rounded-md">
                    <p className="text-sm text-gray-600">{job.company.name}</p>
                    <p className="text-sm text-gray-500">{job.company.description || "No description available."}</p>
                </div>
            </div>

            {/* Apply Button at Bottom for Mobile */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-center md:hidden z-20">
                <Button
                    variant={hasApplied ? "secondary" : "default"}
                    onClick={handleApply}
                    disabled={hasApplied}
                    className="w-full max-w-md text-white bg-blue-600 hover:bg-blue-700 transition-all"
                >
                    {user ? (hasApplied ? "Applied" : "Apply Now") : "Login to Apply"}
                </Button>
            </div>
        </div>
    );
}

export default JobsDescription