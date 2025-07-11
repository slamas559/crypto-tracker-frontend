import { createContext, useContext, useEffect, useState } from "react";
// import axios from "../services/axios";
import instance from "../services/axios";
import { useNavigate } from "react-router-dom";


// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  });
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  // Check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      instance.get("/auth/me")
        .then(res => {
          setAuth({ token, user: res.data });
          setLoading(false);
        })
        .catch(() => {
          logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    instance.get("/auth/me")
      .then(res => {
        setAuth({ token, user: res.data });
        navigate("/");
        setLoading(false);
      })
      .catch(() => logout());
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
