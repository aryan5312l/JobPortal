import { useEffect } from 'react'
import './App.css'
import Navbar from './components/shared/Navbar'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Home from './components/home/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Jobs from './components/jobs/Jobs'
import Footer from './components/shared/Footer'
import { useDispatch } from 'react-redux'
import { fetchUser } from './redux/authSlice'
import Profile from './components/profile/Profile'
import JobsDescription from './components/jobs/JobsDescription'
import useGetAllJobs from './hooks/customHooks/useGetAllJobs'
import Companies from './components/recruiter/Companies'
import { CreateCompany } from './components/recruiter/CreateCompany'
import CompanySetup from './components/recruiter/CompanySetup'
import RecruiterJobs from './components/jobs/RecruiterJobs'
import CreateJob from './components/jobs/CreateJob'
import JobApplicants from './components/recruiter/JobApplicants'
import ProtectedRoute from './components/auth/ProtectedRoute'
import GoogleCallback from './components/auth/GoogleCallback'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import BookmarksPage from './components/jobs/BookmarksPage'
import AuthRoute from './components/auth/AuthRoute'
import { DarkModeProvider } from './contexts/DarkModeContext' 
import { Provider as ReduxProvider } from 'react-redux' 
import store from './redux/store' 

function AppContent() {
  const dispatch = useDispatch();
  useGetAllJobs();
  
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const Layout = () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="mt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );

  const MinimalLayout = () => (
    <>
      <Navbar />
      <main className="mt-16">
        <Outlet />
      </main>
    </>
  );

  const appRouter = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          element: <AuthRoute />,
          children: [
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <Signup /> },
            { path: "/forgot-password", element: <ForgotPassword/> },
            { path: "/reset-password/:token", element: <ResetPassword/> }
          ]
        },
        {
          path: '/jobs',
          element: <Jobs />
        },
        {
          element: <ProtectedRoute />,
          children: [
            { path: '/profile', element: <Profile /> },
            { path: '/bookmarks', element: <BookmarksPage/> },
          ]
        },
        {
          element: <ProtectedRoute allowedRoles={["recruiter"]} />,
          children: [
            { path: "/recruiter/companies", element: <Companies /> },
            { path: "/recruiter/createcompany", element: <CreateCompany /> },
            { path: "/recruiter/company/:id", element: <CompanySetup /> },
            { path: "/recruiter/jobs", element: <RecruiterJobs /> },
            { path: "/recruiter/createjob", element: <CreateJob /> },
            { path: "/recruiter/job/:id", element: <CreateJob /> },
            { path: "/recruiter/:jobId/applicants", element: <JobApplicants /> },
          ],
        },
      ]
    },
    {
      element: <MinimalLayout />,
      children: [
        { path: '/jobdescription/:id', element: <JobsDescription /> },
        { path: "/auth/google/callback", element: <GoogleCallback /> }
      ],
    },
  ]);

  return <RouterProvider router={appRouter} />;
}

// Main App wrapper with all providers
export default function App() {
  return (
    <ReduxProvider store={store}>
      <DarkModeProvider>
        <AppContent />
      </DarkModeProvider>
    </ReduxProvider>
  );
}