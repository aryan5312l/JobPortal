import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  User, LogOut, Menu, X, Bell, Search, Loader2, Sun, Moon,
  Bookmark
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from 'axios';
import { setUser } from '../../redux/authSlice';
import { setAllJobs } from '../../redux/jobSlice';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@mui/material';
import { fetchBookmarkedJobs } from '../../redux/actions/bookmarkActions';

const UserProfileDropdown = ({ user, logoutHandler, isLoggingOut, bookmarks, isFetchingBookmarks }) => (
  <Popover>
    <PopoverTrigger>
      <Avatar>
        <AvatarImage src={user?.profile?.profilePhoto || ""} />
        <AvatarFallback>{user?.fullname?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
    </PopoverTrigger>
    <PopoverContent className="w-72">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={user?.profile?.profilePhoto || ""} />
          <AvatarFallback>{user?.fullname?.charAt(0) || "u"}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{user?.fullname || "NO USER"}</h4>
          <p className="text-sm text-muted-foreground">
            {user?.profile?.bio || "Member since " + new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Bookmarks Section */}
      <div className="mt-4 border-t pt-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-purple-600" />
            Saved Jobs
          </h3>
          <Link to="/bookmarks" className="text-xs text-purple-600 hover:underline">
            View All
          </Link>
        </div>
        
        {isFetchingBookmarks ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : bookmarks?.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {bookmarks.slice(0, 3).map((job) => (
              
              <Link
                key={job._id}
                to={`/jobdescription/${job?._id}`}
                className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <p className="font-medium text-sm truncate">{job?.title || "no title"}</p>
                <p className="text-xs text-muted-foreground truncate">{job?.companyName || "no company name"}</p>
              </Link>
            ))}
            {bookmarks?.length > 3 && (
              <div className="text-center text-xs text-muted-foreground pt-1">
                +{bookmarks?.length - 3} more
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-2">No saved jobs yet</p>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <Link to='/profile'>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <User className="h-4 w-4" />
            View Profile
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600"
          onClick={logoutHandler}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </PopoverContent>
  </Popover>
);



const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFetchingBookmarks, setIsFetchingBookmarks] = useState(false);
  const { bookmarkedJobs } = useSelector(store => store.bookmark);

  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (user?._id) {
      const fetchBookmarks = async () => {
        setIsFetchingBookmarks(true);
        try {
          await dispatch(fetchBookmarkedJobs());
          setIsFetchingBookmarks(false);
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
          setIsFetchingBookmarks(false);
        }
      };
      fetchBookmarks();
    }
  }, [user?._id, dispatch]);

  const logoutHandler = async () => {

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_USER_API_END_POINT}/logout`,
        { withCredentials: true }
      );

      if (res.data.success) {
        // Clear user data from state
        dispatch(setUser(null));
        dispatch(setAllJobs([]));

        // Show success notification
        toast({
          title: res.data.message,
          className: "bg-green-500 text-white"
        });

        // Redirect to home page
        navigate('/');
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: error.response?.data?.message || "Logout failed",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-medium transition-colors ${location.pathname === to
          ? 'text-[#6A38C2] font-semibold'
          : 'text-gray-600 hover:text-[#6A38C2]'
        } group`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 h-0.5 ${location.pathname === to ? 'w-full' : 'w-0'
        } bg-[#6A38C2] transition-all duration-300 group-hover:w-full`}></span>
    </Link>
  );

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md' : 'bg-white dark:bg-gray-900'
      }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold">
              Job<span className="text-[#F83002]">Portal</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/jobs">Jobs</NavLink>
              {user?.role === 'recruiter' && (
                <>
                  <NavLink to="/recruiter/companies">Companies</NavLink>
                  <NavLink to="/recruiter/jobs">Post Job</NavLink>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 ml-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6A38C2] w-40 sm:w-56"
                />
              </div>

              {/* Dark Mode */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* User Profile */}
              {user ? (
                <UserProfileDropdown 
                user={user} 
                logoutHandler={logoutHandler}
                isLoggingOut={isLoggingOut}
                bookmarks={bookmarkedJobs || []}
                isFetchingBookmarks={isFetchingBookmarks}
              />
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <Link to="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                      Signup
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6A38C2]"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-3 space-y-4">
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6A38C2]"
              />

              <div className="flex flex-col space-y-2">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/jobs">Jobs</NavLink>
                {user?.role === 'recruiter' && (
                  <>
                    <NavLink to="/recruiter/companies">Companies</NavLink>
                    <NavLink to="/recruiter/jobs">Post Job</NavLink>
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Avatar>
                        <AvatarImage src={user?.profile?.profilePhoto} />
                        <AvatarFallback>{user?.fullname?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.fullname}</p>
                        <p className="text-sm text-gray-500">View Profile</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
                    >
                      {darkMode ? (
                        <>
                          <Sun className="h-5 w-5 text-yellow-400" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-5 w-5 text-gray-600" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={logoutHandler}
                      disabled={isLoggingOut}
                      className="flex items-center gap-3 p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      className="w-full py-2 px-4 border rounded-md text-center hover:bg-gray-50"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="w-full py-2 px-4 bg-[#6A38C2] text-white rounded-md text-center hover:bg-[#5b30a6]"
                    >
                      Signup
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;