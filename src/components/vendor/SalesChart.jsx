import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SalesChart = ({ data = [] }) => {
  // Données par défaut si aucune donnée n'est fournie
  const chartData = data.length > 0 ? data : [
    { date: 'Lun', ventes: 4, revenus: 120 },
    { date: 'Mar', ventes: 3, revenus: 90 },
    { date: 'Mer', ventes: 6, revenus: 180 },
    { date: 'Jeu', ventes: 8, revenus: 240 },
    { date: 'Ven', ventes: 5, revenus: 150 },
    { date: 'Sam', ventes: 7, revenus: 210 },
    { date: 'Dim', ventes: 9, revenus: 270 },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'revenus') return [`$${value}`, 'Revenus'];
              return [value, 'Ventes'];
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="ventes"
            stroke="#3b82f6"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Ventes"
          />
          <Line
            type="monotone"
            dataKey="revenus"
            stroke="#10b981"
            strokeWidth={2}
            name="Revenus ($)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;