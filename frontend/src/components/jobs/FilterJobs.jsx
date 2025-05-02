import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { X, Search } from 'lucide-react'; // Added Search icon
import { useDispatch } from 'react-redux';
import { setFilteredJobs } from '../../redux/jobSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import {filters} from '../../data/filterData';
// const filters = {
//     Location: [
//         "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune", "Jaipur",
//         "Kolkata", "Lucknow", "Surat", "Vadodara", "Visakhapatnam", "Nagpur",
//         "Patna", "Indore", "Coimbatore", "Agra", "Ahmedabad", "Bhopal", "Chandigarh"
//     ],
//     Industry: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Data Scientist", "UI/UX Designer"],
//     SalaryRanges: ["3-6 LPA", "6-10 LPA", "10-15 LPA", "15+ LPA"]
// };

function FilterJobs({ isOpen, toggleFilter }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [locationSearch, setLocationSearch] = useState('');
    const [industrySearch, setIndustrySearch] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({
        location: [],
        industry: [],
        salary: [],
    });

    const handleCheckboxChange = (category, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter(item => item !== value)
                : [...prev[category], value]
        }));
    };

    useEffect(() => {
        dispatch(setFilteredJobs(selectedFilters));

        const queryParams = new URLSearchParams();
        selectedFilters.location.forEach(loc => queryParams.append('location', loc));
        selectedFilters.industry.forEach(ind => queryParams.append('industry', ind));
        selectedFilters.salary.forEach(sal => queryParams.append('salary', sal));

        navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`,
        });
    }, [selectedFilters, dispatch, navigate, location.pathname]);

    return (
        <div className={`fixed left-0 z-40 h-full w-[300px] shadow-lg p-6 transform transition-transform duration-300 ease-in-out 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-[280px] lg:shadow-sm lg:sticky h-[calc(100vh-56px)] top-14 overflow-y-auto`}>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h1>
                <button 
                    className="lg:hidden p-1 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={toggleFilter}
                    aria-label="Close filters"
                >
                    <X size={20} className="text-gray-600 dark:text-white" />
                </button>
            </div>

            {/* Location Filter */}
            <div className="mb-6">
                <div className='relative mb-3'>
                    <h2 className="font-semibold text-gray-700 dark:text-white mb-2">Location</h2>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
                        <input
                            placeholder="Search locations..."
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                    {filters.Location
                        .filter(loc => loc.toLowerCase().includes(locationSearch.toLowerCase())).slice(0, 8)
                        .map((location, idx) => (
                            <div key={idx} className="flex items-center py-2 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700 rounded px-1">
                                <Checkbox
                                    id={`location-${idx}`}
                                    checked={selectedFilters.location.includes(location)}
                                    onCheckedChange={() => handleCheckboxChange('location', location)}
                                    className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <label 
                                    htmlFor={`location-${idx}`}
                                    className="ml-3 text-sm text-gray-700 dark:text-white cursor-pointer select-none"
                                >
                                    {location}
                                </label>
                            </div>
                        ))}
                </div>
            </div>

            {/* Industry Filter */}
            <div className="mb-6">
                <div className='relative mb-3'>
                    <h2 className="font-semibold text-gray-700 dark:text-white mb-2">Industry</h2>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Search industries..."
                            value={industrySearch}
                            onChange={(e) => setIndustrySearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                    {filters.Industry
                        .filter(ind => ind.toLowerCase().includes(industrySearch.toLowerCase())).slice(0, 8)
                        .map((industry, idx) => (
                            <div key={idx} className="flex items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-1">
                                <Checkbox
                                    id={`industry-${idx}`}
                                    checked={selectedFilters.industry.includes(industry)}
                                    onCheckedChange={() => handleCheckboxChange('industry', industry)}
                                    className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <label 
                                    htmlFor={`industry-${idx}`}
                                    className="ml-3 text-sm text-gray-700 dark:text-white cursor-pointer select-none"
                                >
                                    {industry}
                                </label>
                            </div>
                        ))}
                </div>
            </div>

            {/* Salary Range Filter */}
            <div className="mb-6">
                <h2 className="font-semibold text-gray-700 dark:text-white mb-3">Salary Range</h2>
                <div className="space-y-2">
                    {filters.SalaryRanges.map((range, idx) => (
                        <div key={idx} className="flex items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-1">
                            <Checkbox
                                id={`salary-${idx}`}
                                checked={selectedFilters.salary.includes(range)}
                                onCheckedChange={() => handleCheckboxChange('salary', range)}
                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <label 
                                htmlFor={`salary-${idx}`}
                                className="ml-3 text-sm text-gray-700 dark:text-white cursor-pointer select-none"
                            >
                                {range}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Clear All Button */}
            {Object.values(selectedFilters).some(arr => arr.length > 0) && (
                <button 
                    onClick={() => setSelectedFilters({ location: [], industry: [], salary: [] })}
                    className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
}

export default FilterJobs;