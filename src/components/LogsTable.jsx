const STATUS_COLORS = {
  granted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  partial: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  denied: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

const LogsTable = ({ logs, showUser = false }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <p className="text-neutral-500 font-medium">No access logs recorded in the ledger.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto no-scrollbar rounded-xl border border-white/5">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead className="bg-black/40 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          <tr>
            <th className="py-4 px-5 rounded-tl-xl">Entity Node</th>
            {showUser && <th className="py-4 px-5">Target Identity</th>}
            <th className="py-4 px-5">Requested Vectors</th>
            <th className="py-4 px-5">Granted Vectors</th>
            <th className="py-4 px-5">Trust Tier</th>
            <th className="py-4 px-5">Status</th>
            <th className="py-4 px-5 rounded-tr-xl">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-black/20">
          {logs.map((log) => (
            <tr key={log._id} className="text-neutral-300 hover:bg-white/5 transition-colors group">

              <td className="py-4 px-5 font-semibold text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400 uppercase">
                    {log.institutionId?.name ? log.institutionId.name.charAt(0) : "?"}
                  </div>
                  {log.institutionId?.name || "Unknown"}
                </div>
              </td>

              {showUser && (
                <td className="py-4 px-5 text-xs text-neutral-400">
                  {log.userId?.name || log.userEmail || "Unknown"}
                </td>
              )}

              <td className="py-4 px-5">
                <div className="flex flex-wrap gap-1.5">
                  {log.requestedDomains?.map((d) => (
                    <span key={d} className="capitalize bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-neutral-400 tracking-wider">
                      {d}
                    </span>
                  ))}
                </div>
              </td>

              <td className="py-4 px-5">
                <div className="flex flex-wrap gap-1.5">
                  {log.grantedDomains?.length > 0 ? log.grantedDomains.map((d) => (
                    <span key={d} className="capitalize bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-1 rounded text-[10px] font-bold tracking-wider">
                      {d}
                    </span>
                  )) : (
                    <span className="text-neutral-600 text-xs">—</span>
                  )}
                </div>
              </td>

              <td className="py-4 px-5">
                <span className="bg-white/5 border border-white/10 text-neutral-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Tier {log.tierAtRequest}
                </span>
              </td>

              <td className="py-4 px-5">
                <span className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest ${STATUS_COLORS[log.status]}`}>
                  {log.status}
                </span>
              </td>

              <td className="py-4 px-5 text-neutral-500 text-[11px] font-medium font-mono group-hover:text-neutral-400 transition-colors">
                {new Date(log.createdAt).toLocaleString(undefined, { 
                  month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' 
                })}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTable;