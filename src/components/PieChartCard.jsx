import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#7C3AED", "#9333EA", "#6B21A8", "#4C1D95", "#C084FC", "#A78BFA"];

const PieChartCard = ({ data }) => {
  const pieData = data.map((coin) => ({
    name: coin.coinId.toUpperCase(),
    value: coin.amount * coin.usd,
  }));

  return (
    <div className="text-white">
      <h2 className="text-lg font-semibold mb-3">Portfolio Distribution</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
            contentStyle={{ backgroundColor: "#111", border: "none", borderRadius: "5px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartCard;
