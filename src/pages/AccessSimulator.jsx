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
    console.log("Form being submitted:", form);
    dispatch(requestAccess(form));
  };
  return (
    <div className="space-y-8">
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Access Simulator</h1>
        <p className="text-gray-500 text-sm mt-1">
          Simulate an institution requesting access to user data
        </p>
      </div>

      {/* simulator form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* institution select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Institution
            </label>
            <select
              value={form.institutionId}
              onChange={(e) =>
                setForm({ ...form, institutionId: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Choose institution...</option>
              {institutions.map((inst) => (
                <option key={inst._id} value={inst._id}>
                  {inst.name} — Score: {inst.trustScore} — Tier: {inst.tier}
                  {inst.flagged ? " ⚠️ FLAGGED" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* user id input */}
          {/* replace userId input with this */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Email
            </label>
            <input
              type="email"
              value={form.userEmail}
              onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
              placeholder="user@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* domains requested */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domains Requested
            </label>
            <div className="flex gap-4 flex-wrap">
              {DOMAINS.map((domain) => (
                <label
                  key={domain}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.requestedDomains.includes(domain)}
                    onChange={() => handleDomainToggle(domain)}
                    className="accent-indigo-600"
                  />
                  <span className="capitalize text-gray-700">{domain}</span>
                </label>
              ))}
            </div>
          </div>

          {/* request note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Note
            </label>
            <input
              type="text"
              value={form.requestNote}
              onChange={(e) =>
                setForm({ ...form, requestNote: e.target.value })
              }
              placeholder="e.g. Loan application verification"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Request Access"}
          </button>
        </form>
      </div>

      {/* error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded">{error}</div>
      )}

      {/* result */}
      {result && <AccessResult result={result} />}
    </div>
  );
};

export default AccessSimulator;
