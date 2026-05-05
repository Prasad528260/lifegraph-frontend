// reusable component — shows trust score + tier visually
// used inside InstitutionCard

const TrustBadge = ({ score, tier, flagged }) => {

  // color changes based on score
  const getScoreColor = (score) => {
    if (score <= 40) return "text-red-600 bg-red-50";
    if (score <= 70) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const getTierLabel = (tier) => {
    const labels = {
      1: { label: "Tier 1 — Identity Only", color: "bg-gray-100 text-gray-600" },
      2: { label: "Tier 2 — Identity + Edu + Finance", color: "bg-blue-100 text-blue-600" },
      3: { label: "Tier 3 — Full Access", color: "bg-green-100 text-green-600" },
    };
    return labels[tier] || labels[1];
  };

  const tierInfo = getTierLabel(tier);

  return (
    <div className="flex flex-col gap-2">

      {/* trust score */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(score)}`}>
        <span>Trust Score: {score}/100</span>
      </div>

      {/* tier */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tierInfo.color}`}>
        {tierInfo.label}
      </div>

      {/* flagged warning */}
      {flagged && (
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          ⚠️ Flagged — Data Breach
        </div>
      )}

    </div>
  );
};

export default TrustBadge;