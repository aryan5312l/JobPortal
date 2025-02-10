import { useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast"
import { setUser } from '../../redux/authSlice';
import { setAllJobs } from '../../redux/jobSlice';


function Navbar() {
  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch();

  const navigate = useNavigate();

  //console.log("Auth state:", user);
  //console.log(JSON.stringify(user, null, 2));
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setAllJobs([])); // Clear job state when logging out
        dispatch(setUser(null));
        toast({
          title: res.data.message,
          className: "bg-green-500 text-white font-bold rounded-lg shadow-lg"
        })
        navigate('/')
      }
    } catch (error) {
      console.log(error);
      toast({
        title: `Logout failed`,
        variant: "destructive"
      })
    }
  }


  return (
    <div className="bg-white  fixed top-0 left-0 w-full shadow z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-4 lg:px-8  h-16">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold">
            Job<span className="text-[#F83002]">Portal</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          <ul className="flex font-medium items-center gap-5">
            {
              user && user.role === 'recruiter' ? (
                <>
                  <li className="hover:text-[#6A38C2]">
                    <Link to="/recruiter/companies">Companies</Link>
                  </li>
                  <li className="hover:text-[#6A38C2]">
                    <Link to="/recruiter/jobs">Jobs</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:text-[#6A38C2]">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="hover:text-[#6A38C2]">
                    <Link to="/jobs">Jobs</Link>
                  </li>
                  <li className="hover:text-[#6A38C2]">
                    <Link to="/browse">Browse</Link>
                  </li>
                </>
              )
            }

          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] my-2">Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage src={user?.profile?.profilePhoto} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex gap-4">
                  <div>
                    <Avatar>
                      <AvatarImage src={user?.profile?.profilePhoto} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h4 className="font-medium">{user.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>
                <div className="flex cursor-pointer">
                  <User className="my-2" />
                  <Link to='/profile'>
                    <Button variant="link">View Profile</Button>
                  </Link>
                </div>
                <div className="flex cursor-pointer">
                  <LogOut />

                  <Button variant="link" className="-my-2" onClick={logoutHandler}>
                    Logout
                  </Button>

                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <ul className="flex flex-col font-medium items-start gap-3 px-4 py-4">
            {
              user && user.role === 'recruiter' ? (
                <>
                  <li className="hover:text-[#6A38C2]">
                    <Link to="/recruiter/companies" onClick={() => setMenuOpen(false)}>
                      Companies
                    </Link>
                  </li>
                  <li className="hover:text-[#6A38C2]">
                    <Link to="/recruiter/jobs" onClick={() => setMenuOpen(false)}>
                      Jobs
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:text-[#6A38C2]">
                    <Link to="/" onClick={() => setMenuOpen(false)}>
                      Home
                    </Link>
                  </li>
                  <li className="hover:text-[#6A38C2]">
                    <Link to="/jobs" onClick={() => setMenuOpen(false)}>
                      Jobs
                    </Link>
                  </li>
                  <li className="hover:text-[#6A38C2]">
                    <Link to="/browse" onClick={() => setMenuOpen(false)}>
                      Browse
                    </Link>
                  </li>
                </>
              )
            }
            
          </ul>
          {!user ? (
            <div className="flex flex-col gap-2 px-4">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] w-full">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <div className="px-4 py-4">
              <div className="flex gap-2 items-center">
                <Avatar>
                  <AvatarImage src={user?.profile?.profilePhoto} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{user.fullname}</h4>
                  <p className="text-sm text-muted-foreground">
                    {user?.profile?.bio}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link to='/profile'>
                  <Button variant="link">
                    View Profile
                  </Button>
                </Link>
                <Button variant="link" className="ml-4" onClick={logoutHandler}>
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar