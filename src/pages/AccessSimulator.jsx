import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInstitutions } from "../features/institution/institutionSlice";
import { requestAccess, clearResult } from "../features/access/accessSlice";
import AccessResult from "../components/AccessResult";

const DOMAINS = ["identity", "education", "finance", "health"];

const AccessSimulator = () => {
  const dispatch = useDispatch();
  const { list: institutions } = useSelector((state) => state.institution);
  const { result, loading, error } = useSelector((state) => state.access);

 const [form, setForm] = useState({
  institutionId: "",
  userEmail: "",        // ← changed from userId
  requestedDomains: [],
  requestNote: "",
});

  useEffect(() => {
    dispatch(getInstitutions());
    // clear previous result when page loads
    dispatch(clearResult());
  }, [dispatch]);

  const handleDomainToggle = (domain) => {
    setForm((prev) => ({
      ...prev,
      requestedDomains: prev.requestedDomains.includes(domain)
        ? prev.requestedDomains.filter((d) => d !== domain)
        : [...prev.requestedDomains, domain],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.institutionId || !form.userEmail) return;
    if (form.requestedDomains.length === 0) {
      alert("Please select at least one domain to request");
      return;
    }
    dispatch(requestAccess(form));
  };
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent tracking-tight">Access Simulation Matrix</h1>
        <p className="text-neutral-500 text-sm mt-2 font-medium">
          Test Trust Engine access control policies securely in the sandbox environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* simulator form */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden lg:col-span-1 h-fit">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <h2 className="text-lg font-semibold text-white tracking-wide mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            Simulation Parameters
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* institution select */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                Select Requesting Node
              </label>
              <select
                value={form.institutionId}
                onChange={(e) =>
                  setForm({ ...form, institutionId: e.target.value })
                }
                className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all appearance-none"
                required
              >
                <option value="" className="bg-neutral-900">Choose institution...</option>
                {institutions.map((inst) => (
                  <option key={inst._id} value={inst._id} className="bg-neutral-900">
                    {inst.name} [Score: {inst.trustScore} | Tier: {inst.tier}]
                    {inst.flagged ? " ⚠️ FLAGGED" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* user email input */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                Target Identity Email
              </label>
              <input
                type="email"
                value={form.userEmail}
                onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
                placeholder="user@example.com"
                className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                required
              />
            </div>

            {/* domains requested */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-3 uppercase tracking-wider">
                Data Vectors Requested
              </label>
              <div className="grid grid-cols-2 gap-3">
                {DOMAINS.map((domain) => (
                  <label
                    key={domain}
                    className={`flex items-center justify-center py-2.5 px-3 rounded-xl border cursor-pointer transition-all ${
                      form.requestedDomains.includes(domain)
                        ? "bg-amber-500/10 border-amber-500/50 text-amber-400"
                        : "bg-white/5 border-white/10 text-neutral-500 hover:bg-white/10"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.requestedDomains.includes(domain)}
                      onChange={() => handleDomainToggle(domain)}
                      className="hidden"
                    />
                    <span className="capitalize text-xs font-bold tracking-wide">{domain}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* request note */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                Justification Note
              </label>
              <input
                type="text"
                value={form.requestNote}
                onChange={(e) =>
                  setForm({ ...form, requestNote: e.target.value })
                }
                placeholder="e.g. Loan application verification"
                className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-3 rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:shadow-none transition-all flex justify-center items-center gap-2"
            >
              {loading ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : "Execute Simulation"}
            </button>
          </form>
        </div>

        {/* output area */}
        <div className="lg:col-span-2 space-y-6">
          {/* error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl text-sm flex items-start gap-3 animate-in fade-in zoom-in-95">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <div>
                <p className="font-bold mb-1">Simulation Error</p>
                <p className="opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* result */}
          {result ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <AccessResult result={result} />
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl h-[500px] flex items-center justify-center border-dashed border-2 border-white/5 bg-transparent">
              <div className="text-center">
                <svg className="w-12 h-12 text-neutral-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                <p className="text-neutral-500 font-medium">Awaiting Simulation Parameters...</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AccessSimulator;
