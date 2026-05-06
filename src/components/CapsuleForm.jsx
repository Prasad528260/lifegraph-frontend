import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCapsule } from "../features/capsule/capsuleSlice";
import { getGraph } from "../features/graph/graphSlice";

const CapsuleForm = ({ existing, loading }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    identity: { name: "", dob: "", pan: "", nationality: "" },
    education: {
      ssc: { school: "", percentage: "", year: "" },
      hsc: { school: "", percentage: "", stream: "", year: "" },
      graduation: { degree: "", college: "", gpa: "", year_of_passing: "" },
      postGraduation: { degree: "", college: "", gpa: "", year_of_passing: "" },
    },
    finance: { income: "", credit_score: "", bank: "", loans: "", assets: "" },
    health: { blood_group: "", insurance: "", conditions: "" },
  });

  const [activeTab, setActiveTab] = useState("identity");
  const [success, setSuccess] = useState(false);

  // prefill form if capsule already exists
  useEffect(() => {
    if (existing) {
      setForm({
        identity: {
          name: existing.identity?.name || "",
          dob: existing.identity?.dob || "",
          pan: existing.identity?.pan || "",
          nationality: existing.identity?.nationality || "",
        },
        education: {
          ssc: {
            school: existing.education?.ssc?.school || "",
            percentage: existing.education?.ssc?.percentage || "",
            year: existing.education?.ssc?.year || "",
          },
          hsc: {
            school: existing.education?.hsc?.school || "",
            percentage: existing.education?.hsc?.percentage || "",
            stream: existing.education?.hsc?.stream || "",
            year: existing.education?.hsc?.year || "",
          },
          graduation: {
            degree: existing.education?.graduation?.degree || "",
            college: existing.education?.graduation?.college || "",
            gpa: existing.education?.graduation?.gpa || "",
            year_of_passing: existing.education?.graduation?.year_of_passing || "",
          },
          postGraduation: {
            degree: existing.education?.postGraduation?.degree || "",
            college: existing.education?.postGraduation?.college || "",
            gpa: existing.education?.postGraduation?.gpa || "",
            year_of_passing: existing.education?.postGraduation?.year_of_passing || "",
          },
        },
        finance: {
          income: existing.finance?.income || "",
          credit_score: existing.finance?.credit_score || "",
          bank: existing.finance?.bank || "",
          loans: existing.finance?.loans?.join(", ") || "",
          assets: existing.finance?.assets?.join(", ") || "",
        },
        health: {
          blood_group: existing.health?.blood_group || "",
          insurance: existing.health?.insurance || "",
          conditions: existing.health?.conditions?.join(", ") || "",
        },
      });
    }
  }, [existing]);

  const handleChange = (domain, field, value) => {
    setForm((prev) => ({
      ...prev,
      [domain]: { ...prev[domain], [field]: value },
    }));
  };

  const handleEducationChange = (level, field, value) => {
    setForm((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [level]: { ...prev.education[level], [field]: value },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      finance: {
        ...form.finance,
        loans: form.finance.loans
          ? form.finance.loans.split(",").map((s) => s.trim())
          : [],
        assets: form.finance.assets
          ? form.finance.assets.split(",").map((s) => s.trim())
          : [],
      },
      health: {
        ...form.health,
        conditions: form.health.conditions
          ? form.health.conditions.split(",").map((s) => s.trim())
          : [],
      },
    };

    await dispatch(updateCapsule(payload));
    await dispatch(getGraph());
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const tabs = ["identity", "education", "finance", "health"];

  const InputField = ({ label, type = "text", value, onChange, placeholder, max, step }) => (
    <div>
      <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        max={max}
        step={step}
        className="w-full bg-neutral-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* tabs */}
      <div className="flex gap-1 mb-6 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap flex-1 ${
              activeTab === tab
                ? "bg-white/10 text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
          {/* identity tab */}
          {activeTab === "identity" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <InputField label="Full Name" value={form.identity.name} onChange={(e) => handleChange("identity", "name", e.target.value)} />
              <InputField label="Date of Birth" type="date" value={form.identity.dob} onChange={(e) => handleChange("identity", "dob", e.target.value)} />
              <InputField label="PAN Number" value={form.identity.pan} onChange={(e) => handleChange("identity", "pan", e.target.value)} />
              <InputField label="Nationality" value={form.identity.nationality} onChange={(e) => handleChange("identity", "nationality", e.target.value)} />
            </div>
          )}

          {/* education tab */}
          {activeTab === "education" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> SSC (10th)
                </h3>
                <div className="space-y-3">
                  <InputField label="School" value={form.education.ssc.school} onChange={(e) => handleEducationChange("ssc", "school", e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Percentage" type="number" max="100" value={form.education.ssc.percentage} onChange={(e) => handleEducationChange("ssc", "percentage", e.target.value)} />
                    <InputField label="Year" type="number" placeholder="2018" value={form.education.ssc.year} onChange={(e) => handleEducationChange("ssc", "year", e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> HSC (12th)
                </h3>
                <div className="space-y-3">
                  <InputField label="School" value={form.education.hsc.school} onChange={(e) => handleEducationChange("hsc", "school", e.target.value)} />
                  <InputField label="Stream" placeholder="Science, Commerce, Arts" value={form.education.hsc.stream} onChange={(e) => handleEducationChange("hsc", "stream", e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Percentage" type="number" max="100" value={form.education.hsc.percentage} onChange={(e) => handleEducationChange("hsc", "percentage", e.target.value)} />
                    <InputField label="Year" type="number" placeholder="2020" value={form.education.hsc.year} onChange={(e) => handleEducationChange("hsc", "year", e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Graduation
                </h3>
                <div className="space-y-3">
                  <InputField label="Degree" placeholder="B.Tech, MBBS, B.Com" value={form.education.graduation.degree} onChange={(e) => handleEducationChange("graduation", "degree", e.target.value)} />
                  <InputField label="College" value={form.education.graduation.college} onChange={(e) => handleEducationChange("graduation", "college", e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="GPA" type="number" step="0.1" max="10" value={form.education.graduation.gpa} onChange={(e) => handleEducationChange("graduation", "gpa", e.target.value)} />
                    <InputField label="Passing Year" type="number" placeholder="2023" value={form.education.graduation.year_of_passing} onChange={(e) => handleEducationChange("graduation", "year_of_passing", e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Post Graduation
                </h3>
                <div className="space-y-3">
                  <InputField label="Degree" placeholder="M.Tech, MBA" value={form.education.postGraduation.degree} onChange={(e) => handleEducationChange("postGraduation", "degree", e.target.value)} />
                  <InputField label="College" value={form.education.postGraduation.college} onChange={(e) => handleEducationChange("postGraduation", "college", e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="GPA" type="number" step="0.1" max="10" value={form.education.postGraduation.gpa} onChange={(e) => handleEducationChange("postGraduation", "gpa", e.target.value)} />
                    <InputField label="Passing Year" type="number" placeholder="2025" value={form.education.postGraduation.year_of_passing} onChange={(e) => handleEducationChange("postGraduation", "year_of_passing", e.target.value)} />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* finance tab */}
          {activeTab === "finance" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <InputField label="Annual Income" type="number" value={form.finance.income} onChange={(e) => handleChange("finance", "income", e.target.value)} />
              <InputField label="Credit Score" type="number" max="900" value={form.finance.credit_score} onChange={(e) => handleChange("finance", "credit_score", e.target.value)} />
              <InputField label="Primary Bank" value={form.finance.bank} onChange={(e) => handleChange("finance", "bank", e.target.value)} />
              <InputField label="Loans (Comma separated)" placeholder="Home loan, Auto loan" value={form.finance.loans} onChange={(e) => handleChange("finance", "loans", e.target.value)} />
              <InputField label="Assets (Comma separated)" placeholder="House, Car, Stocks" value={form.finance.assets} onChange={(e) => handleChange("finance", "assets", e.target.value)} />
            </div>
          )}

          {/* health tab */}
          {activeTab === "health" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Blood Group</label>
                <select
                  value={form.health.blood_group}
                  onChange={(e) => handleChange("health", "blood_group", e.target.value)}
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 appearance-none"
                >
                  <option value="" className="bg-neutral-900">Select Type</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg} className="bg-neutral-900">{bg}</option>
                  ))}
                </select>
              </div>
              <InputField label="Insurance Provider" value={form.health.insurance} onChange={(e) => handleChange("health", "insurance", e.target.value)} />
              <InputField label="Conditions (Comma separated)" placeholder="None, Asthma" value={form.health.conditions} onChange={(e) => handleChange("health", "conditions", e.target.value)} />
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="pt-4 border-t border-white/10 mt-auto">
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2.5 rounded-lg text-xs font-medium mb-4 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Capsule Sync Successful
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/10 border border-white/10 hover:bg-white/15 text-white font-medium py-2.5 rounded-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Synchronizing...</>
            ) : "Save & Synchronize"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CapsuleForm;