import { Badge } from "@/components/ui/badge";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Tooltip } from "@mui/material";

const JobCard = ({ job, onClick, isBookmarked, onBookmarkToggle, showBookmark = true }) => {
    const truncateText = (text, maxLength = 100) => {
        if (!text) return "";
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        }
        return text;
    };
    const getPostedDaysAgo = (dateStr) => {
        if (!dateStr) return "";
        const postedDate = new Date(dateStr);
        const today = new Date();
        const diffTime = today - postedDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 0 ? "Posted today" : `Posted ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    };
    return (
        <div
            key={job._id}
            className={`relative p-5 rounded-md border shadow-xl border-gray-500 cursor-pointer transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px] flex flex-col h-full dark:border-white`}
            onClick={() => onClick(job._id)}
        >
            {showBookmark && (
                <Tooltip title={isBookmarked ? "Unsave" : "Save"} arrow>
                    <div
                        className="absolute top-3 right-3 z-10 text-xl text-pink-600 hover:scale-110 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBookmarkToggle && onBookmarkToggle(e, job._id);
                        }}
                    >
                        {isBookmarked ? <FaHeart /> : <FaRegHeart />}
                    </div>
                </Tooltip>
            )}
            {/* Logo and Save Icon */}
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={job?.company?.logo || job?.companyLogo || ""}
                    alt={job?.companyName || job?.company?.name || "Company Name"}
                    className="w-12 h-12 rounded-full border object-cover"
                    onError={(e) => {
                        if (e.target.src !== "https://via.placeholder.com/40") {
                            e.target.src = "https://via.placeholder.com/40";
                        }
                    }}
                />
                <div>
                    <h2 className="text-lg font-semibold">{job?.companyName || job?.company?.name || "Unknown Company"}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{job?.location || "Location not specified"}</p>
                </div>
            </div>
            {/* Role Info */}
            <div className="mb-4 ">
                <h3 className='text-xl font-bold text-purple-700'>{job?.title || "Job Title"}</h3>
                <p className='text-sm text-gray-600 dark:text-gray-300'>{truncateText(job?.description, 100)}</p>
            </div>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mb-4'>
                <Badge className='bg-blue-100 text-blue-700 font-medium'>{job?.position || "Position"} position</Badge>
                <Badge className='bg-red-100 text-red-600 font-medium'>{job?.jobType || "Job Type"}</Badge>
                <Badge className='bg-purple-100 text-purple-700 font-medium'>{job?.salary || "Salary"}Lpa</Badge>
            </div>
            {/* Bottom Footer: Posted Date + View Button */}
            <div className="mt-auto pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-300">{getPostedDaysAgo(job?.createdAt)}</p>
                    <button
                        className="text-sm font-medium text-purple-600 hover:underline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(job._id);
                        }}
                    >
                        View Details →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobCard; 