import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'

import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { FaLightbulb } from 'react-icons/fa';


function Home() {
  const { darkMode } = useDarkMode();
  const { user } = useSelector(state => state.auth);
  const [showRecommendationPrompt, setShowRecommendationPrompt] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate('/recruiter/companies')
    }
  }, [user, navigate]);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <HeroSection />
      <CategoryCarousel />

      {/* Recommendation Banner (shown when no filters are open) */}
      {user && showRecommendationPrompt && (
        <div className={`max-w-7xl mx-auto ${darkMode ? 'bg-blue-900' : 'bg-blue-50'} py-4 border-l-4 border-blue-500`}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center">
              <FaLightbulb className={`${darkMode ? 'text-blue-300' : 'text-blue-500'} mr-3 text-xl`} />
              <div className="flex-1">
                <p className={`font-medium ${darkMode ? 'text-blue-100' : 'text-blue-800'}`}>
                  Get personalized job recommendations based on your resume!
                </p>
                <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                  <Link
                    to="/recommended-jobs"
                    className={`underline ${darkMode ? 'hover:text-blue-300' : 'hover:text-blue-800'}`}
                  >
                    Click here
                  </Link> to discover jobs matching your skills
                </p>
              </div>
              <button
                onClick={() => setShowRecommendationPrompt(false)}
                className={`${darkMode ? 'text-blue-300 hover:text-blue-100' : 'text-blue-500 hover:text-blue-700'}`}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <LatestJobs />
    </div>

  )
}

export default Home