
import React, { useState, useEffect } from 'react';
import FundingRateCard from './FundingRateCard';
import FundingRateChart from './FundingRateChart';
import ArbitrageFilters from './ArbitrageFilters';
import ReferralLinks from './ReferralLinks';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RefreshCw, BarChart3, DollarSign, TrendingUp, ChevronDown, ExternalLink } from 'lucide-react';

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
  const [isReferralLinksOpen, setIsReferralLinksOpen] = useState(false);
  
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
  
  // Calculate best current APY instead of spread
  const calculateAPY = (spread: number) => {
    const fundingsPerYear = 365 * 3; // 3 funding per day
    return spread * fundingsPerYear * 100;
  };
  
  const bestCurrentAPY = calculateAPY(Math.max(...filteredData.map(item => item.arbitrageProfit)));

  return (
    <>
      {/* SEO-optimized header with semantic HTML */}
      <header className="min-h-screen p-6 space-y-8">
        {/* Main heading section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="font-orbitron font-bold text-4xl bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Opesia
            </h1>
            <h2 className="text-gray-400 mt-2 font-orbitron text-lg">
              Plateforme d'Arbitrage des Taux de Financement Crypto
            </h2>
            <p className="text-gray-300 mt-1 text-sm max-w-2xl">
              Interface ultra-futuriste pour découvrir les meilleures opportunités d'arbitrage de taux de financement. 
              Maximisez vos profits avec des données en temps réel de Binance, Bybit, OKX et plus encore.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-techno-500 to-neon-purple hover:from-techno-600 hover:to-neon-purple/80 transition-all duration-300"
              aria-label="Actualiser les données d'arbitrage"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser les Données
            </Button>
          </div>
        </div>

        {/* SEO-optimized stats section */}
        <section aria-labelledby="stats-heading">
          <h3 id="stats-heading" className="sr-only">Statistiques d'arbitrage en temps réel</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="data-card" aria-labelledby="total-opportunities">
              <div className="flex items-center">
                <div className="p-3 bg-neon-cyan/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-neon-cyan" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-400 text-sm" id="total-opportunities">Opportunités Totales</p>
                  <p className="font-orbitron font-bold text-2xl text-white">{totalOpportunities}</p>
                </div>
              </div>
            </article>
            
            <article className="data-card" aria-labelledby="high-profit-ops">
              <div className="flex items-center">
                <div className="p-3 bg-neon-green/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-neon-green" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-400 text-sm" id="high-profit-ops">Opportunités Haute Rentabilité</p>
                  <p className="font-orbitron font-bold text-2xl text-neon-green">{highProfitCount}</p>
                </div>
              </div>
            </article>
            
            <article className="data-card" aria-labelledby="best-apy">
              <div className="flex items-center">
                <div className="p-3 bg-neon-purple/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-neon-purple" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-400 text-sm" id="best-apy">Meilleur APY Actuel</p>
                  <p className="font-orbitron font-bold text-2xl text-white">
                    {bestCurrentAPY.toFixed(2)}%
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Filters section */}
        <section aria-labelledby="filters-heading">
          <h3 id="filters-heading" className="sr-only">Filtres d'arbitrage avancés</h3>
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
        </section>

        {/* Main content section */}
        <main className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Arbitrage opportunities */}
          <section className="xl:col-span-2" aria-labelledby="opportunities-heading">
            <h3 id="opportunities-heading" className="sr-only">Opportunités d'arbitrage disponibles</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredData.map((item) => (
                <article key={item.id} className="animate-fade-in">
                  <FundingRateCard
                    data={item}
                    onClick={() => setSelectedCard(selectedCard === item.id ? null : item.id)}
                    isHighlighted={selectedCard === item.id}
                  />
                </article>
              ))}
            </div>
          </section>

          {/* Chart panel */}
          <aside className="xl:col-span-1" aria-labelledby="chart-heading">
            <h3 id="chart-heading" className="sr-only">Graphiques détaillés</h3>
            <div className="sticky top-6">
              {selectedOpportunityData ? (
                <div className="animate-slide-up">
                  <FundingRateChart
                    data={chartData}
                    exchange={`${selectedOpportunityData.longExchange} vs ${selectedOpportunityData.shortExchange}`}
                    opportunityData={selectedOpportunityData}
                  />
                </div>
              ) : (
                <div className="data-card h-96 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" aria-hidden="true" />
                    <p className="text-gray-400">
                      Sélectionnez une opportunité d'arbitrage pour voir les graphiques détaillés
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </main>

        {/* Referral links section */}
        <section aria-labelledby="referral-heading">
          <h3 id="referral-heading" className="sr-only">Plateformes partenaires recommandées</h3>
          <Collapsible open={isReferralLinksOpen} onOpenChange={setIsReferralLinksOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-auto p-6 bg-gradient-to-r from-dark-100/90 to-dark-200/90 border-neon-orange/30 hover:border-neon-orange/50 transition-all duration-300 group"
                aria-expanded={isReferralLinksOpen}
                aria-controls="referral-content"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-neon-orange/20 to-neon-yellow/20 rounded-xl">
                      <ExternalLink className="w-6 h-6 text-neon-orange" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-orbitron font-bold text-xl bg-gradient-to-r from-neon-orange to-neon-yellow bg-clip-text text-transparent">
                        🚀 Plateformes Recommandées
                      </h4>
                      <p className="text-gray-400 font-orbitron text-sm">
                        Accédez aux meilleures plateformes avec des bonus exclusifs
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-neon-orange transition-transform duration-300 ${isReferralLinksOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4" id="referral-content">
              <ReferralLinks />
            </CollapsibleContent>
          </Collapsible>
        </section>
      </header>
    </>
  );
};

export default Dashboard;
