import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLogs, getUserLogs } from "../features/logs/logsSlice";
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
      dispatch(getUserLogs(user?.id));
    }
  }, [dispatch, isAdmin, user]);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {isAdmin ? "All Access Logs" : "My Access Logs"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Complete audit trail of all data access requests
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <p className="text-gray-400">Loading logs...</p>
        ) : (
          <LogsTable logs={logs} showUser={isAdmin} />
        )}
      </div>

    </div>
  );
};

export default LogsPage;