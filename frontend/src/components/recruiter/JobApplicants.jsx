import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReusableTable from "../shared/ReusableTable";
import { Button } from "@/components/ui/button";

const JobApplicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            //console.log("Job ID:", jobId);
            try {
                const res = await axios.get(`${import.meta.env.VITE_APPLICATION_API_END_POINT}/${jobId}/applicants`, {
                    withCredentials: true,
                });
                //console.log(res.data);
                if (res?.data?.success) {
                    setApplicants(res.data.applicants);
                }
            } catch (error) {
                console.error("Error fetching applicants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobId], []);

    // Function to handle status update
    const handleUpdateStatus = async (applicantId, newStatus) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_APPLICATION_API_END_POINT}/status/${applicantId}/update`,
                { status: newStatus },
                { withCredentials: true }
            );

            // Update state to reflect the change immediately
            setApplicants((prev) =>
                prev.map((app) =>
                    app._id === applicantId ? { ...app, status: newStatus } : app
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Table columns
    const applicantColumns = [
        { key: "fullname", label: "Name", render: (app) => app.applicant?.fullname || "N/A" },
        { key: "email", label: "Email", render: (app) => app.applicant?.email || "N/A" },
        { key: "phoneNumber", label: "Phone", render: (app) => app.applicant?.phoneNumber || "N/A" },
        { key: "status", label: "Status", render: (app) => app.status },
        {
            key: "resume",
            label: "Resume",
            render: (app) =>
                app.applicant?.profile?.resume ? (
                    <a href={app.applicant.profile.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View Resume
                    </a>
                ) : (
                    "No Resume"
                ),
        },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Job Applicants</h2>
                <Button onClick={() => navigate("/recruiter/jobs")}>Back to Jobs</Button>
            </div>
            
            {loading ? (
                <p>Loading applicants...</p>
            ) : applicants.length > 0 ? (
                <ReusableTable data={applicants} caption="List of Applicants" columns={applicantColumns} type="applicants"
                onUpdateStatus={handleUpdateStatus}/>
            ) : (
                <p>No applicants found for this job.</p>
            )}
        </div>
    );
};

export default JobApplicants;
