
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  const location = useLocation();

  // =========================
  // Checking Authentication
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // Not Logged In
  // =========================
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // =========================
  // Role Protection
  // =========================
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // =========================
  // Authorized
  // =========================
  return <Outlet />;
};

export default ProtectedRoute;
