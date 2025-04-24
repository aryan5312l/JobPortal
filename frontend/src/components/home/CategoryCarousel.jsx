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
    <div className="relative py-8 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Categories</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Discover our wide range of categories</p>
      </div>

      <div className="relative group">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {categories.map((cat, index) => (
              <CarouselItem
                key={index}
                className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-[20%] xl:basis-[15%]"
              >
                <div className="p-1">
                  <Button
                    variant={activeCategory === cat ? "default" : "outline"}
                    className={`w-full whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 
                      ${activeCategory === cat
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-purple-700 hover:border-purple-300"
                      }`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-purple-600 transition-all group-hover:opacity-100 opacity-0" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-purple-600 transition-all group-hover:opacity-100 opacity-0" />
        </Carousel>
      </div>
    </div>
  );
}

export default CategoryCarousel;
