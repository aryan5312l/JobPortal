
import { Badge } from "@/components/ui/badge"
import { useDispatch, useSelector } from 'react-redux';
import { Bookmark } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { addBookmark, removeBookmark } from "../../redux/bookmarkSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { SkeletonJobCard } from "./SkeletonJobCard";
//import { parse } from "path";

//const random = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

function LatestJobCards() {
    //const { filteredJobs } = useSelector(store => store.job);
    const { bookmarkedJobs } = useSelector(store => store.bookmark);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || ""; // Get the keyword from the URL
    const currentPage = parseInt(searchParams.get("page")) || 1; // Get the page number from the URL

    const [jobs, setJobs] = useState([]);
    //const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 9;

    useEffect(() => {
        setLoading(true);
    
        const delayDebounce = setTimeout(() => {
            const fetchJobs = async () => {
                try {
                    const locationFilters = searchParams.getAll('location');
                    const industryFilters = searchParams.getAll('industry');
                    const salaryFilters = searchParams.getAll('salary');
    
                    const res = await axios.get(`${import.meta.env.VITE_JOB_API_END_POINT}/get`, {
                        params: {
                            keyword,
                            page: currentPage,
                            limit,
                            location: locationFilters,
                            industry: industryFilters,
                            salary: salaryFilters
                        }
                    });
    
                    if (res.data.success) {
                        setJobs(res.data.jobs);
                        setTotalPages(res.data.totalPages);
                    }
                } catch (error) {
                    console.error("Error fetching jobs:", error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchJobs();
        }, 400);
    
        return () => clearTimeout(delayDebounce);
    }, [keyword, currentPage, searchParams]);
    


    const handleJobDescription = (id) => {
        navigate(`/jobdescription/${id}`);
    }

    const isBookmarked = (id) => bookmarkedJobs.includes(id);

    const toggleBookmark = (e, id) => {
        e.stopPropagation(); // Prevent triggering the job card click event
        if (isBookmarked(id)) {
            dispatch(removeBookmark(id));
        } else {
            dispatch(addBookmark(id));
        }
    };

    const truncateText = (text, maxLength = 100) => {
        if(!text) return ""; // Handle null or undefined text
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        }
        return text;
    };

    const getPostedDaysAgo = (dateStr) => {
        if (!dateStr) return ""; // Handle null or undefined dateStr
        const postedDate = new Date(dateStr);
        const today = new Date();
        const diffTime = today - postedDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 0 ? "Posted today" : `Posted ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    };

    const handlePageChange = (newPage) => {
        const path = location.pathname;
        navigate(`${path}?keyword=${encodeURIComponent(keyword)}&page=${newPage}`);
    };

    return (
        <>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
      ${currentPage <= 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"}
    `}
                >
                    ← Previous
                </button>

                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
      ${currentPage >= totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"}
    `}
                >
                    Next →
                </button>
            </div>


            {/* Job Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8 px-8">
                {loading ? Array.from({ length: limit }).map((_, i) => <SkeletonJobCard key={i} />)
                    : jobs.length <= 0 ? "No Jobs are available" : jobs.map((item, index) => {
                        const isFirst = index === 0;
                        const isLast = index === jobs.length - 1;

                        return (

                            <div
                                key={item._id || index}
                                className={`relative p-5 rounded-md border shadow-xl border-gray-500 cursor-pointer transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px] flex flex-col h-full dark:border-white ${isFirst || isLast
                                    ? "border-[2px] border-purple-600 shadow-purple-400"
                                    : "border-gray-300"
                                    }`}
                                onClick={() => handleJobDescription(item?._id)}>

                                <Tooltip title={isBookmarked(item?._id) ? "Unsave" : "Save"} arrow>
                                    <div
                                        className="absolute top-3 right-3 z-10 text-xl text-pink-600 hover:scale-110 transition-transform"
                                        onClick={(e) => toggleBookmark(e, item?._id)}
                                    >
                                        {isBookmarked(item?._id) ? <FaHeart /> : <FaRegHeart />}
                                    </div>
                                </Tooltip>

                                {/* Logo and Save Icon */}
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={item?.company?.logo || item?.companyLogo || "https://via.placeholder.com/40"}
                                        alt={item?.companyName || "Company Logo"}
                                        className="w-12 h-12 rounded-full border object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/40";
                                        }}
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold">{item?.companyName || "Unknow Company"}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-300">{item?.location || "Location not specified"}</p>
                                    </div>
                                </div>

                                {/* Bookmark Icon */}
                                {/* <Bookmark
                                    size={20}
                                    className="text-gray-400 hover:text-purple-500 transition"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Saved job:", item._id);
                                        // handle save logic here
                                    }}
                                /> */}


                                {/* Role Info */}
                                <div className="mb-4 ">
                                    <h3 className='text-xl font-bold text-purple-700'>{item?.title || "Job Title"}</h3>
                                    <p className='text-sm text-gray-600 dark:text-gray-300'>{truncateText(item?.description, 100)}</p>
                                </div>

                                {/* Tags */}
                                <div className='flex flex-wrap gap-2 mb-4'>
                                    <Badge className='bg-blue-100 text-blue-700 font-medium'>{item?.position || "Position"} position</Badge>
                                    <Badge className='bg-red-100 text-red-600 font-medium'>{item?.jobType || "Job Type"}</Badge>
                                    <Badge className='bg-purple-100 text-purple-700 font-medium'>{item?.salary || "Salary"}Lpa</Badge>
                                </div>

                                {/* Bottom Footer: Posted Date + View Button */}
                                <div className="mt-auto pt-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500 dark:text-gray-300">{getPostedDaysAgo(item?.createdAt)}</p>
                                        <button
                                            className="text-sm font-medium text-purple-600 hover:underline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleJobDescription(item?._id);
                                            }}
                                        >
                                            View Details →
                                        </button>
                                    </div>
                                </div>



                            </div>
                        );
                    })
                }
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
      ${currentPage <= 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"}
    `}
                >
                    ← Previous
                </button>

                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
      ${currentPage >= totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"}
    `}
                >
                    Next →
                </button>
            </div>

        </>
    );
}



export default LatestJobCards