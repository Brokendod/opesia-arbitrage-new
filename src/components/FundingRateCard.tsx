
import React from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRightLeft } from 'lucide-react';

interface ArbitrageOpportunity {
  id: string;
  symbol: string;
  longExchange: string;
  shortExchange: string;
  longRate: number;
  shortRate: number;
  arbitrageProfit: number;
  profitPercentage: number;
  change24h: number;
  profitability: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'neutral';
  volume: string;
  nextFunding: string;
}

interface FundingRateCardProps {
  data: ArbitrageOpportunity;
  onClick: () => void;
  isHighlighted?: boolean;
}

const FundingRateCard: React.FC<FundingRateCardProps> = ({ 
  data, 
  onClick, 
  isHighlighted = false 
}) => {
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendClass = () => {
    switch (data.trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      default: return 'trend-neutral';
    }
  };

  const getProfitabilityGlow = () => {
    switch (data.profitability) {
      case 'high': return 'animate-glow';
      case 'medium': return 'neon-border';
      default: return '';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`data-card cursor-pointer group relative overflow-hidden ${getProfitabilityGlow()} ${
        isHighlighted ? 'ring-2 ring-neon-cyan' : ''
      }`}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-techno-500/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-orbitron font-semibold text-lg text-white">
              {data.symbol}
            </h3>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <span className="text-neon-green">{data.longExchange}</span>
              <ArrowRightLeft className="w-3 h-3 mx-2 text-gray-500" />
              <span className="text-neon-pink">{data.shortExchange}</span>
            </div>
          </div>
          <div className={getTrendClass()}>
            {getTrendIcon()}
            <span className="ml-1">{Math.abs(data.change24h).toFixed(2)}%</span>
          </div>
        </div>

        {/* Arbitrage Profit */}
        <div className="mb-4">
          <div className="flex items-baseline">
            <span className="text-2xl font-orbitron font-bold text-neon-cyan">
              {data.profitPercentage.toFixed(4)}%
            </span>
            <span className="ml-2 text-gray-400 text-sm">arbitrage profit</span>
          </div>
        </div>

        {/* Funding Rates Comparison */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-dark-200/30 rounded-lg">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Long on {data.longExchange}</p>
            <p className="text-neon-green font-medium">{(data.longRate * 100).toFixed(4)}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Short on {data.shortExchange}</p>
            <p className="text-neon-pink font-medium">{(data.shortRate * 100).toFixed(4)}%</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Volume 24h</p>
            <p className="text-white font-medium">{data.volume}</p>
          </div>
          <div>
            <p className="text-gray-400">Next Funding</p>
            <p className="text-white font-medium">{data.nextFunding}</p>
          </div>
        </div>

        {/* Profitability indicator */}
        <div className="mt-4 flex justify-between items-center">
          <div className={`profit-indicator ${
            data.profitability === 'high' 
              ? 'bg-neon-green/20 text-neon-green border-neon-green/30' 
              : data.profitability === 'medium'
              ? 'bg-neon-orange/20 text-neon-orange border-neon-orange/30'
              : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
          }`}>
            {data.profitability === 'high' ? '🔥 High Profit' : 
             data.profitability === 'medium' ? '⚡ Medium' : '📊 Low'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingRateCard;
