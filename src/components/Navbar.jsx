import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, handleLogout } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">LifeGraph</h1>

      <div className="flex gap-6 items-center">
        {/* user links */}
        {user?.role === "user" && (
          <>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-indigo-600"
            >
              Dashboard
            </Link>
            <Link to="/logs" className="text-gray-600 hover:text-indigo-600">
              My Logs
            </Link>
          </>
        )}

        {/* admin links */}
        {/* admin links */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin" className="text-gray-600 hover:text-indigo-600">
              Dashboard
            </Link>
            <Link
              to="/admin/institutions"
              className="text-gray-600 hover:text-indigo-600"
            >
              Institutions
            </Link>
            <Link
              to="/admin/simulator"
              className="text-gray-600 hover:text-indigo-600"
            >
              Simulator
            </Link>
            <Link
              to="/admin/logs"
              className="text-gray-600 hover:text-indigo-600"
            >
              Logs
            </Link>
          </>
        )}

        {/* superadmin links */}
        {user?.role === "superadmin" && (
          <>
            <Link to="/admin" className="text-gray-600 hover:text-indigo-600">
              Overview
            </Link>
            <Link
              to="/admin/institutions"
              className="text-gray-600 hover:text-indigo-600"
            >
              Institutions
            </Link>
            <Link
              to="/admin/simulator"
              className="text-gray-600 hover:text-indigo-600"
            >
              Simulator
            </Link>
            <Link
              to="/admin/logs"
              className="text-gray-600 hover:text-indigo-600"
            >
              Logs
            </Link>
          </>
        )}

        <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded">
          {user?.role}
        </span>
        <span className="text-sm text-gray-500">{user?.name}</span>

        <button
          onClick={handleLogout}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
