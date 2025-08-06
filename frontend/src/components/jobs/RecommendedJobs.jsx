import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendedJobs } from "../../redux/actions/jobActions";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sparkles, RotateCw, AlertCircle, FileText, Upload } from "lucide-react";
import JobCard from "./JobCard";
import { SkeletonJobCard } from "./SkeletonJobCard";

const RecommendedJobs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;

    // Selectors
    const jobs = useSelector((state) => state.job.recommendedJobsByPage[currentPage] || []);
    //console.log(jobs);
    const loading = useSelector((state) => state.job.loading);
    const error = useSelector((state) => state.job.error);
    const actionRequired = useSelector((state) => state.job.actionRequired);
    const retryable = useSelector((state) => state.job.retryable);
    const pagination = useSelector((state) => state.job.pagination);

    useEffect(() => {
        dispatch(fetchRecommendedJobs(currentPage));
    }, [dispatch, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        navigate(`?page=${newPage}`, { replace: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = useMemo(() => (


        <div className="flex justify-center items-center gap-4 mt-8">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentPage <= 1 || loading
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
                    }`}
            >
                ← Previous
            </button>

            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Page {currentPage} of {pagination.totalPages}
            </span>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages || loading}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentPage >= pagination.totalPages || loading
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
                    }`}
            >
                Next →
            </button>
        </div>
    ), [currentPage, pagination.totalPages, loading]);

    useEffect(() => {
        const preloadNext = () => {
            const next = currentPage + 1;
            if (next <= pagination.totalPages) {
                dispatch(fetchRecommendedJobs(next));
            }
        };
        preloadNext();
    }, [dispatch, currentPage, pagination.totalPages]);


    if (loading) {
        return (
            <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        AI Recommended Jobs
                    </h2>
                    <RotateCw className="h-5 w-5 animate-spin text-gray-500 ml-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <SkeletonJobCard key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 max-w-2xl mx-auto px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Couldn't load recommendations
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {error}
                </p>

                <div className="flex gap-3 justify-center">
                    {retryable && (
                        <Button
                            onClick={() => dispatch(fetchRecommendedJobs(currentPage))}
                            className="flex items-center gap-2"
                        >
                            <RotateCw className="h-4 w-4" />
                            Try Again
                        </Button>
                    )}
                    {actionRequired && (
                        <Button
                            onClick={() => navigate("/profile")}
                            variant="secondary"
                            className="flex items-center gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Upload Resume
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    if (!jobs?.length) {
        return (
            <div className="text-center py-12 max-w-2xl mx-auto px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                    <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No matches yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We couldn't find jobs matching your profile. Try updating your resume or skills.
                </p>
                <Button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2"
                >
                    <FileText className="h-4 w-4" />
                    Update Profile
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <Sparkles className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        AI Recommended Jobs
                    </h2>
                    <Badge variant="secondary" className="ml-2">
                        {pagination.totalJobs} matches
                    </Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Sorted by relevance
                </div>
            </div>

            {pagination.totalPages > 1 && renderPagination}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <JobCard
                        key={job.job._id}
                        job={job.job}
                        onClick={() => navigate(`/jobdescription/${job.job._id}`)}
                        showBookmark={true}
                        showMatchScore={true}
                        matchScore={job.matchScore} // Ensure this is passed
                    />
                ))}
            </div>

            {pagination.totalPages > 1 && renderPagination}
        </div>
    );
};

export default RecommendedJobs;