
import React, { useState, useEffect } from 'react';
import FundingRateCard from './FundingRateCard';
import FundingRateChart from './FundingRateChart';
import ArbitrageFilters from './ArbitrageFilters';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart3, DollarSign, TrendingUp } from 'lucide-react';

// Mock data generator for arbitrage opportunities
const generateArbitrageOpportunities = () => {
  const exchanges = ['Binance', 'Bybit', 'OKX', 'Bitget', 'Gate.io', 'Huobi', 'GMX', 'Hyperliquid', 'Aevo', 'dYdX', 'Kraken', 'BitMEX', 'KuCoin', 'Extended'];
  const symbols = ['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'AVAX-USDT', 'ARB-USDT', 'OP-USDT'];
  
  const opportunities = [];
  
  for (let i = 0; i < 12; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Pick two different exchanges for arbitrage
    const shuffled = [...exchanges].sort(() => 0.5 - Math.random());
    const longExchange = shuffled[0];
    const shortExchange = shuffled[1];
    
    // Generate funding rates with intentional spread for arbitrage
    const baseFundingRate = (Math.random() * 0.003 - 0.0015); // -0.15% to 0.15%
    const spread = Math.random() * 0.002 + 0.0005; // 0.05% to 0.25% spread
    
    const longRate = baseFundingRate;
    const shortRate = baseFundingRate + spread;
    
    const arbitrageProfit = Math.abs(shortRate - longRate);
    const profitability = arbitrageProfit > 0.0015 ? 'high' : arbitrageProfit > 0.0008 ? 'medium' : 'low';
    
    opportunities.push({
      id: `${longExchange}-${shortExchange}-${symbol}-${i}`,
      symbol,
      longExchange,
      shortExchange,
      longRate,
      shortRate,
      arbitrageProfit,
      profitPercentage: arbitrageProfit * 100,
      profitability,
      trend: arbitrageProfit > 0.001 ? 'up' : 'neutral',
      volume: `$${(Math.random() * 1000 + 100).toFixed(1)}M`,
      nextFunding: `${Math.floor(Math.random() * 8 + 1)}h ${Math.floor(Math.random() * 60)}m`,
      change24h: (Math.random() * 40 - 20), // -20% to 20%
    });
  }
  
  return opportunities;
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
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState(generateArbitrageOpportunities());
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
      setArbitrageOpportunities(generateArbitrageOpportunities());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setArbitrageOpportunities(generateArbitrageOpportunities());
      setIsRefreshing(false);
    }, 1000);
  };

  // Filter and sort data
  const filteredData = arbitrageOpportunities
    .filter(item => {
      const matchesSearch = item.longExchange.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.shortExchange.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProfitability = selectedProfitability === 'all' || item.profitability === selectedProfitability;
      const matchesExchange = selectedExchange === 'All' || 
                             item.longExchange === selectedExchange || 
                             item.shortExchange === selectedExchange;
      return matchesSearch && matchesProfitability && matchesExchange;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'profitability':
          const profitOrder = { high: 3, medium: 2, low: 1 };
          return profitOrder[b.profitability] - profitOrder[a.profitability];
        case 'rate':
          return b.arbitrageProfit - a.arbitrageProfit;
        case 'change':
          return Math.abs(b.change24h) - Math.abs(a.change24h);
        default:
          return 0;
      }
    });

  const selectedOpportunityData = selectedCard ? 
    arbitrageOpportunities.find(item => item.id === selectedCard) : null;

  // Calculate stats
  const totalOpportunities = filteredData.length;
  const highProfitCount = filteredData.filter(item => item.profitability === 'high').length;
  const avgProfit = filteredData.reduce((sum, item) => sum + item.arbitrageProfit, 0) / filteredData.length;

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
              <p className="text-gray-400 text-sm">Avg Profit</p>
              <p className="font-orbitron font-bold text-2xl text-white">
                {(avgProfit * 100).toFixed(4)}%
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
        {/* Arbitrage Opportunities Grid */}
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
            {selectedOpportunityData ? (
              <div className="animate-slide-up">
                <FundingRateChart
                  data={chartData}
                  exchange={`${selectedOpportunityData.longExchange} vs ${selectedOpportunityData.shortExchange}`}
                />
              </div>
            ) : (
              <div className="data-card h-96 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Select an arbitrage opportunity to view detailed charts
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
