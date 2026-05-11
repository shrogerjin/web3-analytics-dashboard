import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

const API_BASE = 'https://api.llama.fi';

const CATEGORY_COLORS = {
  'Dexes': '#6366f1',
  'Lending': '#22c55e',
  'Yield': '#f59e0b',
  'CDP': '#ec4899',
  'Yield Aggregator': '#8b5cf6',
  'Insurance': '#14b8a6',
  'Derivatives': '#f97316',
  'Other': '#64748b',
};

const MOCK_METRICS = [
  { name: 'Aave', tvl: 8.2, apy: 3.2, volume_24h: 145, markets: 12 },
  { name: 'Compound', tvl: 4.1, apy: 4.1, volume_24h: 89, markets: 8 },
  { name: 'MakerDAO', tvl: 5.8, apy: 2.8, volume_24h: 32, markets: 5 },
  { name: 'Uniswap', tvl: 6.5, apy: 12.0, volume_24h: 892, markets: 150 },
  { name: 'Curve', tvl: 2.8, apy: 5.5, volume_24h: 234, markets: 45 },
  { name: 'Yearn', tvl: 1.2, apy: 8.2, volume_24h: 0, markets: 20 },
  { name: 'Convex', tvl: 1.8, apy: 6.8, volume_24h: 0, markets: 30 },
];

function CustomBarTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'tvl' ? `$${entry.value}B` : `${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function MetricsCard({ protocol }) {
  return (
    <div className="metrics-card">
      <div className="metrics-header">
        <span className="protocol-name">{protocol.name}</span>
        <span className={`risk-badge ${protocol.apy > 6 ? 'high' : protocol.apy > 3 ? 'medium' : 'low'}`}>
          {protocol.apy > 6 ? 'High Yield' : protocol.apy > 3 ? 'Medium' : 'Low'}
        </span>
      </div>
      <div className="metrics-grid">
        <div className="metric">
          <span className="metric-label">TVL</span>
          <span className="metric-value">${protocol.tvl}B</span>
        </div>
        <div className="metric">
          <span className="metric-label">APY</span>
          <span className="metric-value">{protocol.apy}%</span>
        </div>
        <div className="metric">
          <span className="metric-label">24h Volume</span>
          <span className="metric-value">${protocol.volume_24h}M</span>
        </div>
        <div className="metric">
          <span className="metric-label">Markets</span>
          <span className="metric-value">{protocol.markets}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProtocolMetrics() {
  const [selectedProtocol, setSelectedProtocol] = React.useState('Aave');

  return (
    <div className="protocol-metrics">
      <h2>🏦 Protocol Performance Metrics</h2>

      <div className="metrics-tabs">
        {MOCK_METRICS.map(p => (
          <button
            key={p.name}
            className={`tab ${selectedProtocol === p.name ? 'active' : ''}`}
            onClick={() => setSelectedProtocol(p.name)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="metrics-content">
        <div className="chart-section">
          <h3>TVL Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={MOCK_METRICS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888', fontSize: 11 }} />
              <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 11 }} tickFormatter={v => `$${v}B`} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="tvl" name="TVL" fill="#6366f1" radius={[4, 4, 0, 0]}>
                {MOCK_METRICS.map((entry, index) => (
                  <Cell key={index} fill={CATEGORY_COLORS[entry.name] || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="metrics-cards">
          {MOCK_METRICS.slice(0, 4).map(p => (
            <MetricsCard key={p.name} protocol={p} />
          ))}
        </div>
      </div>
    </div>
  );
}