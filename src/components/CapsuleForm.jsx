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

  // for flat fields like identity, finance, health
  const handleChange = (domain, field, value) => {
    setForm((prev) => ({
      ...prev,
      [domain]: { ...prev[domain], [field]: value },
    }));
  };

  // for nested education fields like ssc, hsc, graduation
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

  return (
    <div>
      {/* tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* identity tab */}
        {activeTab === "identity" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={form.identity.name}
                onChange={(e) => handleChange("identity", "name", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
              <input
                type="date"
                value={form.identity.dob}
                onChange={(e) => handleChange("identity", "dob", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">PAN Number</label>
              <input
                type="text"
                value={form.identity.pan}
                onChange={(e) => handleChange("identity", "pan", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nationality</label>
              <input
                type="text"
                value={form.identity.nationality}
                onChange={(e) => handleChange("identity", "nationality", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* education tab */}
        {activeTab === "education" && (
          <div className="space-y-8">

            {/* SSC */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b">
                SSC (10th)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">School</label>
                  <input
                    type="text"
                    value={form.education.ssc.school}
                    onChange={(e) => handleEducationChange("ssc", "school", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Percentage</label>
                  <input
                    type="number"
                    value={form.education.ssc.percentage}
                    onChange={(e) => handleEducationChange("ssc", "percentage", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Year</label>
                  <input
                    type="number"
                    value={form.education.ssc.year}
                    onChange={(e) => handleEducationChange("ssc", "year", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="2018"
                  />
                </div>
              </div>
            </div>

            {/* HSC */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b">
                HSC (12th)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">School</label>
                  <input
                    type="text"
                    value={form.education.hsc.school}
                    onChange={(e) => handleEducationChange("hsc", "school", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stream</label>
                  <input
                    type="text"
                    value={form.education.hsc.stream}
                    onChange={(e) => handleEducationChange("hsc", "stream", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Science, Commerce, Arts"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Percentage</label>
                  <input
                    type="number"
                    value={form.education.hsc.percentage}
                    onChange={(e) => handleEducationChange("hsc", "percentage", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Year</label>
                  <input
                    type="number"
                    value={form.education.hsc.year}
                    onChange={(e) => handleEducationChange("hsc", "year", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="2020"
                  />
                </div>
              </div>
            </div>

            {/* Graduation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b">
                Graduation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Degree</label>
                  <input
                    type="text"
                    value={form.education.graduation.degree}
                    onChange={(e) => handleEducationChange("graduation", "degree", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="B.Tech, MBBS, B.Com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">College</label>
                  <input
                    type="text"
                    value={form.education.graduation.college}
                    onChange={(e) => handleEducationChange("graduation", "college", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">GPA</label>
                  <input
                    type="number"
                    value={form.education.graduation.gpa}
                    onChange={(e) => handleEducationChange("graduation", "gpa", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    step="0.1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Year of Passing</label>
                  <input
                    type="number"
                    value={form.education.graduation.year_of_passing}
                    onChange={(e) => handleEducationChange("graduation", "year_of_passing", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="2023"
                  />
                </div>
              </div>
            </div>

            {/* Post Graduation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b">
                Post Graduation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Degree</label>
                  <input
                    type="text"
                    value={form.education.postGraduation.degree}
                    onChange={(e) => handleEducationChange("postGraduation", "degree", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="M.Tech, MBA, M.Sc"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">College</label>
                  <input
                    type="text"
                    value={form.education.postGraduation.college}
                    onChange={(e) => handleEducationChange("postGraduation", "college", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">GPA</label>
                  <input
                    type="number"
                    value={form.education.postGraduation.gpa}
                    onChange={(e) => handleEducationChange("postGraduation", "gpa", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    step="0.1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Year of Passing</label>
                  <input
                    type="number"
                    value={form.education.postGraduation.year_of_passing}
                    onChange={(e) => handleEducationChange("postGraduation", "year_of_passing", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="2025"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* finance tab */}
        {activeTab === "finance" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Annual Income</label>
              <input
                type="number"
                value={form.finance.income}
                onChange={(e) => handleChange("finance", "income", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Credit Score</label>
              <input
                type="number"
                value={form.finance.credit_score}
                onChange={(e) => handleChange("finance", "credit_score", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                max="900"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Bank</label>
              <input
                type="text"
                value={form.finance.bank}
                onChange={(e) => handleChange("finance", "bank", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Loans (comma separated)
              </label>
              <input
                type="text"
                value={form.finance.loans}
                onChange={(e) => handleChange("finance", "loans", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="home loan, car loan"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Assets (comma separated)
              </label>
              <input
                type="text"
                value={form.finance.assets}
                onChange={(e) => handleChange("finance", "assets", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="house, car"
              />
            </div>
          </div>
        )}

        {/* health tab */}
        {activeTab === "health" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Blood Group</label>
              <select
                value={form.health.blood_group}
                onChange={(e) => handleChange("health", "blood_group", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Insurance</label>
              <input
                type="text"
                value={form.health.insurance}
                onChange={(e) => handleChange("health", "insurance", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Conditions (comma separated)
              </label>
              <input
                type="text"
                value={form.health.conditions}
                onChange={(e) => handleChange("health", "conditions", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="diabetes, hypertension or none"
              />
            </div>
          </div>
        )}

        {/* success message */}
        {success && (
          <div className="bg-green-50 text-green-600 px-4 py-2 rounded text-sm">
            Capsule updated and graph regenerated successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Capsule"}
        </button>

      </form>
    </div>
  );
};

export default CapsuleForm;