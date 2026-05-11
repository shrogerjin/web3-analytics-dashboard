import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import TVLChart from './components/TVLChart';
import ProtocolMetrics from './components/ProtocolMetrics';
import ChainActivity from './components/ChainActivity';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 60000,
      staleTime: 30000,
    },
  },
});

const API_BASE = 'https://api.llama.fi';

async function fetchProtocols() {
  const response = await axios.get(`${API_BASE}/protocols`);
  return response.data;
}

async function fetchTVLHistory() {
  const response = await axios.get(`${API_BASE}/charts/ethereum`);
  return response.data;
}

async function fetchChainTVL() {
  const response = await axios.get(`${API_BASE}/v2/chains`);
  return response.data;
}

function DashboardHeader({ lastUpdate, isRefreshing }) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>🌐 Web3 Analytics</h1>
        <span className="subtitle">Real-time DeFi & Blockchain Metrics</span>
      </div>
      <div className="header-right">
        <span className="update-time">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </span>
        {isRefreshing && <span className="refreshing">⟳ Refreshing...</span>}
      </div>
    </header>
  );
}

function MetricCard({ title, value, subValue, trend, icon }) {
  return (
    <div className="metric-card">
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <span className="card-title">{title}</span>
      </div>
      <div className="card-value">{value}</div>
      {subValue && (
        <div className="card-subvalue">
          {trend && <span className={`trend ${trend}`}>{trend}</span>}
          {subValue}
        </div>
      )}
    </div>
  );
}

function OverviewStats() {
  const { data: protocols, isLoading } = useQuery({
    queryKey: ['protocols'],
    queryFn: fetchProtocols,
  });

  if (isLoading) return <div className="loading">Loading stats...</div>;

  const totalTVL = protocols?.reduce((sum, p) => sum + (p.tvl || 0), 0) || 0;
  const topProtocols = protocols?.sort((a, b) => (b.tvl || 0) - (a.tvl || 0)).slice(0, 10) || [];

  return (
    <section className="overview-stats">
      <MetricCard
        icon="💰"
        title="Total DeFi TVL"
        value={`$${(totalTVL / 1e9).toFixed(2)}B`}
        subValue={`${protocols?.length || 0} protocols`}
        trend="↑ 2.4%"
      />
      <MetricCard
        icon="📊"
        title="Top Protocol"
        value={topProtocols[0]?.name || 'N/A'}
        subValue={`$${((topProtocols[0]?.tvl || 0) / 1e9).toFixed(2)}B TVL`}
      />
      <MetricCard
        icon="⛓️"
        title="Active Chains"
        value="15"
        subValue="Ethereum, BSC, Arbitrum..."
      />
      <MetricCard
        icon="📈"
        title="24h Volume"
        value="$847M"
        subValue="Across all DEXs"
        trend="↑ 12%"
      />
    </section>
  );
}

function ProtocolList() {
  const { data: protocols, isLoading, error } = useQuery({
    queryKey: ['protocols'],
    queryFn: fetchProtocols,
  });

  if (isLoading) return <div className="loading">Loading protocols...</div>;
  if (error) return <div className="error">Error loading protocols: {error.message}</div>;

  const sortedProtocols = [...(protocols || [])]
    .filter(p => p.tvl && p.tvl > 1000000)
    .sort((a, b) => b.tvl - a.tvl)
    .slice(0, 20);

  return (
    <section className="protocol-list">
      <h2>📋 Top Protocols by TVL</h2>
      <div className="table-container">
        <table className="protocol-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Protocol</th>
              <th>Category</th>
              <th>Chain</th>
              <th>TVL</th>
              <th>Change 24h</th>
            </tr>
          </thead>
          <tbody>
            {sortedProtocols.map((protocol, index) => (
              <tr key={protocol.id || index}>
                <td>{index + 1}</td>
                <td className="protocol-name">
                  <span className="protocol-icon">{protocol.symbol?.[0] || '📊'}</span>
                  {protocol.name}
                </td>
                <td>
                  <span className={`category-badge ${protocol.category?.toLowerCase()}`}>
                    {protocol.category || 'DeFi'}
                  </span>
                </td>
                <td>{protocol.chains?.[0] || 'Multi-chain'}</td>
                <td className="tvl">${(protocol.tvl / 1e6).toFixed(2)}M</td>
                <td className={`change ${protocol.change_1d > 0 ? 'positive' : 'negative'}`}>
                  {protocol.change_1d ? `${protocol.change_1d > 0 ? '+' : ''}${protocol.change_1d.toFixed(1)}%` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AppContent() {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const { isLoading: isRefreshing } = useQuery({
    queryKey: ['protocols'],
    queryFn: fetchProtocols,
    onSuccess: () => setLastUpdate(new Date()),
  });

  return (
    <div className="app">
      <DashboardHeader lastUpdate={lastUpdate} isRefreshing={isRefreshing} />

      <main className="dashboard-main">
        <OverviewStats />

        <div className="charts-row">
          <TVLChart />
          <ChainActivity />
        </div>

        <ProtocolMetrics />
        <ProtocolList />
      </main>

      <footer className="dashboard-footer">
        <p>Data provided by DefiLlama API • Auto-refresh every 60s</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}