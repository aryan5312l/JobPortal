import React, { useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchJobs } from "../../redux/actions/jobActions";


function HeroSection() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const dispatch = useDispatch();

    const handleSearch = () => {
        dispatch(fetchJobs(searchKeyword)); // Fetch filtered jobs
    };

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
          handleSearch();
      }
  };

    return (
        <div className="text-center my-6">
            <span className="text-[#F83002] font-medium">No. 1 Job Hunt</span>
            <h1 className="text-5xl font-bold my-4">
                Search, Apply & <br />Get Your <span className="text-[#6A38C2]">Dream Job</span>
            </h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
            <div className="flex w-[40%] text-center mx-auto my-4">
                <input
                    type="text"
                    placeholder="Find your dream job"
                    className="outline-none border-none w-full rounded-l-full pl-4"
                    value={searchKeyword}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <Button className="rounded-r-full bg-[#6A38C2]" onClick={handleSearch}>
                    <Search />
                </Button>
            </div>
        </div>
    );
}

export default HeroSection;
