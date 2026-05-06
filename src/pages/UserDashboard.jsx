import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCapsule } from "../features/capsule/capsuleSlice";
import { getGraph } from "../features/graph/graphSlice";
import { getUserLogs } from "../features/logs/logsSlice";
import useAuth from "../hooks/useAuth";
import useGraph from "../hooks/useGraph";
import CapsuleForm from "../components/CapsuleForm";
import GraphView from "../components/GraphView";
import LogsTable from "../components/LogsTable";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { graph, loading: graphLoading } = useGraph();
  const { data: capsule, loading: capsuleLoading } = useSelector((state) => state.capsule);
  const { list: logs, loading: logsLoading } = useSelector((state) => state.logs);
  // console.log(user);
  // console.log(graph);
  console.log(logs)

  // fetch everything when dashboard loads
  useEffect(() => {
    dispatch(getCapsule());
    dispatch(getGraph());
    dispatch(getUserLogs(user?._id));
  }, [dispatch, user]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-neutral-500 text-sm mt-2 font-medium">
            This is your LifeGraph — your personal sovereign data universe.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area - Graph & Logs */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* graph section */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white tracking-wide">
                Your LifeGraph Node
              </h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Live</span>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-white/5 bg-black/20">
              {graphLoading ? (
                <div className="h-[500px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-neutral-500 text-sm font-medium">Initializing Graph Rendering...</p>
                  </div>
                </div>
              ) : graph ? (
                <div className="rounded-xl overflow-hidden border border-white/5 bg-black/20 h-[500px] w-full">
                <GraphView nodes={graph.nodes} edges={graph.edges} />
                </div>
              ) : (
                <div className="h-[500px] flex items-center justify-center">
                  <p className="text-neutral-500 font-medium bg-white/5 px-6 py-3 rounded-full border border-white/5">
                    No graph data yet. Fill your capsule to generate it.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* recent access logs */}
          <div className="glass-panel p-6 rounded-2xl relative">
            <h2 className="text-lg font-semibold text-white tracking-wide mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Recent Access Activity
            </h2>
            
            {logsLoading ? (
              <div className="py-12 flex justify-center">
                 <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </div>
            ) : (
              <LogsTable logs={logs} />
            )}
          </div>

        </div>

        {/* Sidebar - Capsule Form */}
        <div className="xl:col-span-1">
          <div className="glass-panel p-6 rounded-2xl sticky top-28">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Data Capsule
              </h2>
            </div>
            <CapsuleForm existing={capsule} loading={capsuleLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;