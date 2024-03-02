// ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isAuthenticated = !!localStorage.getItem("accessToken");

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(isAdmin ? "admin" : "user")) {
    // Redirect them to the homepage if they do not have the required role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
