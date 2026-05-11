import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import axios from 'axios';

const API_BASE = 'https://api.llama.fi';

async function fetchTVLHistory() {
  try {
    const response = await axios.get(`${API_BASE}/charts/ethereum`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TVL data:', error);
    return { tvl: [] };
  }
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatTVL(value) {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${(value / 1e3).toFixed(1)}K`;
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-date">{formatDate(label)}</p>
        <p className="tooltip-value">{formatTVL(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export default function TVLChart() {
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const data = await fetchTVLHistory();
      if (data?.tvl) {
        const formatted = data.tvl.slice(-30).map(item => ({
          date: item.date,
          tvl: item.tvl,
        }));
        setChartData(formatted);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="chart-container loading">
        <div className="loading-spinner"></div>
        <p>Loading TVL Chart...</p>
      </div>
    );
  }

  return (
    <div className="chart-container tvl-chart">
      <h2>📈 Ethereum TVL History</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#888"
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatTVL}
              stroke="#888"
              tick={{ fill: '#888', fontSize: 12 }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="tvl"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#tvlGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-color" style={{ background: '#6366f1' }}></span>
          Total Value Locked
        </span>
      </div>
    </div>
  );
}