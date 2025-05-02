import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";

const categories = [
  "Frontend",
  "Backend",
  "Data Science",
  "Design",
  "Full Stack",
  "DevOps",
  "Mobile",
  "QA",
  "Product",
  "Marketing",
];

function CategoryCarousel() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("");

  const handleCategoryClick = (category) => {
    const newCategory = activeCategory === category ? "" : category;
    setActiveCategory(newCategory);
    
    const searchParams = new URLSearchParams(location.search);
    if (newCategory) {
      searchParams.set("keyword", newCategory);
      searchParams.set("page", "1");
    } else {
      searchParams.delete("keyword");
    }
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <section className="w-full py-8 md:py-12 max-w-6xl mx-auto">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Browse by Category
          </h2>
          <p className="text-gray-600 dark:text-white max-w-2xl mx-auto">
            Find your perfect job in these popular categories
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: false,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1">
              {categories.map((category, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <div className="p-1">
                    <Button
                      variant={activeCategory === category ? "default" : "outline"}
                      className={`w-full rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        activeCategory === category
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg"
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-blue-600 hover:border-blue-200"
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 hidden sm:flex w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-blue-600" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 hidden sm:flex w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-blue-600" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

export default CategoryCarousel;