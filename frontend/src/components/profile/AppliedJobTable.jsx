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
  import { ExternalLink } from "lucide-react";
  import { Skeleton } from "@/components/ui/skeleton";
  
  function AppliedJobTable() {
    const user = useSelector((store) => store.auth.user);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchAppliedJobs = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${import.meta.env.VITE_APPLICATION_API_END_POINT}/get`,
            { withCredentials: true }
          );
          
          if (response.data.success) {
            setAppliedJobs(response.data.applications);
          }
        } catch (error) {
          console.error("Error fetching applied jobs", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAppliedJobs();
    }, []);
  
    const getStatusBadge = (status, isExternal) => {
      if (isExternal) {
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-2 py-1 rounded-lg">
            External Application
          </Badge>
        );
      }
  
      switch (status?.toLowerCase()) {
        case "accepted":
          return (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1 rounded-lg">
              Accepted
            </Badge>
          );
        case "rejected":
          return (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-200 px-2 py-1 rounded-lg">
              Rejected
            </Badge>
          );
        case "interview":
          return (
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-2 py-1 rounded-lg">
              Interview
            </Badge>
          );
        case "applied":
          return (
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-2 py-1 rounded-lg">
              Applied
            </Badge>
          );
        default:
          return (
            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-2 py-1 rounded-lg">
              Pending
            </Badge>
          );
      }
    };
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#6A38C2]">Your Applications</h1>
          <p className="text-gray-600 mt-2">
            Track all your job applications in one place
          </p>
        </div>
  
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableCaption className="text-left p-4 bg-gray-50">
              {loading ? "Loading your applications..." : 
               appliedJobs.length > 0 
                 ? "List of jobs you have applied for" 
                 : "No jobs applied yet"}
            </TableCaption>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Job Details</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-[80px] ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : appliedJobs.length > 0 ? (
                appliedJobs.map((application) => (
                  <TableRow key={application._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {new Date(application.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {application.job?.title || "N/A"}
                        </span>
                        {!application.job?.company && (
                          <a
                            href={application.job?.applyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-xs flex items-center mt-1"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View original posting
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {application.job?.company?.name || 
                       application.job?.companyName || 
                       "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {getStatusBadge(application.status, !application.job?.company)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src="/empty-state.svg"
                        alt="No applications"
                        className="h-32 w-32 mb-4"
                      />
                      <p className="text-gray-600">You haven't applied to any jobs yet</p>
                      <button className="mt-4 text-[#6A38C2] font-medium">
                        Browse Jobs
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  
  export default AppliedJobTable;