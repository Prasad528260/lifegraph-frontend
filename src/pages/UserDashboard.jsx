import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCapsule, updateCapsule } from "../features/capsule/capsuleSlice";
import { getGraph } from "../features/graph/graphSlice";
import { getUserLogs } from "../features/logs/logsSlice";
import useAuth from "../hooks/useAuth";
import useGraph from "../hooks/useGraph";
import { useSelector } from "react-redux";
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

  // fetch everything when dashboard loads
  useEffect(() => {
    dispatch(getCapsule());
    dispatch(getGraph());
    dispatch(getUserLogs(user?.id));
  }, [dispatch, user]);

  return (
    <div className="space-y-8">

      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          This is your LifeGraph — your personal data universe
        </p>
      </div>

      {/* graph section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Your LifeGraph
        </h2>
        {graphLoading ? (
          <p className="text-gray-400">Loading graph...</p>
        ) : graph ? (
          <GraphView nodes={graph.nodes} edges={graph.edges} />
        ) : (
          <p className="text-gray-400">
            No graph yet. Fill your capsule below to generate it.
          </p>
        )}
      </div>

      {/* capsule form section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Your Capsule Data
        </h2>
        <CapsuleForm existing={capsule} loading={capsuleLoading} />
      </div>

      {/* recent access logs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Access Logs
        </h2>
        {logsLoading ? (
          <p className="text-gray-400">Loading logs...</p>
        ) : (
          <LogsTable logs={logs} />
        )}
      </div>

    </div>
  );
};

export default UserDashboard;