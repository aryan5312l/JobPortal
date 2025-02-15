import { useState } from 'react'
import FilterJobs from './FilterJobs'
import LatestJobCards from './LatestJobCards'
import { FaFilter } from "react-icons/fa";


function Jobs() {
    const [isFilterOpen, setFilterOpen] = useState(false);

    const toggleFilter = () => setFilterOpen(!isFilterOpen);

    return (
        <div>
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleFilter}
                ></div>
            )}
            {/* Hamburger Icon */}
            {!isFilterOpen && <button
                className="lg:hidden fixed my-2 bottom-4 left-4 z-50 p-2 bg-gray-100 rounded-full shadow-md"
                onClick={toggleFilter}>
                <FaFilter size={24} />
            </button>}
            {/* Main Page Content */}
            <div className="flex ">
                <FilterJobs isOpen={isFilterOpen} toggleFilter={toggleFilter} />
                <div className="flex-1 max-w-7xl mx-auto px-4 lg:px-8 overflow-y-auto">
                    <LatestJobCards />
                </div>
            </div>
            
        </div>
    );
}

export default Jobs