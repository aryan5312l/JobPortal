import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';


function Home() {
    const {user} = useSelector(state => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if(user?.role === "recruiter") {
            navigate('/recruiter/companies')
        }
    }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5ff] to-white">
        <HeroSection/>
        <CategoryCarousel/>
        <LatestJobs/>
    </div>
    
  )
}

export default Home