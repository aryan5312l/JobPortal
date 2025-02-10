import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function AppliedJobTable() {
    const user = useSelector((store) => store.auth.user);
    const [appliedJobs, setAppliedJobs] = useState([]);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APPLICATION_API_END_POINT}/get`, {
                    withCredentials: true
                });
                //console.log("Response data:", response.data);
                if (response.data.success) {
                    setAppliedJobs(response.data.applications);
                }
            } catch (error) {
                console.error("Error fetching applied jobs", error);
            }
        };

        fetchAppliedJobs();
    },  []);

    return (
        <div>
            <div className="flex justify-center mt-3">
                <h1 className="font-bold text-lg text-[#6A38C2]">Applied Jobs</h1>
            </div>

            <Table>
                <TableCaption>List of jobs you have applied for.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appliedJobs.length > 0 ? (
                        appliedJobs.map((application) => (
                            <TableRow key={application._id}>
                                <TableCell className="font-medium">
                                    {new Date(application.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{application.job?.title || "N/A"}</TableCell>
                                <TableCell>{application.job?.company?.name || "N/A"}</TableCell>
                                <TableCell className="text-right">
                                <Badge className={`px-2 py-1 rounded-lg ${
        application.status === "accepted" 
            ? "bg-green-500 text-white" 
            : application.status === "rejected" 
            ? "bg-red-500 text-white" 
            : "bg-gray-500 text-white"
    }`}>
        {application.status}
    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                No jobs applied yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default AppliedJobTable;
