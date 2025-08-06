import { useState } from 'react'
import FilterJobs from './FilterJobs'
import LatestJobCards from './LatestJobCards'
import { FaFilter, FaLightbulb } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Jobs() {
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [showRecommendationPrompt, setShowRecommendationPrompt] = useState(true);
    const {user} = useSelector(store => store.auth);

    const toggleFilter = () => {
        setFilterOpen(!isFilterOpen);
        setShowRecommendationPrompt(false); // Hide prompt when filters are opened
    };

    return (
        <div className="relative">


            {/* Mobile filter overlay */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleFilter}
                ></div>
            )}

            {/* Mobile filter toggle button */}
            {!isFilterOpen && (
                <button
                    className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                    onClick={toggleFilter}
                >
                    <FaFilter size={20} />
                </button>
            )}

            {/* Main content */}
            <div className="flex">
                <FilterJobs isOpen={isFilterOpen} toggleFilter={toggleFilter} />
                <div className="flex-1 max-w-7xl mx-auto px-4 lg:px-8 overflow-y-auto">
                    {/* Recommendation Banner (shown when no filters are open) */}
                    {user && showRecommendationPrompt && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 mx-4 rounded-r-lg mt-4">
                            <div className="flex items-center">
                                <FaLightbulb className="text-blue-500 mr-3 text-xl" />
                                <div className="flex-1">
                                    <p className="font-medium text-blue-800">
                                        Get personalized job recommendations based on your resume!
                                    </p>
                                    <p className="text-sm text-blue-600">
                                        <Link
                                            to="/recommended-jobs"
                                            className="underline hover:text-blue-800"
                                        >
                                            Click here
                                        </Link> to discover jobs matching your skills
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowRecommendationPrompt(false)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}
                    <LatestJobCards />
                </div>
            </div>
        </div>
    );
}

export default Jobs;