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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent tracking-tight">
          Registered Institutions
        </h1>
        <p className="text-neutral-500 text-sm mt-2 font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          {isSuperAdmin
            ? "Global network of entities within the LifeGraph Trust Engine"
            : "Your registered data-access institutions"}
        </p>
      </div>

      {/* add institution form */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
        <h2 className="text-lg font-semibold text-white tracking-wide mb-6">
          Register Network Entity
        </h2>

        {formError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
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
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : "Initialize Entity"}
          </button>
        </form>
      </div>

      {/* institutions list */}
      <div className="glass-panel p-6 rounded-2xl relative">
        <h2 className="text-lg font-semibold text-white tracking-wide mb-6">
          {isSuperAdmin ? `Network Directory (${institutions.length})` : `Your Connected Entities (${institutions.length})`}
        </h2>

        {loading ? (
          <div className="py-12 flex justify-center">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : institutions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <p className="text-neutral-500 font-medium">No institutions registered in the network yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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