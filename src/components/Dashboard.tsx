
import React, { useState, useEffect } from 'react';
import FundingRateCard from './FundingRateCard';
import FundingRateChart from './FundingRateChart';
import ArbitrageFilters from './ArbitrageFilters';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart3, DollarSign, TrendingUp } from 'lucide-react';

// Mock data generator
const generateMockData = () => {
  const exchanges = ['Binance', 'Bybit', 'OKX', 'Bitget', 'Gate.io', 'Huobi'];
  const symbols = ['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'AVAX-USDT'];
  
  return exchanges.flatMap(exchange => 
    symbols.map(symbol => ({
      id: `${exchange}-${symbol}`,
      exchange,
      symbol,
      rate: (Math.random() * 0.002 - 0.001), // -0.1% to 0.1%
      change24h: (Math.random() * 20 - 10), // -10% to 10%
      profitability: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      trend: ['up', 'down', 'neutral'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'neutral',
      volume: `$${(Math.random() * 1000 + 100).toFixed(1)}M`,
      nextFunding: `${Math.floor(Math.random() * 8 + 1)}h ${Math.floor(Math.random() * 60)}m`,
    }))
  );
};

const generateChartData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      rate: Math.random() * 0.002 - 0.001,
      volume: Math.random() * 1000 + 500,
    });
  }
  return data;
};

const Dashboard: React.FC = () => {
  const [fundingRates, setFundingRates] = useState(generateMockData());
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [chartData] = useState(generateChartData());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfitability, setSelectedProfitability] = useState('all');
  const [selectedExchange, setSelectedExchange] = useState('All');
  const [sortBy, setSortBy] = useState('profitability');

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFundingRates(generateMockData());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setFundingRates(generateMockData());
      setIsRefreshing(false);
    }, 1000);
  };

  // Filter and sort data
  const filteredData = fundingRates
    .filter(item => {
      const matchesSearch = item.exchange.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProfitability = selectedProfitability === 'all' || item.profitability === selectedProfitability;
      const matchesExchange = selectedExchange === 'All' || item.exchange === selectedExchange;
      return matchesSearch && matchesProfitability && matchesExchange;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'profitability':
          const profitOrder = { high: 3, medium: 2, low: 1 };
          return profitOrder[b.profitability] - profitOrder[a.profitability];
        case 'rate':
          return Math.abs(b.rate) - Math.abs(a.rate);
        case 'change':
          return Math.abs(b.change24h) - Math.abs(a.change24h);
        default:
          return 0;
      }
    });

  const selectedExchangeData = selectedCard ? 
    fundingRates.find(item => item.id === selectedCard) : null;

  // Calculate stats
  const totalOpportunities = filteredData.length;
  const highProfitCount = filteredData.filter(item => item.profitability === 'high').length;
  const avgRate = filteredData.reduce((sum, item) => sum + Math.abs(item.rate), 0) / filteredData.length;

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="font-orbitron font-bold text-4xl bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Funding Rate Arbitrage
          </h1>
          <p className="text-gray-400 mt-2">
            Ultra-futuristic interface for funding rate opportunities
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-gradient-to-r from-techno-500 to-neon-purple hover:from-techno-600 hover:to-neon-purple/80 transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="data-card">
          <div className="flex items-center">
            <div className="p-3 bg-neon-cyan/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-neon-cyan" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Total Opportunities</p>
              <p className="font-orbitron font-bold text-2xl text-white">{totalOpportunities}</p>
            </div>
          </div>
        </div>
        
        <div className="data-card">
          <div className="flex items-center">
            <div className="p-3 bg-neon-green/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-neon-green" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">High Profit Ops</p>
              <p className="font-orbitron font-bold text-2xl text-neon-green">{highProfitCount}</p>
            </div>
          </div>
        </div>
        
        <div className="data-card">
          <div className="flex items-center">
            <div className="p-3 bg-neon-purple/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-neon-purple" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Avg Rate</p>
              <p className="font-orbitron font-bold text-2xl text-white">
                {(avgRate * 100).toFixed(4)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ArbitrageFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedProfitability={selectedProfitability}
        onProfitabilityChange={setSelectedProfitability}
        selectedExchange={selectedExchange}
        onExchangeChange={setSelectedExchange}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Funding Rates Grid */}
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredData.map((item) => (
              <div key={item.id} className="animate-fade-in">
                <FundingRateCard
                  data={item}
                  onClick={() => setSelectedCard(selectedCard === item.id ? null : item.id)}
                  isHighlighted={selectedCard === item.id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Chart Panel */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            {selectedExchangeData ? (
              <div className="animate-slide-up">
                <FundingRateChart
                  data={chartData}
                  exchange={selectedExchangeData.exchange}
                />
              </div>
            ) : (
              <div className="data-card h-96 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Select an opportunity to view detailed charts
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
