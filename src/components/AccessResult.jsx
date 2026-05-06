import GraphView from "./GraphView";

const DOMAIN_COLORS = {
  identity: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  education: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  finance: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  health: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
};

const ALL_DOMAINS = ["identity", "education", "finance", "health"];

const AccessResult = ({ result }) => {
  const { institution, access, subgraph } = result;

  const statusColors = {
    granted: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    partial: "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    denied: "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]",
  };

  const displayRequested = access.requestedDomains?.length > 0
    ? access.requestedDomains
    : access.grantedDomains;

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-6">

      {/* institution summary */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {institution.name}
          </h3>
          <p className="text-xs font-semibold tracking-wider text-indigo-400 uppercase mt-1">
            Trust Score: {institution.trustScore} <span className="text-white/20 mx-1">|</span> Tier {institution.tier}
          </p>
        </div>
        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${statusColors[access.status]}`}>
          {access.status === 'granted' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
          {access.status === 'partial' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>}
          {access.status === 'denied' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>}
          {access.status}
        </span>
      </div>

      {/* domain comparison */}
      <div>
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
           <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
           Domain Access Vector Mapping
        </h4>
        <div className="grid grid-cols-2 gap-6">

          {/* requested */}
          <div className="bg-black/20 border border-white/5 rounded-xl p-4">
            <p className="text-[10px] font-bold text-neutral-500 mb-3 uppercase tracking-widest">
              Requested Vectors
            </p>
            <div className="space-y-2">
              {ALL_DOMAINS.map((domain) => (
                <div
                  key={domain}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    displayRequested.includes(domain)
                      ? DOMAIN_COLORS[domain]
                      : "bg-white/5 border border-transparent text-neutral-600"
                  }`}
                >
                  <span className="capitalize">{domain}</span>
                  <span>{displayRequested.includes(domain) ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> : "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* granted */}
          <div className="bg-black/20 border border-white/5 rounded-xl p-4">
            <p className="text-[10px] font-bold text-neutral-500 mb-3 uppercase tracking-widest">
              Granted Vectors
            </p>
            <div className="space-y-2">
              {ALL_DOMAINS.map((domain) => (
                <div
                  key={domain}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    access.grantedDomains.includes(domain)
                      ? DOMAIN_COLORS[domain]
                      : "bg-white/5 border border-transparent text-neutral-600 line-through opacity-50"
                  }`}
                >
                  <span className="capitalize">{domain}</span>
                  <span>{access.grantedDomains.includes(domain) ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* filtered subgraph visualization */}
      <div className="pt-4 border-t border-white/5">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center justify-between">
          <span>Filtered Subgraph View</span>
          <span className="px-2 py-1 rounded bg-white/5 text-[9px] text-neutral-500 font-medium normal-case tracking-normal">
            {subgraph.nodes.length} nodes, {subgraph.edges.length} edges
          </span>
        </h4>

        <div className="rounded-xl overflow-hidden border border-white/5 bg-black/20 h-[400px]">
          {subgraph.nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full bg-rose-500/5 text-center px-4">
              <svg className="w-12 h-12 text-rose-500/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <p className="text-rose-400/80 font-bold tracking-wide uppercase text-xs">
                Access Denied
              </p>
              <p className="text-neutral-500 text-[11px] mt-1">No data transmitted to requesting node.</p>
            </div>
          ) : (
            <GraphView
              nodes={subgraph.nodes}
              edges={subgraph.edges}
            />
          )}
        </div>
      </div>

    </div>
  );
};

export default AccessResult;