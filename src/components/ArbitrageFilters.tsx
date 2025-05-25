
import React from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedProfitability: string;
  onProfitabilityChange: (value: string) => void;
  selectedExchange: string;
  onExchangeChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const ArbitrageFilters: React.FC<FiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedProfitability,
  onProfitabilityChange,
  selectedExchange,
  onExchangeChange,
  sortBy,
  onSortChange
}) => {
  const profitabilityOptions = [
    { value: 'all', label: 'All Opportunities', icon: Star },
    { value: 'high', label: 'High Profit', icon: TrendingUp },
    { value: 'medium', label: 'Medium Profit', icon: Filter },
    { value: 'low', label: 'Low Profit', icon: TrendingDown }
  ];

  const exchanges = [
    'All', 'Binance', 'Bybit', 'OKX', 'Bitget', 'Gate.io', 'Huobi',
    'GMX', 'Hyperliquid', 'Aevo', 'dYdX', 'Kraken', 'BitMEX', 'KuCoin', 'Extended'
  ];
  
  const sortOptions = [
    { value: 'profitability', label: 'Profitability' },
    { value: 'rate', label: 'Arbitrage Profit' },
    { value: 'volume', label: 'Volume' },
    { value: 'change', label: '24h Change' }
  ];

  // Show first 6 exchanges as buttons, rest in dropdown
  const visibleExchanges = exchanges.slice(0, 6);
  const dropdownExchanges = exchanges.slice(6);

  return (
    <div className="data-card mb-8">
      <div className="flex flex-col gap-6">
        {/* Search */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search exchanges or symbols..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-dark-200/50 border-gray-600 text-white placeholder-gray-400 focus:border-neon-cyan"
            />
          </div>
        </div>

        {/* Profitability Filter */}
        <div className="w-full">
          <div className="flex flex-wrap gap-2">
            {profitabilityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={selectedProfitability === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onProfitabilityChange(option.value)}
                  className={`${
                    selectedProfitability === option.value
                      ? 'bg-gradient-to-r from-techno-500 to-neon-purple text-white'
                      : 'border-gray-600 text-gray-300 hover:border-neon-cyan hover:text-neon-cyan'
                  } transition-all duration-300`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Exchange Filter */}
        <div className="w-full">
          <div className="flex flex-wrap gap-2 items-center">
            {visibleExchanges.map((exchange) => (
              <Button
                key={exchange}
                variant={selectedExchange === exchange ? "default" : "outline"}
                size="sm"
                onClick={() => onExchangeChange(exchange)}
                className={`${
                  selectedExchange === exchange
                    ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white'
                    : 'border-gray-600 text-gray-300 hover:border-neon-cyan hover:text-neon-cyan'
                } transition-all duration-300 flex-shrink-0`}
              >
                {exchange}
              </Button>
            ))}
            
            {/* Dropdown for remaining exchanges */}
            <Select value={dropdownExchanges.includes(selectedExchange) ? selectedExchange : ""} onValueChange={onExchangeChange}>
              <SelectTrigger className="w-32 bg-dark-200/50 border-gray-600 text-white focus:border-neon-cyan">
                <SelectValue placeholder="More..." />
              </SelectTrigger>
              <SelectContent className="bg-dark-200 border-gray-600 z-50">
                {dropdownExchanges.map((exchange) => (
                  <SelectItem key={exchange} value={exchange} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    {exchange}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="w-full">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48 bg-dark-200/50 border-gray-600 text-white focus:border-neon-cyan">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="bg-dark-200 border-gray-600 z-50">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  Sort by {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ArbitrageFilters;
