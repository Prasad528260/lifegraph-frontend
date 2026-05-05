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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">

        <h2 className="text-2xl font-bold text-indigo-600 mb-6">
          Create Account
        </h2>

        {/* account type selector */}
        <div className="flex gap-2 mb-6">
          {["user", "admin", "superadmin"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAccountType(type)}
              className={`flex-1 py-2 text-sm font-medium rounded capitalize transition ${
                accountType === type
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* error */}
        {displayError && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded mb-4 text-sm">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Prasad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Min 8 chars, uppercase, number, symbol"
            />
          </div>

          {/* admin secret field */}
          {accountType === "admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Secret Key
              </label>
              <input
                type="password"
                name="adminSecret"
                value={form.adminSecret}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter admin secret key"
              />
              <p className="text-xs text-gray-400 mt-1">
                Contact system owner for admin secret key
              </p>
            </div>
          )}

          {/* superadmin secret field */}
          {accountType === "superadmin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Super Admin Secret Key
              </label>
              <input
                type="password"
                name="superAdminSecret"
                value={form.superAdminSecret}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter super admin secret key"
              />
              <p className="text-xs text-gray-400 mt-1">
                Reserved for system owners only
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : `Register as ${accountType}`}
          </button>

        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;