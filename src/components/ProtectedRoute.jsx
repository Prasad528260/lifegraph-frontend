import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // admin and superadmin should not see user dashboard
  if (user.role === "admin" || user.role === "superadmin") {
    return <Navigate to="/admin" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;