import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLogs, getUserLogs } from "../features/log/logsSlice";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import LogsTable from "../components/LogsTable";

const LogsPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isAdmin = useAdmin();
  const { list: logs, loading } = useSelector((state) => state.logs);

  useEffect(() => {
    // admin sees all logs, user sees only their own
    if (isAdmin) {
      dispatch(getAllLogs());
    } else {
      dispatch(getUserLogs(user?._id));
    }
  }, [dispatch, isAdmin, user]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent tracking-tight">
          {isAdmin ? "Global Access Ledger" : "My Access Ledger"}
        </h1>
        <p className="text-neutral-500 text-sm mt-2 font-medium flex items-center gap-2">
           <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Immutable audit trail of all data access transactions
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 background-animate"></div>
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-lg font-semibold text-white tracking-wide">
            Transaction History
          </h2>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
             <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Ledger Live</span>
          </div>
        </div>

        {loading ? (
           <div className="py-20 flex justify-center">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="text-neutral-400 text-sm font-medium tracking-wide">Decrypting Ledger...</p>
            </div>
          </div>
        ) : (
          <LogsTable logs={logs} showUser={isAdmin} />
        )}
      </div>

    </div>
  );
};

export default LogsPage;