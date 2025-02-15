import { useEffect, useState } from 'react'
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


function App() {
  const dispatch = useDispatch();
  useGetAllJobs();
  useEffect(() => {
    dispatch(fetchUser());

  }, [dispatch]);


  const Layout = () => (
    <div className="min-h-screen flex flex-col">

      <Navbar /> {/* Fixed Navbar */}

      <main className="mt-16"> {/* Adjust the top margin dynamically */}
        <Outlet /> {/* Renders the current route's component */}
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
          path: '/login',
          element: <Login /> 
        },
        {
          path: '/signup',
          element: <ProtectedRoute allowedRoles={[]}> <Signup />  </ProtectedRoute>
        },
        {
          path: '/jobs',
          element: <Jobs />
        },
        {
          path: '/profile',
          element: <ProtectedRoute> <Profile /> </ProtectedRoute>
        },

        // Recruiter Protected Routes
        {
          element: <ProtectedRoute allowedRoles={["recruiter"]} />, // Only recruiters
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
        {
          path: '/jobdescription/:id',
          element: <JobsDescription />,
        },
      ],
    },

  ])

  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
