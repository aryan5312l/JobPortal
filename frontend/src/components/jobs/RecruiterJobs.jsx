import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReusableTable from "../shared/ReusableTable";

const RecruiterJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_JOB_API_END_POINT}/getAdminJobs`, {
                    withCredentials: true,
                });

                if (res?.data?.success) {
                    setJobs(res.data.jobs);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, []);

    // Filter logic
    // Custom filtering logic
    const filterJobs = (jobs, query) => {
        if (!query) return jobs; // If no query, show all

        const lowerCaseQuery = query.toLowerCase();

        // jobs that start with the query
        const startsWithMatch = jobs.filter(job =>
            job.title?.toLowerCase().startsWith(lowerCaseQuery)
        );

        // Jobs that contain the query but don’t start with it
        const containsMatch = jobs.filter(job =>
            job.title?.toLowerCase().includes(lowerCaseQuery) && 
            !job.title?.toLowerCase().startsWith(lowerCaseQuery)
        );

        return [...startsWithMatch, ...containsMatch]; // Prioritize startsWithMatch
    };

    const filteredJobs = filterJobs(jobs, searchQuery);

    // Column configuration
    const jobColumns = [
        { 
            key: "company", 
            label: "Company", 
            render: (item) => item.company?.name || "N/A"  // Show company name or 'N/A' if not populated
        },
        { key: "title", label: "Job Title" },
        { key: "createdAt", label: "Date Posted", render: (job) => new Date(job.createdAt).toLocaleDateString() }
    ];

    const handleEdit = (jobId) => {
        navigate(`/recruiter/job/${jobId}`);
    };
    const handleViewApplicants = (jobId) => {
        if (!jobId) {
            console.error("handleViewApplicants: jobId is undefined!");
            return;
        }
        //console.log("Navigating to applicants page with jobId:", jobId);
        navigate(`/recruiter/${jobId}/applicants`);
    };

    return (
        <div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <Input
                        className="w-fit"
                        placeholder="Filter Jobs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <Button onClick={() => navigate("/recruiter/createjob")}>New Job</Button>
                </div>

                {/* Pass filtered jobs to ReusableTable */}
                <ReusableTable data={filteredJobs} caption="A list of your posted jobs" columns={jobColumns} onEdit={handleEdit} onViewApplicants={handleViewApplicants} // ✅ Only for job table
    type="jobs" />
            </div>
        </div>
    );
};

export default RecruiterJobs;
