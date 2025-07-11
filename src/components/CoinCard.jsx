import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CoinCard = ({ coin, sparkline, onDelete, onEdit }) => {
  const totalValue = (coin.amount * coin.usd).toFixed(2);

  return (
    <div className="bg-card text-white p-4 rounded-xl shadow-lg w-full max-w-md">
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-lg capitalize font-semibold">{coin.coinId}</p>
          <p className="text-sm text-gray-400">Amount: {coin.amount}</p>
          <p className="text-sm text-primary font-medium">
            Value: ${totalValue}
          </p>
        </div>
        <img
          src={coin.image}
          alt={coin.coinId}
          className="w-8 h-8"
        />
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={sparkline}>
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip contentStyle={{ backgroundColor: "#111", borderRadius: "5px" }} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#7C3AED"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => onEdit(coin)}
          className="text-sm text-yellow-400 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(coin._id)}
          className="text-sm text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CoinCard;
