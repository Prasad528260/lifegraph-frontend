import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInstitutions, addInstitution } from "../features/institution/institutionSlice";
import { addTrustEvent } from "../features/trust/trustSlice";
import { getAllLogs } from "../features/log/logsSlice";
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
  if (isSuperAdmin) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent tracking-tight">System Overview</h1>
          <p className="text-neutral-500 text-sm mt-2 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            LifeGraph — Sovereign Data Trust Engine Core
          </p>
        </div>

        {/* stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Users", value: stats?.totalUsers ?? "—", icon: "👥", color: "from-indigo-500/20 to-indigo-500/5", border: "border-indigo-500/20", text: "text-indigo-400" },
            { label: "Institutions", value: stats?.totalInstitutions ?? "—", icon: "🏛", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20", text: "text-blue-400" },
            { label: "Access Requests", value: stats?.totalRequests ?? "—", icon: "📋", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400" },
            { label: "Flagged", value: stats?.flaggedInstitutions ?? "—", icon: "⚠️", color: "from-rose-500/20 to-rose-500/5", border: "border-rose-500/20", text: "text-rose-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-b ${stat.color} ${stat.border}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/5 border border-white/10 ${stat.text}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* access request breakdown */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-white tracking-wide mb-6">Access Decisions</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Granted", value: logs.filter((l) => l.status === "granted").length, color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
                { label: "Partial", value: logs.filter((l) => l.status === "partial").length, color: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
                { label: "Denied", value: logs.filter((l) => l.status === "denied").length, color: "bg-rose-500/10 text-rose-400 border border-rose-500/20" },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl p-4 text-center ${item.color}`}>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold mt-1 opacity-80">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* trust score distribution */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-white tracking-wide mb-6">Trust Tier Distribution</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Tier 1 (0-40)", value: institutions.filter((i) => i.trustScore <= 40).length, color: "bg-rose-500/10 text-rose-400 border border-rose-500/20", desc: "Identity only" },
                { label: "Tier 2 (41-70)", value: institutions.filter((i) => i.trustScore > 40 && i.trustScore <= 70).length, color: "bg-amber-500/10 text-amber-400 border border-amber-500/20", desc: "Identity+Edu+Fin" },
                { label: "Tier 3 (71+)", value: institutions.filter((i) => i.trustScore > 70).length, color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", desc: "Full access" },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl p-4 text-center flex flex-col justify-between ${item.color}`}>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-bold mt-1">{item.label}</div>
                    <div className="text-[9px] mt-1 opacity-60 leading-tight">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* recent logs */}
          <div className="glass-panel p-6 rounded-2xl lg:col-span-2 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-500"></div>
            <h2 className="text-lg font-semibold text-white tracking-wide mb-6">Recent Network Activity</h2>
            <LogsTable logs={logs.slice(0, 5)} showUser={true} />
          </div>

          {/* most active institutions */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-white tracking-wide mb-6">High Frequency Nodes</h2>
            {(() => {
              const counts = {};
              logs.forEach((log) => {
                const name = log.institutionId?.name || "Unknown";
                counts[name] = (counts[name] || 0) + 1;
              });
              const sorted = Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

              return sorted.length === 0 ? (
                <p className="text-neutral-500 text-sm italic">No activity yet.</p>
              ) : (
                <div className="space-y-4">
                  {sorted.map(([name, count]) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-white truncate pr-4">{name}</span>
                        <span className="text-xs font-bold text-indigo-400">{count} req</span>
                      </div>
                      <div className="w-full bg-neutral-900 rounded-full h-1.5">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                          style={{ width: `${(count / logs.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

      </div>
    );
  }

  // ── ADMIN VIEW ──
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent tracking-tight">Entity Administration</h1>
        <p className="text-neutral-500 text-sm mt-2 font-medium">Manage and monitor your data-access institutions.</p>
      </div>

      {/* add institution */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
        <h2 className="text-lg font-semibold text-white tracking-wide mb-6">Register New Institution</h2>

        {formError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {formError}
          </div>
        )}

        <form onSubmit={handleAddInstitution} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Entity Name"
            className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none"
          >
            <option value="" className="bg-neutral-900">Select Classification</option>
            <option value="bank" className="bg-neutral-900">Bank</option>
            <option value="hospital" className="bg-neutral-900">Hospital</option>
            <option value="university" className="bg-neutral-900">University</option>
            <option value="employer" className="bg-neutral-900">Employer</option>
            <option value="government" className="bg-neutral-900">Government</option>
          </select>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="System Contact Email"
            className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white/10 border border-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : "Initialize"}
          </button>
        </form>
      </div>

      {/* institutions list */}
      <div className="glass-panel p-6 rounded-2xl relative">
        <h2 className="text-lg font-semibold text-white tracking-wide mb-6">
          Directory ({institutions.length})
        </h2>
        {loading ? (
          <div className="py-12 flex justify-center">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : institutions.length === 0 ? (
          <p className="text-neutral-500 py-8 text-center italic">No institutions yet. Initialize one above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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