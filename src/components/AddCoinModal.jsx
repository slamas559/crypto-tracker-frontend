import { useEffect, useState } from "react";
import { addCoin, updateCoin } from "../services/portfolio";
import instance from "../services/axios";
import axios from "axios";

const AddCoinModal = ({ onClose, onSuccess, coin }) => {
  const [amount, setAmount] = useState(coin?.amount || "");
  const [coinId, setCoinId] = useState(coin?.coinId || "");
  const [coinOptions, setCoinOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch top 100 coins
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coinId || !amount) return;

    setLoading(true);
    try {
      if (coin) {
        await updateCoin(coin._id, { amount });
      } else {
        await addCoin({ coinId, amount });
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error saving coin");
    } finally {
      setLoading(false);
    }
  };

  return (
    // a transparent black overlay for the modal
    <div className="fixed inset-0  bg-black/70 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-dark p-6 rounded-lg w-full max-w-md text-white space-y-4"
      >
        <h2 className="text-xl font-bold">{coin ? "Edit Coin" : "Add Coin"}</h2>

        {!coin && (
          <div>
            <label className="block mb-1 text-sm text-gray-300">Select Coin</label>
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
          </div>
        )}

        <div>
          <label className="block mb-1 text-sm text-gray-300">Amount</label>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-card text-white"
            required
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-purple-700 px-4 py-2 rounded text-white"
          >
            {loading ? "Saving..." : coin ? "Update" : "Add Coin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoinModal;
