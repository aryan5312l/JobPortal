import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchJobs } from "../../redux/actions/jobActions";
import CategoryCarousel from "./CategoryCarousel";
import { useNavigate } from "react-router-dom";


function HeroSection() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(searchKeyword.trim())}&page=1`);
    } else {
      navigate(`/?page=1`);
    }
  };
  /*
      const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };
  */

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchJobs(searchKeyword)); // Fetch results dynamically
    }, 300); // Debounce time (adjust as needed)

    return () => clearTimeout(delayDebounceFn); // Cleanup function
  }, [searchKeyword, dispatch]);

  return (
    <div className="mt-24 flex items-center justify-center flex-col text-center px-4 max-w-6xl mx-auto rounded-xl ">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Search, Apply & <br />
        Get Your <span className="text-[#6A38C2]">Dream Job</span>
      </h1>
      <p className="text-gray-600">Discover your ideal role. Apply confidently and land your perfect job!</p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 w-full max-w-xl mx-auto my-4">
        <input
          type="text"
          placeholder="Search by job title, company, or skill"
          className="w-full px-4 py-2 rounded-full sm:rounded-l-full sm:rounded-r-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm transition"
          value={searchKeyword}
          //onKeyDown={handleKeyDown}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <Button
          className="rounded-full sm:rounded-r-full sm:rounded-l-none bg-[#6A38C2] hover:bg-[#5a2fad] text-white px-6 py-2 transition"
          onClick={handleSearch}>
          <Search size={18} className="mr-2"/>
          Search
        </Button>
      </div>
      
    </div>
  );
}

export default HeroSection;
