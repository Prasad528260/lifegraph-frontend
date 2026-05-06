// reusable component — shows trust score + tier visually
// used inside InstitutionCard

const TrustBadge = ({ score, tier, flagged }) => {

  // color changes based on score
  const getScoreColor = (score) => {
    if (score <= 40) return { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400", dot: "bg-rose-500", glow: "shadow-[0_0_10px_rgba(244,63,94,0.3)]" };
    if (score <= 70) return { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-500", glow: "shadow-[0_0_10px_rgba(245,158,11,0.3)]" };
    return { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-500", glow: "shadow-[0_0_10px_rgba(16,185,129,0.3)]" };
  };

  const getTierLabel = (tier) => {
    const labels = {
      1: { label: "Tier 1 — Identity Only", color: "bg-white/5 border border-white/10 text-neutral-400" },
      2: { label: "Tier 2 — Identity + Edu + Finance", color: "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400" },
      3: { label: "Tier 3 — Full Access", color: "bg-violet-500/10 border border-violet-500/20 text-violet-400" },
    };
    return labels[tier] || labels[1];
  };

  const colors = getScoreColor(score);
  const tierInfo = getTierLabel(tier);

  return (
    <div className="flex flex-col items-start gap-2.5">

      {/* trust score */}
      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${colors.bg} ${colors.border} ${colors.glow}`}>
        <span className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`}></span>
        <span className={`text-[11px] font-bold tracking-widest uppercase ${colors.text}`}>Trust Score: {score}/100</span>
      </div>

      {/* tier */}
      <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase ${tierInfo.color}`}>
        {tierInfo.label}
      </div>

      {/* flagged warning */}
      {flagged && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          System Flagged
        </div>
      )}

    </div>
  );
};

export default TrustBadge;