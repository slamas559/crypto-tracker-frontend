import { useEffect, useState } from "react";
import instance from "../services/axios";
import { toast } from "react-hot-toast";
import axios from "axios";
import Sidebar from "../components/SideBar";

const AlertPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [coinId, setCoinId] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [direction, setDirection] = useState("above");
  const [coinOptions, setCoinOptions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets`,
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 100,
              page: 1,
            },
          }
        );
        setCoinOptions(data);
      } catch (err) {
        console.error("Error fetching coins", err);
      }
    };
    fetchCoins();
  }, []);

  const fetchData = async () => {
    const res = await instance.get("/alerts");
    const ids = res.data.map((item) => item.coinId).join(",");

    const priceRes = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets`,
      {
        params: {
          vs_currency: "usd",
          ids,
        },
      }
    );

    const enriched = res.data.map((item) => {
      const coinData = priceRes.data.find((c) => c.id === item.coinId);

      return {
        ...item,
        usd: coinData?.current_price || 0,
        image: coinData?.image || "",
      };
    });

    setAlerts(enriched);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coinId || !targetPrice) return;
    await instance.post("/alerts", { coinId, targetPrice, direction });
    setCoinId("");
    setTargetPrice("");
    fetchData();
    toast.success("Alert created!");
  };

  const handleDelete = async (id) => {
    await instance.delete(`/alerts/${id}`);
    fetchData();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile top bar */}
      <div className="md:hidden bg-dark p-4 flex justify-between items-center text-white">
        <h1 className="text-xl font-bold">Crypto Tracker</h1>
        <button
          className="text-white text-2xl"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 p-6 bg-dark text-white">
        <h1 className="text-2xl font-bold mb-6">Price Alerts</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-2 mb-6"
        >
          <select
            value={coinId}
            onChange={(e) => setCoinId(e.target.value)}
            className="w-full p-2 rounded bg-card text-white"
            required
          >
            <option value="">-- Select a Coin --</option>
            {coinOptions.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </option>
            ))}
          </select>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="Target Price (USD)"
            className="p-2 w-full bg-dark border border-gray-600 rounded text-white"
            required
          />
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="p-2 w-full bg-dark border border-gray-600 rounded text-white"
          >
            <option value="above">Alert when above</option>
            <option value="below">Alert when below</option>
          </select>
          <button className="bg-primary text-sm w-full px-4 py-2 rounded text-white hover:bg-purple-700">
            ➕ Create Alert
          </button>
        </form>

        <div>
          <h2 className="text-lg font-semibold mb-2">Your Alerts</h2>
          <p className="text-gray-400">
            Alert will be sent to your email when your condition is met
          </p>
          <p className="text-gray-400 mb-5">
            Manage your price alerts below:
          </p>
          <ul className="space-y-4">
            {alerts.map((alert) => (
              <li
                key={alert._id}
                className="bg-card p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 flex-wrap break-words">
                  <div className="flex items-center gap-2">
                    <img
                      src={alert.image}
                      alt={alert.coinId}
                      className="w-8 h-8 rounded"
                    />
                    <span className="font-semibold capitalize">
                      {alert.coinId}
                    </span>
                  </div>
                  <div className="text-sm text-red-400">
                    Current: ${alert.usd.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-400">
                    {alert.direction === "above" ? "Alert above" : "Alert below"}: ${alert.targetPrice.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(alert._id)}
                  className="text-red-400 hover:underline text-sm mt-2 sm:mt-0"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlertPage;
