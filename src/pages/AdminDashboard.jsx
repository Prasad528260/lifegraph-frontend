import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInstitutions, addInstitution } from "../features/institution/institutionSlice";
import { addTrustEvent } from "../features/trust/trustSlice";
import { getAllLogs } from "../features/logs/logsSlice";
import { getStats } from "../features/stats/statsSlice";
import InstitutionCard from "../components/InstitutionCard";
import LogsTable from "../components/LogsTable";
import useAuth from "../hooks/useAuth";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const { list: institutions, loading } = useSelector((state) => state.institution);
  const { list: logs } = useSelector((state) => state.logs);
  const { data: stats } = useSelector((state) => state.stats);

  const [form, setForm] = useState({ name: "", type: "", email: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(getInstitutions());
    if (isSuperAdmin) {
      dispatch(getAllLogs());
      dispatch(getStats());
    }
  }, [dispatch, isSuperAdmin]);

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

  // ── SUPERADMIN VIEW ──
  // ── SUPERADMIN VIEW ──
if (isSuperAdmin) {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">System Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          LifeGraph — Sovereign Data Trust Engine
        </p>
      </div>

      {/* stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats?.totalUsers ?? "—", icon: "👥", color: "bg-indigo-50 border-indigo-200" },
          { label: "Institutions", value: stats?.totalInstitutions ?? "—", icon: "🏛", color: "bg-blue-50 border-blue-200" },
          { label: "Access Requests", value: stats?.totalRequests ?? "—", icon: "📋", color: "bg-green-50 border-green-200" },
          { label: "Flagged", value: stats?.flaggedInstitutions ?? "—", icon: "⚠️", color: "bg-red-50 border-red-200" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg border p-5 text-center ${stat.color}`}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* access request breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Access Request Breakdown
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Granted",
              value: logs.filter((l) => l.status === "granted").length,
              color: "bg-green-100 text-green-700",
            },
            {
              label: "Partial",
              value: logs.filter((l) => l.status === "partial").length,
              color: "bg-yellow-100 text-yellow-700",
            },
            {
              label: "Denied",
              value: logs.filter((l) => l.status === "denied").length,
              color: "bg-red-100 text-red-700",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-lg p-6 text-center ${item.color}`}
            >
              <div className="text-3xl font-bold">{item.value}</div>
              <div className="text-sm font-medium mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* trust score distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Trust Score Distribution
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Tier 1 (0-40)",
              value: institutions.filter((i) => i.trustScore <= 40).length,
              color: "bg-red-100 text-red-700",
              desc: "Identity only"
            },
            {
              label: "Tier 2 (41-70)",
              value: institutions.filter((i) => i.trustScore > 40 && i.trustScore <= 70).length,
              color: "bg-yellow-100 text-yellow-700",
              desc: "Identity + Edu + Finance"
            },
            {
              label: "Tier 3 (71-100)",
              value: institutions.filter((i) => i.trustScore > 70).length,
              color: "bg-green-100 text-green-700",
              desc: "Full access"
            },
          ].map((item) => (
            <div key={item.label} className={`rounded-lg p-5 text-center ${item.color}`}>
              <div className="text-3xl font-bold">{item.value}</div>
              <div className="text-sm font-semibold mt-1">{item.label}</div>
              <div className="text-xs mt-1 opacity-75">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* most active institutions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Most Active Institutions
        </h2>
        {(() => {
          // count requests per institution
          const counts = {};
          logs.forEach((log) => {
            const name = log.institutionId?.name || "Unknown";
            counts[name] = (counts[name] || 0) + 1;
          });
          const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

          return sorted.length === 0 ? (
            <p className="text-gray-400 text-sm">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {sorted.map(([name, count]) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-40 truncate">{name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-indigo-500 h-3 rounded-full"
                      style={{
                        width: `${(count / logs.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* recent logs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Access Activity
        </h2>
        <LogsTable logs={logs.slice(0, 5)} showUser={true} />
      </div>

    </div>
  );
}

  // ── ADMIN VIEW ──
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your institutions
        </p>
      </div>

      {/* add institution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Add Institution
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
            {loading ? "Adding..." : "Add Institution"}
          </button>
        </form>
      </div>

      {/* institutions list */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Your Institutions ({institutions.length})
        </h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : institutions.length === 0 ? (
          <p className="text-gray-400">No institutions yet. Add one above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institutions.map((inst) => (
              <InstitutionCard
                key={inst._id}
                institution={inst}
                onTrustEvent={handleTrustEvent}
                showTrustEvents={false}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;