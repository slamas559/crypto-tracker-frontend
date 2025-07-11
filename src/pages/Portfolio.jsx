import { useEffect, useState } from "react";
import CoinCard from "../components/CoinCard";
import AddCoinModal from "../components/AddCoinModal";
import Sidebar from "../components/SideBar";
import {
  getPortfolio,
  addCoin,
  updateCoin,
  deleteCoin,
} from "../services/portfolio";
import axios from "axios";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCoin, setEditingCoin] = useState(null);
  const [coinOptions, setCoinOptions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  


  useEffect(() => {
    fetchData();
    fetchCoins();
  }, []);


  const fetchData = async () => {
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

      return {
        ...item,
        usd: coinData?.current_price || 0,
        image: coinData?.image || "",
        sparkline,
      };
    });

    setPortfolio(enriched);
  };

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

  const refreshPortfolio = () => {
    fetchData();
  };
  

  
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!coinId || !amount) return;
    await addCoin({ coinId, amount });
    setCoinId("");
    setAmount("");
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
    <div className="flex-1 p-6 bg-dark text-white">
      <h2 className="text-2xl font-bold mb-4">My Portfolio</h2>

      <form onSubmit={handleAdd} className="flex max-w-md gap-2 mb-6">
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
          placeholder="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-dark border border-gray-600 rounded p-2 w-32"
        />
        <button type="submit" className="bg-primary px-4 rounded text-white">
          Add
        </button>
      </form>


    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {portfolio.map((coin) => (
        <CoinCard
          key={coin._id}
          coin={coin}
          sparkline={coin.sparkline}
          onEdit={handleEditCoin}
          onDelete={handleDeleteCoin}
        />
      ))}
    </div>
    {showModal && (
      <AddCoinModal
        onClose={() => {
          setShowModal(false)
          setEditingCoin(null)}
        }
        onSuccess={refreshPortfolio}
        fetchData={fetchData}
        coin = {editingCoin}
      />
    )}
      <div className="mt-6">
        {portfolio.length === 0 && (
          <p className="text-gray-400">Your portfolio is empty.</p>
        )}
      </div>
    </div>
    </div>

  );
};

export default Portfolio;
