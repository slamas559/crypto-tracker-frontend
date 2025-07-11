import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut, FiBell, FiPieChart, FiHome, FiEye } from "react-icons/fi";

const Sidebar = ({ onClose }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const links = [
    { label: "Dashboard", path: "/", icon: <FiHome /> },
    { label: "Alerts", path: "/alerts", icon: <FiBell /> },
    { label: "Watchlist", path: "/watchlist", icon: <FiEye /> },
    { label: "Portfolio", path: "/portfolio", icon: <FiPieChart /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-full md:w-64 bg-card min-h-screen p-4">
      <div className="text-white text-2xl font-bold mb-6 text-center">📊 CryptoTrack</div>

      <ul className="space-y-3">
        {links.map(({ label, path, icon }) => (
          <li key={label}>
            <Link
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                isActive(path)
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t border-gray-700 pt-4">
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="flex items-center gap-3 px-4 py-2 w-full text-left text-gray-300 hover:bg-red-500 hover:text-white 
                    rounded-lg animate transition-colors duration-200 ease-in-out"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
