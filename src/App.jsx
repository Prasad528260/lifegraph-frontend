import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AccessSimulator from "./pages/AccessSimulator";
import LogsPage from "./pages/LogsPage";
import InstitutionsPage from "./pages/InstitutionsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes — no auth needed */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* user protected routes */}
        {/* user only routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/logs" element={<LogsPage />} />
          </Route>
        </Route>

        {/* admin + superadmin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/institutions" element={<InstitutionsPage />} /> 
            <Route path="/admin/simulator" element={<AccessSimulator />} />
            <Route path="/admin/logs" element={<LogsPage />} />
          </Route>
        </Route>
        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
