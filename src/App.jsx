import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import AlertPage from "./pages/AlertPage";
import Watchlist from "./pages/Watchlist";
import instance from "./services/axios";
import { subscribeUserToPush } from "./utils/pushNotification";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY; // 👈 Use Vite env variable

function AppContent() {
  const { loading } = useAuth(); // 👈 Get loading state
  const { auth } = useAuth(); // 👈 Get auth and instance from context

  useEffect(() => {
    if (auth?.token) {
      subscribeUserToPush(VAPID_PUBLIC_KEY)
        .then((subscription) => {
          instance.post("/alerts/push-subscribe", { subscription });
        })
        .catch(console.error);
    }
  }, [auth?.token]);


  if (loading) {
    return <div className="text-white p-10">Loading...</div>; // 👈 Show loading screen
  }

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
      <Route path="/alerts" element={<PrivateRoute><AlertPage /></PrivateRoute>} />
      <Route path="/watchlist" element={<PrivateRoute><Watchlist /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent /> {/* 👈 Split to access useAuth inside AuthProvider */}
    </AuthProvider>
  );
}

export default App;
