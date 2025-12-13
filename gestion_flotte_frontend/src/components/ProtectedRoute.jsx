import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const ProtectedRoute = ({ roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;

  // non connecté → redirection vers login
  if (!user) return <Navigate to="/login" replace />;

  // Pas le bon rôle → redirection 403
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;