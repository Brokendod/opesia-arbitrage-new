import React, { useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [isOpen, setIsOpen] = useState(false);

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
    { value: 'rate', label: 'Spread Rate' },
    { value: 'volume', label: 'Volume' },
    { value: 'change', label: '24h Change' }
  ];

  // Show first 6 exchanges as buttons, rest in dropdown
  const visibleExchanges = exchanges.slice(0, 6);
  const dropdownExchanges = exchanges.slice(6);

  return (
    <div className="relative">
      {/* Background with animated border */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-orange/20 rounded-xl blur-sm"></div>
      <div className="relative bg-dark-100/90 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 mb-8 shadow-2xl">
        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-neon-cyan rounded-tl-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-neon-purple rounded-tr-xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-neon-orange rounded-bl-xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-neon-pink rounded-br-xl animate-pulse"></div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          {/* Header with toggle button */}
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-lg">
                  <Filter className="w-5 h-5 text-neon-cyan" />
                </div>
                <h3 className="font-orbitron font-semibold text-lg bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                  Advanced Filters
                </h3>
              </div>
              <div className="flex items-center gap-2 text-neon-cyan">
                <span className="font-orbitron text-sm">
                  {isOpen ? 'Hide' : 'Show'}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 animate-pulse" />
                ) : (
                  <ChevronDown className="w-5 h-5 animate-pulse" />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="animate-accordion-down">
            <div className="flex flex-col gap-6 mt-6">
              {/* Search */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-300 mb-2 font-orbitron">
                  Search Markets
                </label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan w-4 h-4 group-focus-within:animate-pulse" />
                  <Input
                    placeholder="Search exchanges or symbols..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-12 bg-dark-200/70 border-gray-600 text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 h-12 rounded-lg font-orbitron transition-all duration-300 hover:border-neon-cyan/50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-transparent rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Profitability Filter */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-300 mb-3 font-orbitron">
                  Profitability Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {profitabilityOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedProfitability === option.value;
                    return (
                      <Button
                        key={option.value}
                        variant="outline"
                        size="sm"
                        onClick={() => onProfitabilityChange(option.value)}
                        className={`h-12 relative overflow-hidden transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-lg shadow-neon-cyan/25'
                            : 'border-gray-600 text-gray-300 hover:border-neon-cyan/50 hover:text-neon-cyan hover:shadow-md hover:shadow-neon-cyan/10'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-green/10 animate-pulse"></div>
                        )}
                        <div className="relative flex items-center justify-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className="font-orbitron text-xs">{option.label}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Exchange Filter */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-300 mb-3 font-orbitron">
                  Exchange Selection
                </label>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {visibleExchanges.map((exchange) => {
                      const isSelected = selectedExchange === exchange;
                      return (
                        <Button
                          key={exchange}
                          variant="outline"
                          size="sm"
                          onClick={() => onExchangeChange(exchange)}
                          className={`h-10 relative overflow-hidden transition-all duration-300 flex-shrink-0 ${
                            isSelected
                              ? 'bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border-neon-purple text-neon-purple shadow-lg shadow-neon-purple/25'
                              : 'border-gray-600 text-gray-300 hover:border-neon-purple/50 hover:text-neon-purple hover:shadow-md hover:shadow-neon-purple/10'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 animate-pulse"></div>
                          )}
                          <span className="relative font-orbitron text-xs">{exchange}</span>
                        </Button>
                      );
                    })}
                  </div>
                  
                  {/* Dropdown for remaining exchanges */}
                  <div className="w-full max-w-xs">
                    <Select value={dropdownExchanges.includes(selectedExchange) ? selectedExchange : ""} onValueChange={onExchangeChange}>
                      <SelectTrigger className="bg-dark-200/70 border-gray-600 text-white focus:border-neon-purple h-10 rounded-lg font-orbitron transition-all duration-300 hover:border-neon-purple/50">
                        <SelectValue placeholder="More exchanges..." />
                        <ChevronDown className="w-4 h-4 text-neon-purple" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-200 border-gray-600 z-50">
                        {dropdownExchanges.map((exchange) => (
                          <SelectItem 
                            key={exchange} 
                            value={exchange} 
                            className="text-white hover:bg-neon-purple/20 focus:bg-neon-purple/20 font-orbitron"
                          >
                            {exchange}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-300 mb-3 font-orbitron">
                  Sort Criteria
                </label>
                <div className="w-full max-w-xs">
                  <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="bg-dark-200/70 border-gray-600 text-white focus:border-neon-orange h-12 rounded-lg font-orbitron transition-all duration-300 hover:border-neon-orange/50">
                      <SelectValue placeholder="Sort by..." />
                      <ChevronDown className="w-4 h-4 text-neon-orange" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-200 border-gray-600 z-50">
                      {sortOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value} 
                          className="text-white hover:bg-neon-orange/20 focus:bg-neon-orange/20 font-orbitron"
                        >
                          Sort by {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>
      </div>
    </div>
  );
};

export default ArbitrageFilters;
