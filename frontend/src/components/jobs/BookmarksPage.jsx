import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, ArrowLeft, Heart, HeartOff, Clock, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { fetchBookmarkedJobs, removeBookmark } from '../../redux/actions/bookmarkActions';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { toast } from "@/hooks/use-toast";
import { Tooltip } from '@mui/material';

const BookmarksPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const { bookmarkedJobs, loading, error } = useSelector(store => store.bookmark);

  useEffect(() => {
    if (user) {
      dispatch(fetchBookmarkedJobs());
    }
    
  }, [dispatch, user]);

  const handleRemoveBookmark = async (jobId) => {
    try {
      await dispatch(removeBookmark(jobId));
      dispatch(fetchBookmarkedJobs());
      toast({
        title: "Bookmark removed",
        description: "Job has been removed from your saved items",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
      });
    }
  };

  

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">

        {/* Header with animated back button */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
                <ArrowLeft className="h-5 w-5" />
              </motion.div>
            </Link>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold flex items-center gap-2"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.5 }}
              >
                <Bookmark className="h-6 w-6 text-purple-600 fill-purple-600" />
              </motion.div>
              Saved Jobs
            </motion.h1>
          </div>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
          >
            {bookmarkedJobs?.length || 0} saved jobs
          </motion.span>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {[1, 2, 3, 4].map((i) => (
              <motion.div key={i} variants={item}>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg"
          >
            <p>Failed to load saved jobs: {error}</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => dispatch(fetchBookmarkedJobs())}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Retry
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && bookmarkedJobs?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.5 }}
            >
              <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
            </motion.div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No saved jobs yet</h3>
            <p className="mt-1 text-gray-500">
              Save jobs you're interested in by clicking the bookmark icon
            </p>
            <Link to="/jobs">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-4"
              >
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Browse Jobs
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        )}

        {/* Bookmarked Jobs List */}
        {!loading && bookmarkedJobs?.length > 0 && (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence>
              {bookmarkedJobs.map((job) => (
                <motion.div 
                  key={job._id}
                  variants={item}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                >
                  <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    {job.companyLogo && (
                      <motion.div whileHover={{ rotate: 5 }}>
                        <img 
                          src={job.companyLogo || job.company?.logo || ""} 
                          alt={job.companyName || job.company?.name || ""}
                          className="h-12 w-12 rounded-full object-cover border"
                        />
                      </motion.div>
                    )}
                    
                    {/* Job Details */}
                    <div className="flex-1">
                      <Link to={`/job/${job._id}`}>
                        <motion.h3 
                          whileHover={{ color: '#7c3aed' }}
                          className="text-lg font-semibold text-gray-900 dark:text-white"
                        >
                          {job.title}
                        </motion.h3>
                      </Link>
                      <p className="text-gray-600 dark:text-gray-300">{job.companyName || job.company?.name || ""}</p>
                      
                      {/* Job Metadata */}
                      <motion.div 
                        className="mt-3 flex flex-wrap gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {job.location && (
                          <Tooltip content="Location">
                            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </span>
                          </Tooltip>
                        )}
                        
                        {job.jobType && (
                          <Tooltip content="Job Type">
                            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.jobType}
                            </span>
                          </Tooltip>
                        )}
                        
                        {job.salary != 0 && (
                          <Tooltip content="Salary">
                            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {job.salary}
                            </span>
                          </Tooltip>
                        )}
                        
                        {job.createdAt && (
                          <Tooltip content="Posted Date">
                            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </Tooltip>
                        )}
                      </motion.div>
                    </div>
                    
                    {/* Action Buttons */}
                    <motion.div 
                      className="flex flex-col items-end gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Tooltip content="Remove bookmark">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveBookmark(job._id)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <HeartOff className="h-5 w-5" />
                        </Button>
                      </Tooltip>
                      
                      <Link to={`/job/${job._id}`}>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            View Details
                          </Button>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BookmarksPage;