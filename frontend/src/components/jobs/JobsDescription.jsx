import { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast"
import { updateJobApplications } from '../../redux/jobSlice';
import { Briefcase, Building2, CalendarDays, DollarSign, ExternalLink, ListCheck, MapPin, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

function JobsDescription() {
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
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
                <Skeleton className="h-40 w-full" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Job Not Found</h1>
                <p className="text-gray-600 mt-2">The job you're looking for doesn't exist or may have been removed.</p>
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
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Sticky Header with Title & Apply */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-4 flex justify-between items-center border-b">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job?.title}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-600 text-sm flex items-center">
                            <Building2 className="w-4 h-4 mr-1" />
                            {job?.company?.name || 'Not specified'}
                        </p>
                        {job?.location && (
                            <p className="text-gray-600 text-sm flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {job.location}
                            </p>
                        )}
                    </div>
                </div>
                <Button
                    variant={hasApplied ? "secondary" : job.jobUrl ? "outline" : "default"}
                    onClick={handleApply}
                    disabled={hasApplied && !job.jobUrl}
                    className={`px-6 py-2 ${job.jobUrl ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : 'text-white bg-blue-600 hover:bg-blue-700'} transition-all flex items-center gap-2`}
                >
                    {job.jobUrl ? (
                        <>
                            <ExternalLink size={16} />
                            Apply Externally
                        </>
                    ) : user ? (
                        hasApplied ? "Applied" : "Apply Now"
                    ) : "Login to Apply"}
                </Button>
            </div>

            {/* Job Highlights */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <HighlightCard
                    icon={<Briefcase className="text-gray-600 w-5 h-5" />}
                    title="Job Type"
                    value={job?.jobType || 'Not specified'}
                />
                <HighlightCard
                    icon={<User className="text-gray-600 w-5 h-5" />}
                    title="Experience Level"
                    value={job?.experienceLevel || 'Not specified'}
                />
                <HighlightCard
                    icon={<DollarSign className="text-gray-600 w-5 h-5" />}
                    title="Salary"
                    value={formatSalary(job?.salary)}
                />
                <HighlightCard
                    icon={<ListCheck className="text-gray-600 w-5 h-5" />}
                    title="Applicants"
                    value={job?.applications?.length || 0}
                />
                <HighlightCard
                    icon={<CalendarDays className="text-gray-600 w-5 h-5" />}
                    title="Posted"
                    value={calculateDaysAgo(job?.createdAt)}
                />
                {job?.position && (
                    <HighlightCard
                        icon={<Building2 className="text-gray-600 w-5 h-5" />}
                        title="Position"
                        value={job.position}
                    />
                )}
            </div>

            {/* Description Section */}
            <div className="mt-10">
                <SectionHeader title="Job Description" />
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    {job?.description ? (
                        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br/>') }} />
                    ) : (
                        <p className="text-gray-500 italic">No description provided</p>
                    )}
                </div>
            </div>

            {/* Requirements */}
            {job?.requirements && (
                <div className="mt-8">
                    <SectionHeader title="Requirements" />
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                        {typeof job.requirements === 'string' ? (
                            <div
                                className="prose max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{
                                    __html: job.requirements
                                        .replace(/\n/g, '<br/>')
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Handle markdown bold
                                        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Handle markdown italic
                                }}
                            />
                        ) : Array.isArray(job.requirements) ? (
                            <ul className="list-disc pl-5 space-y-2">
                                {job.requirements.map((req, index) => (
                                    <li key={index} className="text-gray-700">{req}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="prose max-w-none text-gray-700">
                                {String(job.requirements)}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Company Info */}
            <div className="mt-10">
                <SectionHeader title="About the Company" />
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    {job?.company?.description ? (
                        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.company.description.replace(/\n/g, '<br/>') }} />
                    ) : (
                        <p className="text-gray-500 italic">No company description available</p>
                    )}
                </div>
            </div>

            {/* Source Info for scraped jobs */}
            {job?.source && (
                <div className="mt-6 text-sm text-gray-500">
                    <p>Job sourced from: {job.source}</p>
                </div>
            )}

            {/* Apply Button at Bottom for Mobile */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-md p-4 flex justify-center md:hidden z-20 border-t">
                <Button
                    variant={hasApplied ? "secondary" : job.externalLink ? "outline" : "default"}
                    onClick={handleApply}
                    disabled={hasApplied && !job.externalLink}
                    className={`w-full max-w-md ${job.externalLink ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : 'text-white bg-blue-600 hover:bg-blue-700'} transition-all flex items-center justify-center gap-2`}
                >
                    {job.jobUrl ? (
                        <>
                            <ExternalLink size={16} />
                            Apply Externally
                        </>
                    ) : user ? (
                        hasApplied ? "Applied" : "Apply Now"
                    ) : "Login to Apply"}
                </Button>
            </div>
        </div>
    );
}

// Helper components for better organization
const HighlightCard = ({ icon, title, value }) => (
    <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow flex items-start gap-3 h-full">
        <div className="bg-blue-50 p-2 rounded-full">
            {icon}
        </div>
        <div>
            <h4 className="text-sm font-medium text-gray-500">{title}</h4>
            <p className={`text-base font-semibold ${value === 'Not specified' ? 'text-gray-400' : 'text-gray-900'}`}>
                {value}
            </p>
        </div>
    </div>
);

const SectionHeader = ({ title }) => (
    <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="ml-4 flex-1 border-t border-gray-200"></div>
    </div>
);

export default JobsDescription;