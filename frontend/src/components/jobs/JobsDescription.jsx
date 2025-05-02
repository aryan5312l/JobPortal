import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast"
import { updateJobApplications } from '../../redux/jobSlice';
import { Briefcase, Building2, CalendarDays, Check, DollarSign, ExternalLink, ListCheck, MapPin, Send, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { useDarkMode } from '../../contexts/DarkModeContext';

function JobsDescription() {
    const { darkMode } = useDarkMode();
    const { toast } = useToast();
    const [hasApplied, setHasApplied] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { id } = useParams();
    const { allJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    const job = allJobs?.find((job) => job._id === id);

    useEffect(() => {
        const checkApplicationStatus = async () => {
            try {
                const res = await axios.post(`${import.meta.env.VITE_APPLICATION_API_END_POINT}/checkApplication`,
                    { jobId: job?._id },
                    { withCredentials: true }
                );
                if (res.data.applied && !hasApplied) {
                    setHasApplied(true);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        if (user && job && !hasApplied) {
            checkApplicationStatus();
        } else {
            setLoading(false);
        }
    }, [user, job, hasApplied]);

    if (!allJobs) {
        return (
            <div className={`max-w-5xl mx-auto px-4 py-6 space-y-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <Skeleton className={`h-10 w-3/4 ${darkMode ? 'bg-gray-700' : ''}`} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className={`h-20 w-full ${darkMode ? 'bg-gray-700' : ''}`} />
                    ))}
                </div>
                <Skeleton className={`h-40 w-full ${darkMode ? 'bg-gray-700' : ''}`} />
            </div>
        );
    }

    if (!job) {
        return (
            <div className={`max-w-5xl mx-auto px-4 py-6 text-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <h1 className="text-2xl font-bold">Job Not Found</h1>
                <p className="mt-2 dark:text-gray-400">The job you're looking for doesn't exist or may have been removed.</p>
                <Button className="mt-4" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>
        );
    }

    const calculateDaysAgo = (createdAt) => {
        if (!createdAt) return 'Not specified';
        const currentDate = new Date();
        const createdDate = new Date(createdAt);
        const differenceInTime = currentDate - createdDate;
        const days = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
        return days === 0 ? 'Today' : `${days} day${days !== 1 ? 's' : ''} ago`;
    };

    const formatSalary = (salary) => {
        if (!salary || salary === 0) return 'Not specified';
        return `${salary} LPA`;
    };

    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (job.externalLink) {
            window.open(job.externalLink, '_blank');
            return;
        }

        if (!hasApplied) {
            try {
                if (job?.jobUrl) {
                    window.open(job.jobUrl, '_blank', 'noopener,noreferrer');
                    return;
                }
                const res = await axios.get(`${import.meta.env.VITE_APPLICATION_API_END_POINT}/apply/${job._id}`, { withCredentials: true });

                if (res.data.success) {
                    toast({
                        title: res.data.message,
                        variant: "success",
                        className: "bg-green-500 text-white font-bold rounded-lg shadow-lg"
                    })
                    setHasApplied(true);

                    const newApplicationId = res.data.applicationId;
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

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Sticky Header */}
                <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm py-4 flex justify-between items-center border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">{job?.title}</h1>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <p className="text-sm flex items-center dark:text-gray-400">
                                <Building2 className="w-4 h-4 mr-1" />
                                {job?.company?.name || 'Not specified'}
                            </p>
                            {job?.location && (
                                <p className="text-sm flex items-center dark:text-gray-400">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {job.location}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {/* Desktop Apply Button */}
                    <Button
                        variant={hasApplied ? "secondary" : job.jobUrl ? "outline" : "default"}
                        onClick={handleApply}
                        disabled={hasApplied && !job.jobUrl}
                        className="hidden sm:flex items-center gap-2"
                    >
                        {job.jobUrl ? (
                            <>
                                <ExternalLink size={16} />
                                Apply Externally
                            </>
                        ) : user ? (
                            hasApplied ? (
                                <>
                                    <Check size={16} />
                                    Applied
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Apply Now
                                </>
                            )
                        ) : "Login to Apply"}
                    </Button>
                </div>

                {/* Job Highlights Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <HighlightCard
                        icon={<Briefcase className="w-5 h-5" />}
                        title="Job Type"
                        value={job?.jobType || 'Not specified'}
                        darkMode={darkMode}
                    />
                    <HighlightCard
                        icon={<User className="w-5 h-5" />}
                        title="Experience Level"
                        value={job?.experienceLevel || 'Not specified'}
                        darkMode={darkMode}
                    />
                    <HighlightCard
                        icon={<DollarSign className="w-5 h-5" />}
                        title="Salary"
                        value={formatSalary(job?.salary)}
                        darkMode={darkMode}
                    />
                    <HighlightCard
                        icon={<ListCheck className="w-5 h-5" />}
                        title="Applicants"
                        value={job?.applications?.length || 0}
                        darkMode={darkMode}
                    />
                    <HighlightCard
                        icon={<CalendarDays className="w-5 h-5" />}
                        title="Posted"
                        value={calculateDaysAgo(job?.createdAt)}
                        darkMode={darkMode}
                    />
                    {job?.position && (
                        <HighlightCard
                            icon={<Building2 className="w-5 h-5" />}
                            title="Position"
                            value={job.position}
                            darkMode={darkMode}
                        />
                    )}
                </div>

                {/* Description Section */}
                <div className="mt-10">
                    <SectionHeader title="Job Description" darkMode={darkMode} />
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                        {job?.description ? (
                            <div className={`prose max-w-none ${darkMode ? 'prose-invert text-gray-300' : 'text-gray-700'}`} 
                                dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br/>') }} 
                            />
                        ) : (
                            <p className={`italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No description provided</p>
                        )}
                    </div>
                </div>

                {/* Requirements */}
                {job?.requirements && (
                    <div className="mt-8">
                        <SectionHeader title="Requirements" darkMode={darkMode} />
                        <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                            {typeof job.requirements === 'string' ? (
                                <div
                                    className={`prose max-w-none ${darkMode ? 'prose-invert text-gray-300' : 'text-gray-700'}`}
                                    dangerouslySetInnerHTML={{
                                        __html: job.requirements
                                            .replace(/\n/g, '<br/>')
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                    }}
                                />
                            ) : Array.isArray(job.requirements) ? (
                                <ul className="list-disc pl-5 space-y-2">
                                    {job.requirements.map((req, index) => (
                                        <li key={index} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{req}</li>
                                    ))}
                                </ul>
                            ) : (
                                <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                                    {String(job.requirements)}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Company Info */}
                <div className="mt-10">
                    <SectionHeader title="About the Company" darkMode={darkMode} />
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                        {job?.company?.description ? (
                            <div className={`prose max-w-none ${darkMode ? 'prose-invert text-gray-300' : 'text-gray-700'}`} 
                                dangerouslySetInnerHTML={{ __html: job.company.description.replace(/\n/g, '<br/>') }} 
                            />
                        ) : (
                            <p className={`italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No company description available</p>
                        )}
                    </div>
                </div>

                {/* Source Info */}
                {job?.source && (
                    <div className={`mt-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <p>Job sourced from: {job.source}</p>
                    </div>
                )}

                {/* Mobile Apply Button */}
                <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-sm shadow-md p-4 flex justify-center sm:hidden z-20 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <Button
                        variant={hasApplied ? "secondary" : job.jobUrl ? "outline" : "default"}
                        onClick={handleApply}
                        disabled={hasApplied && !job.jobUrl}
                        className="w-full max-w-md flex items-center justify-center gap-2"
                    >
                        {job.jobUrl ? (
                            <>
                                <ExternalLink size={16} />
                                Apply Externally
                            </>
                        ) : user ? (
                            hasApplied ? (
                                <>
                                    <Check size={16} />
                                    Applied
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Apply Now
                                </>
                            )
                        ) : "Login to Apply"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function HighlightCard({ icon, title, value, darkMode }) {
    return (
        <div className={`flex items-center gap-4 p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${darkMode ? 'bg-gray-800 border-gray-700 hover:shadow-gray-700/30' : 'bg-white border-gray-200 hover:shadow-gray-200'} border`}>
            <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {icon}
            </div>
            <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
                <p className={`mt-1 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}

function SectionHeader({ title, darkMode }) {
    return (
        <div className="flex items-center mb-4">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
            <div className={`ml-4 flex-1 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
        </div>
    );
}

export default JobsDescription;