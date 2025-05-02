import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoaderIcon } from "lucide-react";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <LoaderIcon />; // Show loading state while checking auth
  }

  if (!user) {
    return <Navigate to="/login" replace />; // Redirect if not logged in
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect if role is not allowed
  }

  return <Outlet />; // Render child routes if authorized
};

export default ProtectedRoute;
