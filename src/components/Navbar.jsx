import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, handleLogout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/80 border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all">
          <span className="text-white font-bold text-lg leading-none tracking-tighter">L</span>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent tracking-tight">LifeGraph</h1>
      </Link>

      <div className="flex gap-6 items-center">
        {/* user links */}
        {user?.role === "user" && (
          <div className="hidden md:flex gap-6">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link to="/logs" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              My Logs
            </Link>
          </div>
        )}

        {/* admin links */}
        {user?.role === "admin" && (
          <div className="hidden md:flex gap-6">
            <Link to="/admin" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link
              to="/admin/institutions"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Institutions
            </Link>
            <Link
              to="/admin/simulator"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Simulator
            </Link>
            <Link
              to="/admin/logs"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Logs
            </Link>
          </div>
        )}

        {/* superadmin links */}
        {user?.role === "superadmin" && (
          <div className="hidden md:flex gap-6">
            <Link to="/admin" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Overview
            </Link>
            <Link
              to="/admin/institutions"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Institutions
            </Link>
            {/* <Link
              to="/admin/simulator"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Simulator
            </Link> */}
            <Link
              to="/admin/logs"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Logs
            </Link>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-4 pl-6 border-l border-white/10">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-neutral-200">{user.name}</span>
              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all focus:ring-2 focus:ring-indigo-500/50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
