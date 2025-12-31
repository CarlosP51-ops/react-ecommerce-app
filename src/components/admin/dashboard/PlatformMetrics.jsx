import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const PlatformMetrics = ({ metrics = {} }) => {
  // Données simulées pour les graphiques
  const salesData = [
    { date: '1 Jan', ventes: 120, revenus: 2400 },
    { date: '2 Jan', ventes: 98, revenus: 2210 },
    { date: '3 Jan', ventes: 86, revenus: 2290 },
    { date: '4 Jan', ventes: 99, revenus: 2000 },
    { date: '5 Jan', ventes: 85, revenus: 2181 },
    { date: '6 Jan', ventes: 105, revenus: 2500 },
    { date: '7 Jan', ventes: 120, revenus: 2400 },
  ];

  const categoryData = [
    { name: 'Templates', ventes: 400, revenus: 2400 },
    { name: 'Plugins', ventes: 300, revenus: 1398 },
    { name: 'Graphismes', ventes: 200, revenus: 9800 },
    { name: 'Formations', ventes: 278, revenus: 3908 },
    { name: 'Ebooks', ventes: 189, revenus: 4800 },
  ];

  return (
    <div className="space-y-6">
      {/* Sales Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">Ventes journalières</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ventes"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="revenus"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">Performance par catégorie</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventes" fill="#3b82f6" name="Ventes" />
              <Bar dataKey="revenus" fill="#10b981" name="Revenus ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Panier moyen</p>
          <p className="text-2xl font-bold text-gray-900">$42.50</p>
          <p className="text-xs text-green-600">+5.2%</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Taux de rebond</p>
          <p className="text-2xl font-bold text-gray-900">32%</p>
          <p className="text-xs text-red-600">-2.1%</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Sessions moyennes</p>
          <p className="text-2xl font-bold text-gray-900">4m 22s</p>
          <p className="text-xs text-green-600">+45s</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Nouveaux clients</p>
          <p className="text-2xl font-bold text-gray-900">128</p>
          <p className="text-xs text-green-600">+18%</p>
        </div>
      </div>
    </div>
  );
};

export default PlatformMetrics;