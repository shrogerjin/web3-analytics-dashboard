import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MOCK_CHAIN_DATA = [
  { name: 'Ethereum', tvl: 45.2, color: '#627EEA', pct: 58 },
  { name: 'BSC', tvl: 8.5, color: '#F3BA2F', pct: 11 },
  { name: 'Arbitrum', tvl: 7.2, color: '#28A0F0', pct: 9 },
  { name: 'Polygon', tvl: 4.8, color: '#8247E5', pct: 6 },
  { name: 'Optimism', tvl: 4.1, color: '#FF0420', pct: 5 },
  { name: 'Avalanche', tvl: 3.2, color: '#E84142', pct: 4 },
  { name: 'Other', tvl: 4.5, color: '#64748b', pct: 7 },
];

const MOCK_ACTIVITY_DATA = [
  { chain: 'Ethereum', txCount: 1200000, activeWallets: 45000, volume: 2.3 },
  { chain: 'BSC', txCount: 3500000, activeWallets: 28000, volume: 1.8 },
  { chain: 'Arbitrum', txCount: 800000, activeWallets: 15000, volume: 0.9 },
  { chain: 'Polygon', txCount: 600000, activeWallets: 12000, volume: 0.5 },
  { chain: 'Optimism', txCount: 400000, activeWallets: 8000, volume: 0.4 },
];

function ChainPieChart() {
  return (
    <div className="pie-chart-container">
      <h3>TVL by Chain</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={MOCK_CHAIN_DATA}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="tvl"
          >
            {MOCK_CHAIN_DATA.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `$${value}B`}
            contentStyle={{ background: '#1a1a2e', border: 'none', borderRadius: '8px' }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: '#ccc', fontSize: '12px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function ActivityBarChart() {
  return (
    <div className="bar-chart-container">
      <h3>24h Chain Activity</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={MOCK_ACTIVITY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="chain" stroke="#888" tick={{ fill: '#888', fontSize: 11 }} />
          <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#1a1a2e', border: 'none', borderRadius: '8px' }}
            formatter={(value, name) => [
              name === 'txCount' ? value.toLocaleString() : `${value}M`,
              name === 'txCount' ? 'Transactions' : 'Volume (B)'
            ]}
          />
          <Bar dataKey="txCount" name="txCount" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChainCard({ chain }) {
  return (
    <div className="chain-card" style={{ borderLeftColor: chain.color }}>
      <div className="chain-header">
        <span className="chain-name">{chain.name}</span>
        <span className="chain-pct">{chain.pct}%</span>
      </div>
      <div className="chain-tvl">${chain.tvl}B TVL</div>
      <div className="chain-bar">
        <div
          className="chain-bar-fill"
          style={{ width: `${chain.pct}%`, background: chain.color }}
        ></div>
      </div>
    </div>
  );
}

export default function ChainActivity() {
  return (
    <div className="chain-activity">
      <h2>⛓️ Chain Activity Overview</h2>

      <div className="chain-grid">
        {MOCK_CHAIN_DATA.map(chain => (
          <ChainCard key={chain.name} chain={chain} />
        ))}
      </div>

      <div className="charts-row">
        <ChainPieChart />
        <ActivityBarChart />
      </div>
    </div>
  );
}