import { useEffect, useState } from "react";
import instance from "../services/axios";
import Sidebar from "../components/SideBar";
import CoinCard from "../components/CoinCard";
import axios from "axios";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [coinData, setCoinData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    const res = await instance.get("/watchlist");
    setWatchlist(res.data);

    const ids = res.data.map((c) => c.coinId).join(",");
    if (!ids) return;

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

    const enriched = priceRes.data.map((c) => ({
      ...c,
      sparkline:
        c.sparkline_in_7d?.price.map((price, index) => ({
          time: index,
          price,
        })) || [],
    }));

    setCoinData(enriched);
  };

  const handleDelete = async (coinId) => {
    await instance.delete(`/watchlist/${coinId}`);
    fetchWatchlist();
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) return setSearchResults([]);

    const { data } = await axios.get("https://api.coingecko.com/api/v3/search", {
      params: { query },
    });

    const existingIds = new Set(watchlist.map((c) => c.coinId));
    const filtered = data.coins.filter((coin) => !existingIds.has(coin.id));
    setSearchResults(filtered);
  };

  const handleAddCoin = async (coinId) => {
    await instance.post("/watchlist", { coinId });
    setSearchQuery("");
    setSearchResults([]);
    fetchWatchlist();
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
      <main className="flex-1 p-6 bg-dark text-white">
        <h1 className="text-2xl font-bold mb-4">📋 My Watchlist</h1>

        {/* 🔍 Search/Add Coin */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Coin (e.g. bitcoin, solana)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-3 rounded bg-card border border-gray-700 text-white"
          />

          {searchResults.length > 0 && (
            <div className="bg-card border border-gray-600 mt-2 rounded max-h-60 overflow-y-auto">
              {searchResults.map((coin) => (
                <div
                  key={coin.id}
                  className="flex justify-between items-center p-3 border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <img src={coin.thumb} alt={coin.name} className="w-6 h-6" />
                    <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                  </div>
                  <button
                    onClick={() => handleAddCoin(coin.id)}
                    className="bg-primary text-white px-3 py-1 rounded text-sm"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🪙 Watchlist Coins */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coinData.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={{
                coinId: coin.id,
                amount: 1,
                image: coin.image,
                usd: coin.current_price,
              }}
              sparkline={coin.sparkline}
              onDelete={() => handleDelete(coin.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Watchlist;
