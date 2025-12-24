import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, userRole, initializing } = useAuth();

  if (initializing) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    const dashboards = {
      0: "/employe/dashboard",
      1: "/admin/dashboard", 
      2: "/superadmin/dashboard",
    };
    return <Navigate to={dashboards[userRole] || "/"} replace />;
  }

  return children;
}