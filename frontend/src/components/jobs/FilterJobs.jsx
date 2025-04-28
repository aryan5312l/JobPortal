import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setFilteredJobs } from '../../redux/jobSlice';
import { useNavigate, useLocation } from 'react-router-dom'; // added

const filters = {
    Location: [
        "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune", "Jaipur",
        "Kolkata", "Lucknow", "Surat", "Vadodara", "Visakhapatnam", "Nagpur",
        "Patna", "Indore", "Coimbatore", "Agra", "Ahmedabad", "Bhopal", "Chandigarh"
    ],
    Industry: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Data Scientist", "UI/UX Designer"],
    SalaryRanges: ["3-6 LPA", "6-10 LPA", "10-15 LPA", "15+ LPA"]
};

function FilterJobs({ isOpen, toggleFilter }) {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // added
    const location = useLocation(); // added

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
        <div className={`fixed left-0 z-40 h-full w-[70%] bg-white shadow-lg p-4 transform transition-transform duration-500 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-[25%] lg:shadow-none lg:sticky h-screen top-14 overflow-y-auto`}>

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Filter Jobs</h1>
                <button className="lg:hidden" onClick={toggleFilter}>
                    <X size={24} />
                </button>
            </div>

            {/* Location Filter */}
            <div className="my-4">
                <div className='flex justify-between'>
                    <h2 className="font-bold text-lg">Location</h2>
                    <input
                        placeholder="Search location..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className="focus:outline-none focus:ring-0 border border-gray-300 px-2 rounded-md"
                    />
                </div>
                {filters.Location
                    .filter(loc => loc.toLowerCase().includes(locationSearch.toLowerCase())).slice(0, 8)
                    .map((location, idx) => (
                        <div key={idx} className="my-2 flex items-center">
                            <Checkbox
                                checked={selectedFilters.location.includes(location)}
                                onCheckedChange={() => handleCheckboxChange('location', location)}
                            />
                            <label className="text-sm font-medium leading-none px-2 text-gray-500">{location}</label>
                        </div>
                    ))}
            </div>

            {/* Industry Filter */}
            <div className="my-4">
                <div className='flex justify-between'>
                    <h2 className="font-bold text-lg">Industry</h2>
                    <input
                        placeholder="Search industry..."
                        value={industrySearch}
                        onChange={(e) => setIndustrySearch(e.target.value)}
                        className="focus:outline-none focus:ring-0 border border-gray-300 px-2 rounded-md"
                    />
                </div>
                {filters.Industry
                    .filter(ind => ind.toLowerCase().includes(industrySearch.toLowerCase()))
                    .map((industry, idx) => (
                        <div key={idx} className="my-2 flex items-center">
                            <Checkbox
                                checked={selectedFilters.industry.includes(industry)}
                                onCheckedChange={() => handleCheckboxChange('industry', industry)}
                            />
                            <label className="text-sm font-medium leading-none px-2 text-gray-500">{industry}</label>
                        </div>
                    ))}
            </div>

            {/* Salary Range Filter */}
            <div className="my-4">
                <h2 className="font-bold text-lg">Salary Range</h2>
                {filters.SalaryRanges.map((range, idx) => (
                    <div key={idx} className="my-2 flex items-center">
                        <Checkbox
                            checked={selectedFilters.salary.includes(range)}
                            onCheckedChange={() => handleCheckboxChange('salary', range)}
                        />
                        <label className="text-sm font-medium leading-none px-2 text-gray-500">{range}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FilterJobs;
