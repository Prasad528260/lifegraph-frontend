import TrustBadge from "./TrustBadge";

const TRUST_EVENTS = [
  { type: "data_breach", label: "Data Breach", color: "bg-red-500 hover:bg-red-600" },
  { type: "user_complaint", label: "User Complaint", color: "bg-orange-500 hover:bg-orange-600" },
  { type: "successful_audit", label: "Successful Audit", color: "bg-blue-500 hover:bg-blue-600" },
  { type: "compliance_pass", label: "Compliance Pass", color: "bg-green-500 hover:bg-green-600" },
];

const InstitutionCard = ({ institution, onTrustEvent, showTrustEvents = false }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-5 space-y-4">

      {/* institution info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {institution.name}
        </h3>
        <p className="text-sm text-gray-500 capitalize">
          {institution.type}
        </p>
        <p className="text-xs text-gray-400">{institution.email}</p>
      </div>

      {/* trust badge — everyone sees this */}
      <TrustBadge
        score={institution.trustScore}
        tier={institution.tier}
        flagged={institution.flagged}
      />

      {/* trust event buttons — superadmin only */}
      {showTrustEvents && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">
            Trigger Trust Event:
          </p>
          <div className="flex flex-wrap gap-2">
            {TRUST_EVENTS.map((event) => (
              <button
                key={event.type}
                onClick={() => onTrustEvent(institution._id, event.type)}
                className={`text-white text-xs px-3 py-1 rounded ${event.color} transition`}
              >
                {event.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* admin sees this instead */}
      {!showTrustEvents && (
        <p className="text-xs text-gray-400 italic">
          Trust events managed by superadmin only
        </p>
      )}

    </div>
  );
};

export default InstitutionCard;