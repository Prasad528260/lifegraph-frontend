import GraphView from "./GraphView";

const DOMAIN_COLORS = {
  identity: "bg-purple-100 text-purple-700",
  education: "bg-blue-100 text-blue-700",
  finance: "bg-yellow-100 text-yellow-700",
  health: "bg-red-100 text-red-700",
};

const ALL_DOMAINS = ["identity", "education", "finance", "health"];

const AccessResult = ({ result }) => {
  const { institution, access, subgraph } = result;

  const statusColors = {
    granted: "bg-green-100 text-green-700",
    partial: "bg-yellow-100 text-yellow-700",
    denied: "bg-red-100 text-red-700",
  };

  const displayRequested = access.requestedDomains?.length > 0
    ? access.requestedDomains
    : access.grantedDomains;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">

      {/* institution summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {institution.name}
          </h3>
          <p className="text-sm text-gray-500">
            Trust Score: {institution.trustScore} — Tier {institution.tier}
          </p>
        </div>
        <span className={`px-4 py-1 rounded-full text-sm font-semibold uppercase ${statusColors[access.status]}`}>
          {access.status}
        </span>
      </div>

      {/* domain comparison */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-3">
          Domain Access Comparison
        </h4>
        <div className="grid grid-cols-2 gap-4">

          {/* requested */}
          <div className="border border-gray-200 rounded p-4">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase">
              Requested
            </p>
            <div className="space-y-2">
              {ALL_DOMAINS.map((domain) => (
                <div
                  key={domain}
                  className={`flex items-center justify-between px-3 py-1 rounded text-sm ${
                    displayRequested.includes(domain)
                      ? DOMAIN_COLORS[domain]
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  <span className="capitalize">{domain}</span>
                  <span>{displayRequested.includes(domain) ? "✓" : "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* granted */}
          <div className="border border-gray-200 rounded p-4">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase">
              Granted
            </p>
            <div className="space-y-2">
              {ALL_DOMAINS.map((domain) => (
                <div
                  key={domain}
                  className={`flex items-center justify-between px-3 py-1 rounded text-sm ${
                    access.grantedDomains.includes(domain)
                      ? DOMAIN_COLORS[domain]
                      : "bg-gray-50 text-gray-400 line-through"
                  }`}
                >
                  <span className="capitalize">{domain}</span>
                  <span>{access.grantedDomains.includes(domain) ? "✓" : "✗"}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* filtered subgraph visualization */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-3">
          Filtered Subgraph — What Institution Sees
          <span className="ml-2 text-xs text-gray-400">
            ({subgraph.nodes.length} nodes, {subgraph.edges.length} edges)
          </span>
        </h4>

        {subgraph.nodes.length === 0 ? (
          <div className="flex items-center justify-center h-32 bg-red-50 rounded border border-dashed border-red-200">
            <p className="text-red-400 text-sm">
              Access denied — no data shared
            </p>
          </div>
        ) : (
          <GraphView
            nodes={subgraph.nodes}
            edges={subgraph.edges}
          />
        )}
      </div>

    </div>
  );
};

export default AccessResult;