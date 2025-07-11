import Sidebar from "../components/SideBar";
import ChartCard from "../components/ChartCard";
import CoinCard from "../components/CoinCard";
import { useAuth } from "../context/AuthContext";
import AddCoinModal from "../components/AddCoinModal";
import PieChartCard from "../components/PieChartCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { getPortfolio, deleteCoin } from "../services/portfolio";

const Dashboard = () => {
  const { auth } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoin, setEditingCoin] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getPortfolio();
      const ids = res.data.map((item) => item.coinId).join(",");

      const priceRes = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: "usd",
            ids,
            sparkline: true,
          },
        }
      );

      const enriched = res.data.map((item) => {
        const coinData = priceRes.data.find((c) => c.id === item.coinId);
        const sparkline = coinData?.sparkline_in_7d?.price.map((price, index) => ({
          time: index,
          price,
        })) || [];

        const usd = coinData?.current_price || 0;
        const value = item.amount * usd;

        return {
          ...item,
          usd,
          image: coinData?.image || "",
          sparkline,
          value,
        };
      });

      const total = enriched.reduce((acc, coin) => acc + coin.value, 0);

      const hours = 168;
      const combinedHistory = [];
      for (let i = 0; i < hours; i++) {
        let totalAtHour = 0;
        enriched.forEach((coin) => {
          if (coin.sparkline[i]) {
            totalAtHour += coin.sparkline[i].price * coin.amount;
          }
        });
        combinedHistory.push({ time: i, total: +totalAtHour.toFixed(2) });
      }

      setPortfolio(enriched);
      setPortfolioHistory(combinedHistory);
      setTotalValue(total);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  const refreshPortfolio = () => {
    fetchData();
  };

  const handleEditCoin = (coin) => {
    setEditingCoin(coin);
    setShowModal(true);
  };

  const handleDeleteCoin = async (id) => {
    if (confirm("Are you sure you want to delete this coin?")) {
      await deleteCoin(id);
      refreshPortfolio();
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
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
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)}/>
      </div>

        <main className="flex-1 p-4 sm:p-6 bg-dark text-text">
        <h1 className="text-xl font-bold mb-6">
          Welcome back, {auth?.user?.email}
        </h1>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          <div className="bg-card p-4 rounded shadow-md w-full">
            <ChartCard portfolioHistory={portfolioHistory} />
          </div>

          <div className="bg-card p-4 rounded shadow-md w-full">
            <PieChartCard data={portfolio} />
          </div>

          <div className="bg-card p-4 rounded shadow-md w-full flex flex-col justify-center items-center text-center">
            <h2 className="text-lg mb-2">Total Portfolio Value</h2>
            <p className="text-3xl font-semibold text-primary">
              ${totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Add Coin Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            ➕ Add Coin
          </button>

          {showModal && (
            <AddCoinModal
              onClose={() => {
                setShowModal(false);
                setEditingCoin(null);
              }}
              onSuccess={refreshPortfolio}
              fetchData={fetchData}
              coin={editingCoin}
            />
          )}
        </div>

        {/* Portfolio Coins */}
        <h2 className="text-xl font-bold my-4">Top Holdings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.slice(0, 3).map((coin) => (
            <CoinCard
              key={coin._id}
              coin={coin}
              sparkline={coin.sparkline}
              onEdit={handleEditCoin}
              onDelete={handleDeleteCoin}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
