import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../features/auth/authSlice";
import useAuth from "../hooks/useAuth";
import { registerAPI, registerAdminAPI, registerSuperAdminAPI } from "../services/api";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAuth();

  const [accountType, setAccountType] = useState("user");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "",
    superAdminSecret: "",
  });
  const [localError, setLocalError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

useEffect(() => {
  if (user) {
    if (user.role === "admin" || user.role === "superadmin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }
}, [user, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalLoading(true);

    try {
      if (accountType === "user") {
        // use Redux for normal user
        await dispatch(registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
        }));

      } else if (accountType === "admin") {
        // call API directly for admin
        const res = await registerAdminAPI({
          name: form.name,
          email: form.email,
          password: form.password,
          adminSecret: form.adminSecret,
        });
        // manually dispatch to set user in Redux
        dispatch({ type: "auth/register/fulfilled", payload: res.data });

      } else if (accountType === "superadmin") {
        // call API directly for superadmin
        const res = await registerSuperAdminAPI({
          name: form.name,
          email: form.email,
          password: form.password,
          superAdminSecret: form.superAdminSecret,
        });
        dispatch({ type: "auth/register/fulfilled", payload: res.data });
      }

    } catch (err) {
      setLocalError(err.response?.data?.message || "Registration failed");
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = loading || localLoading;
  const displayError = error || localError;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md relative overflow-hidden group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-10 transition duration-1000 blur-xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Create Identity
            </h2>
            <p className="text-neutral-400 text-sm mt-2">Initialize your data sovereignty node</p>
          </div>

          {/* account type selector */}
          <div className="flex gap-2 mb-8 bg-black/40 p-1.5 rounded-xl border border-white/5">
            {["user", "admin", "superadmin"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAccountType(type)}
                className={`flex-1 py-2 text-xs font-semibold tracking-wider rounded-lg uppercase transition-all duration-300 ${
                  accountType === type
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* error */}
          {displayError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5">

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="Min 8 chars, uppercase, number, symbol"
              />
            </div>

            {/* admin secret field */}
            {accountType === "admin" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Admin Secret Key
                </label>
                <input
                  type="password"
                  name="adminSecret"
                  value={form.adminSecret}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-950/50 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  placeholder="Enter admin secret key"
                />
                <p className="text-[10px] text-indigo-400/70 mt-1.5 font-medium tracking-wide">
                  CONTACT SYSTEM OWNER FOR KEY
                </p>
              </div>
            )}

            {/* superadmin secret field */}
            {accountType === "superadmin" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Super Admin Secret Key
                </label>
                <input
                  type="password"
                  name="superAdminSecret"
                  value={form.superAdminSecret}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-950/50 border border-violet-500/30 rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                  placeholder="Enter super admin secret key"
                />
                <p className="text-[10px] text-violet-400/70 mt-1.5 font-medium tracking-wide">
                  RESERVED FOR SYSTEM OWNERS ONLY
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium py-3 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all transform active:scale-[0.98]"
            >
              {isLoading ? "Initializing Node..." : `Register as ${accountType}`}
            </button>

          </form>

          <p className="text-sm text-neutral-500 mt-6 text-center">
            Already have an identity?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;