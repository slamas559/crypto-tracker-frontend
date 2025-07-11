import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div className="text-white p-6">Checking authentication...</div>;
  }
  // console.log("isAuthenticated", auth?.token);
  return auth?.token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
