import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';


function Home() {
    const {darkMode} = useDarkMode();
    const {user} = useSelector(state => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if(user?.role === "recruiter") {
            navigate('/recruiter/companies')
        }
    }, [user, navigate]);
  
  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
        <HeroSection/>
        <CategoryCarousel/>
        <LatestJobs/>
    </div>
    
  )
}

export default Home