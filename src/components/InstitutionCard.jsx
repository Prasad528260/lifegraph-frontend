import TrustBadge from "./TrustBadge";

const TRUST_EVENTS = [
  { type: "data_breach", label: "Data Breach", color: "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 hover:border-rose-500/50" },
  { type: "user_complaint", label: "User Complaint", color: "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 hover:border-amber-500/50" },
  { type: "successful_audit", label: "Successful Audit", color: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 hover:border-indigo-500/50" },
  { type: "compliance_pass", label: "Compliance Pass", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 hover:border-emerald-500/50" },
];

const InstitutionCard = ({ institution, onTrustEvent, showTrustEvents = false }) => {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-5 flex flex-col relative overflow-hidden group">
      
      {/* Background flare on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* institution info */}
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {institution.name}
          </h3>
          <p className="text-[10px] font-semibold tracking-widest text-indigo-400 uppercase mt-1.5">
            {institution.type}
          </p>
          <p className="text-sm text-neutral-400 mt-0.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            {institution.email}
          </p>
        </div>
      </div>

      {/* trust badge — everyone sees this */}
      <div className="relative z-10 py-2 border-y border-white/5">
        <TrustBadge
          score={institution.trustScore}
          tier={institution.tier}
          flagged={institution.flagged}
        />
      </div>

      {/* trust event buttons — superadmin only */}
      <div className="relative z-10 mt-auto pt-2">
        {showTrustEvents ? (
          <div>
            <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              Inject Trust Event
            </p>
            <div className="flex flex-wrap gap-2">
              {TRUST_EVENTS.map((event) => (
                <button
                  key={event.type}
                  onClick={() => onTrustEvent(institution._id, event.type)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all transform active:scale-95 ${event.color}`}
                >
                  {event.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-neutral-500 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Trust events strictly managed by network authorities
          </p>
        )}
      </div>

    </div>
  );
};

export default InstitutionCard;