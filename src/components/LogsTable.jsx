const STATUS_COLORS = {
  granted: "bg-green-100 text-green-700",
  partial: "bg-yellow-100 text-yellow-700",
  denied: "bg-red-100 text-red-700",
};

const LogsTable = ({ logs, showUser = false }) => {
  if (!logs || logs.length === 0) {
    return (
      <p className="text-gray-400 text-sm">No access logs found.</p>
    );
  }
  console.log(logs);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase">
            <th className="pb-3 pr-4">Institution</th>
            {showUser && <th className="pb-3 pr-4">User</th>}
            <th className="pb-3 pr-4">Requested</th>
            <th className="pb-3 pr-4">Granted</th>
            <th className="pb-3 pr-4">Tier</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {logs.map((log) => (
            <tr key={log._id} className="text-gray-700">

              <td className="py-3 pr-4 font-medium">
                {log.institutionId?.name || "Unknown"}
              </td>

              {showUser && (
                <td className="py-3 pr-4">
                  {log.userId?.name || "Unknown"}
                </td>
              )}

              <td className="py-3 pr-4">
                <div className="flex flex-wrap gap-1">
                  {log.requestedDomains?.map((d) => (
                    <span key={d} className="capitalize bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {d}
                    </span>
                  ))}
                </div>
              </td>

              <td className="py-3 pr-4">
                <div className="flex flex-wrap gap-1">
                  {log.grantedDomains?.map((d) => (
                    <span key={d} className="capitalize bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-xs">
                      {d}
                    </span>
                  ))}
                </div>
              </td>

              <td className="py-3 pr-4">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                  Tier {log.tierAtRequest}
                </span>
              </td>

              <td className="py-3 pr-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${STATUS_COLORS[log.status]}`}>
                  {log.status}
                </span>
              </td>

              <td className="py-3 text-gray-400 text-xs">
                {new Date(log.createdAt).toLocaleDateString()}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTable;