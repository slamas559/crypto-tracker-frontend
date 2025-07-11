import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartCard = ({ portfolioHistory }) => {
  if (!portfolioHistory || portfolioHistory.length === 0) {
    return <p className="text-gray-400">Loading chart...</p>;
  }

  return (
    <div className="text-white">
      <h2 className="text-lg font-semibold mb-3">Portfolio Trend (Last 7 Days)</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={portfolioHistory}>
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: "#111", borderRadius: "5px", border: "none" }} 
            labelFormatter={(label) => `Hour: ${label}`} 
            formatter={(value) => [`$${value}`, "Value"]}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#7C3AED"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartCard;


