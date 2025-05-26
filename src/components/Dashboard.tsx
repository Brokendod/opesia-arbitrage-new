
import React, { useState, useEffect } from 'react';
import FundingRateCard from './FundingRateCard';
import FundingRateChart from './FundingRateChart';
import ArbitrageFilters from './ArbitrageFilters';
import ReferralLinks from './ReferralLinks';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RefreshCw, BarChart3, DollarSign, TrendingUp, ChevronDown, ExternalLink } from 'lucide-react';

const EXCHANGES = ['Binance', 'Bybit', 'OKX', 'Bitget', 'Gate.io', 'Huobi', 'GMX', 'Hyperliquid', 'Aevo', 'dYdX', 'Kraken', 'BitMEX', 'KuCoin', 'Extended'];
const SYMBOLS = ['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'AVAX-USDT', 'ARB-USDT', 'OP-USDT'];

const generateArbitrageOpportunities = () => {
  const opportunities = [];
  
  for (let i = 0; i < 12; i++) {
    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const shuffled = [...EXCHANGES].sort(() => 0.5 - Math.random());
    const [longExchange, shortExchange] = shuffled;
    
    const baseFundingRate = (Math.random() * 0.003 - 0.0015);
    const spread = Math.random() * 0.002 + 0.0005;
    const longRate = baseFundingRate;
    const shortRate = baseFundingRate + spread;
    const arbitrageProfit = Math.abs(shortRate - longRate);
    
    opportunities.push({
      id: `${longExchange}-${shortExchange}-${symbol}-${i}`,
      symbol,
      longExchange,
      shortExchange,
      longRate,
      shortRate,
      arbitrageProfit,
      profitPercentage: arbitrageProfit * 100,
      profitability: arbitrageProfit > 0.0015 ? 'high' : arbitrageProfit > 0.0008 ? 'medium' : 'low',
      trend: arbitrageProfit > 0.001 ? 'up' : 'neutral',
      volume: `$${(Math.random() * 1000 + 100).toFixed(1)}M`,
      nextFunding: `${Math.floor(Math.random() * 8 + 1)}h ${Math.floor(Math.random() * 60)}m`,
      change24h: (Math.random() * 40 - 20),
    });
  }
  
  return opportunities;
};

const generateChartData = () => Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  rate: Math.random() * 0.002 - 0.001,
  volume: Math.random() * 1000 + 500,
}));

const Dashboard: React.FC = () => {
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState(generateArbitrageOpportunities());
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [chartData] = useState(generateChartData());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReferralLinksOpen, setIsReferralLinksOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfitability, setSelectedProfitability] = useState('all');
  const [selectedExchange, setSelectedExchange] = useState('All');
  const [sortBy, setSortBy] = useState('profitability');

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
      const profitOrder = { high: 3, medium: 2, low: 1 };
      switch (sortBy) {
        case 'profitability':
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

  const totalOpportunities = filteredData.length;
  const highProfitCount = filteredData.filter(item => item.profitability === 'high').length;
  const calculateAPY = (spread: number) => spread * 365 * 3 * 100;
  const bestCurrentAPY = calculateAPY(Math.max(...filteredData.map(item => item.arbitrageProfit)));

  return (
    <header className="min-h-screen p-6 space-y-8">
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

      <section aria-labelledby="stats-heading">
        <h3 id="stats-heading" className="sr-only">Statistiques d'arbitrage en temps réel</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, label: 'Opportunités Totales', value: totalOpportunities, color: 'neon-cyan' },
            { icon: TrendingUp, label: 'Opportunités Haute Rentabilité', value: highProfitCount, color: 'neon-green' },
            { icon: DollarSign, label: 'Meilleur APY Actuel', value: `${bestCurrentAPY.toFixed(2)}%`, color: 'neon-purple' }
          ].map(({ icon: Icon, label, value, color }) => (
            <article key={label} className="data-card">
              <div className="flex items-center">
                <div className={`p-3 bg-${color}/20 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${color}`} aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-400 text-sm">{label}</p>
                  <p className={`font-orbitron font-bold text-2xl ${color === 'neon-green' ? 'text-neon-green' : 'text-white'}`}>
                    {value}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

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

      <main className="grid grid-cols-1 xl:grid-cols-3 gap-8">
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
  );
};

export default Dashboard;
