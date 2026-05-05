import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // both admin and superadmin can access admin routes
  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default AdminRoute;