import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInstitutions, addInstitution } from "../features/institution/institutionSlice";
import { addTrustEvent } from "../features/trust/trustSlice";
import InstitutionCard from "../components/InstitutionCard";
import useAuth from "../hooks/useAuth";

const InstitutionsPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";
  const { list: institutions, loading } = useSelector((state) => state.institution);

  const [form, setForm] = useState({ name: "", type: "", email: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(getInstitutions());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddInstitution = (e) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.email) {
      setFormError("All fields are required");
      return;
    }
    setFormError("");
    dispatch(addInstitution(form));
    setForm({ name: "", type: "", email: "" });
  };

  const handleTrustEvent = (institutionId, eventType) => {
    dispatch(addTrustEvent({ institutionId, eventType }));
    setTimeout(() => dispatch(getInstitutions()), 500);
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Institutions</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isSuperAdmin
            ? "All registered institutions in the system"
            : "Your registered institutions"}
        </p>
      </div>

      {/* add institution form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Register New Institution
        </h2>

        {formError && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded mb-4 text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleAddInstitution} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Institution Name"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Type</option>
            <option value="bank">Bank</option>
            <option value="hospital">Hospital</option>
            <option value="university">University</option>
            <option value="employer">Employer</option>
            <option value="government">Government</option>
          </select>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Institution Email"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-3 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Register Institution"}
          </button>
        </form>
      </div>

      {/* institutions list */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {isSuperAdmin ? `All Institutions (${institutions.length})` : `Your Institutions (${institutions.length})`}
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : institutions.length === 0 ? (
          <p className="text-gray-400">No institutions yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institutions.map((inst) => (
              <InstitutionCard
                key={inst._id}
                institution={inst}
                onTrustEvent={handleTrustEvent}
                showTrustEvents={isSuperAdmin}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default InstitutionsPage;