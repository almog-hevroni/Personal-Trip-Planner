import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Wrap any route that requires a valid auth token
export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  // If no token, send to login
  return token ? children : <Navigate to="/login" replace />;
}
