import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { setAllJobs } from "@/redux/jobSlice"; // Import Redux action

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer",
  "UI/UX Designer",
  "Full",
];

function CategoryCarousel() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState(""); // Track active category


  const handleCategoryClick = async (category) => {
    const newCategory = activeCategory === category ? "" : category; // Toggle active category
    setActiveCategory(newCategory);

    try {
      const endpoint = newCategory
        ? `${import.meta.env.VITE_JOB_API_END_POINT}/get?keyword=${newCategory}`
        : `${import.meta.env.VITE_JOB_API_END_POINT}/get`; // Fetch all jobs if no category is selected

      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.success) {
        dispatch(setAllJobs(data.jobs));
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  return (
    <div className="relative py-8 max-w-5xl mx-auto">
      <h2 className="text-center text-2xl font-bold mb-6">Explore Categories</h2>

      <div className="relative">
        <Carousel>
          <CarouselContent className="flex -ml-2">
            {categories.map((cat, index) => (
              <CarouselItem
                key={index}
                className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <Button
                  variant={activeCategory === cat ? "default" : "outline"}
                  className={`w-full whitespace-nowrap rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === cat
                      ? "bg-[#6A38C2] text-white shadow-md"
                      : "border-gray-300  hover:bg-[#6A38C2] hover:text-white"
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 -translate-x-full" />
          <CarouselNext className="right-0 translate-x-full" />
        </Carousel>
      </div>
    </div>
  );
}

export default CategoryCarousel;
