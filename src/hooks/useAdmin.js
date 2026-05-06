import useAuth from "./useAuth";

const useAdmin = () => {
  const { user } = useAuth();
  return user?.role === "admin" || user?.role === "superadmin";
};

export default useAdmin;