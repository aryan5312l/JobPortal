// components/auth/AuthRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = () => {
  const { user } = useSelector((state) => state.auth);
  
  // If user is logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default AuthRoute;