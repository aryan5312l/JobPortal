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
    <>
        <HeroSection/>
        <CategoryCarousel/>
        <LatestJobs/>
    </>
    
  )
}

export default Home