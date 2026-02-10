import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PublicRoute({ children }) {
  const { user, userRole, initializing } = useAuth();

  if (initializing) {
    return <LoadingSpinner />;
  }

  if (user) {
    const dashboards = {
      0: "/personnel/dashboard",
      1: "/admin/dashboard",
      2: "/superadmin/dashboard",
    };
    return <Navigate to={dashboards[userRole] || "/"} replace />;
  }

  return children;
}