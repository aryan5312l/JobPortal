import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { X } from 'lucide-react';


const filters = [
    {
        type: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        type: "Industry",
        array: ["Frontend Developer", "Backend Developer", "Fullstack Developer"]
    },
    {
        type: "Salary",
        array: ["3-7L", "7-20L", "20+ L"]
    }
]

function FilterJobs({isOpen, toggleFilter}) {
    return (
        <div
            className={`fixed left-0 z-40 h-full w-[70%] bg-white shadow-lg p-4 transform transition-transform duration-500 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-[20%] lg:shadow-none lg:sticky h-screen top-14`}>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Filter Jobs</h1>
                <button className="lg:hidden" onClick={toggleFilter}>
                    <X size={24} />
                </button>
            </div>
            <div>
                {filters.map((item, index) => (
                    <div key={index} className="my-4 font-bold text-lg">
                        <h2>{item.type}</h2>
                        {item.array.map((data, idx) => (
                            <div key={idx} className="my-2 flex items-center">
                                <Checkbox />
                                <label
                                    htmlFor={`${item.type}-${idx}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 px-2 text-gray-500">
                                    {data}
                                </label>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FilterJobs