
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FundingRate {
  id: string;
  exchange: string;
  symbol: string;
  rate: number;
  change24h: number;
  profitability: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'neutral';
  volume: string;
  nextFunding: string;
}

interface FundingRateCardProps {
  data: FundingRate;
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
              {data.exchange}
            </h3>
            <p className="text-gray-400 text-sm">{data.symbol}</p>
          </div>
          <div className={getTrendClass()}>
            {getTrendIcon()}
            <span className="ml-1">{Math.abs(data.change24h).toFixed(2)}%</span>
          </div>
        </div>

        {/* Funding Rate */}
        <div className="mb-4">
          <div className="flex items-baseline">
            <span className="text-2xl font-orbitron font-bold text-white">
              {(data.rate * 100).toFixed(4)}%
            </span>
            <span className="ml-2 text-gray-400 text-sm">funding rate</span>
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
