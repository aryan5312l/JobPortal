import LatestJobCards from '../jobs/LatestJobCards';

function LatestJobs() {
  
  return (
    <div className='max-w-7xl mt-24 mx-auto px-4 lg:px-8 my-8'>
        <h1 className='text-4xl font-bold text-center md:text-left'><span className='text-[#6A38C2]'>Latest & Top</span> Job Openings</h1>
        <LatestJobCards/>
    </div>
  )
}

export default LatestJobs