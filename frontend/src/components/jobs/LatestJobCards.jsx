
import { Badge } from "@/components/ui/badge"
import { useSelector } from 'react-redux';
import useGetAllJobs from '../../hooks/customHooks/useGetAllJobs';
import { useNavigate } from "react-router-dom";
import { filterJobs } from "../../redux/jobSlice";

//const random = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

function LatestJobCards() {

    
    const { filteredJobs } = useSelector(store => store.job);
    const navigate = useNavigate();
    const handleJobDescription = (id) => {
        navigate(`/jobdescription/${id}`);
    }

    const truncateText = (text, maxLength = 100) => {
        if (text.length > maxLength) {
          return text.slice(0, maxLength) + "...";
        }
        return text;
      };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
            {
                filteredJobs.length <= 0 ? "No Jobs are available" : filteredJobs.map((item) => (
                    
                    <div
                        key={item._id}
                        className='p-5 rounded-md border shadow-xl border-gray-500 cursor-pointer' 
                        onClick={() => handleJobDescription(item._id)}>
                        <div>
                        
                            <h1 className='font-medium text-lg'>{item.company.name}</h1>
                            <p className='text-sm text-gray-400'>{item.location}</p>
                        </div>
                        <div>
                            <h1 className='font-bold text-lg'>{item.title}</h1>
                            
                            <p className='text-sm text-gray-600'>{truncateText(item.description, 100)}</p>

                        </div>
                        <div className='flex items-center gap-2 mt-4'>
                            <Badge className='text-blue-700 font-bold' variant='ghost'>{item.position} position</Badge>
                            <Badge className='text-[#F83002] font-bold' variant='ghost'>{item.jobType}</Badge>
                            <Badge className='text-[#7209b7] font-bold' variant='ghost'>{item.salary}Lpa</Badge>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default LatestJobCards