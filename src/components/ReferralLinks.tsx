
import React from 'react';
import { ExternalLink, Star, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReferralPlatform {
  name: string;
  url: string;
  logo?: string;
  category: 'cex' | 'dex' | 'premium';
  bonus?: string;
  description: string;
}

const referralPlatforms: ReferralPlatform[] = [
  // CEX Platforms
  {
    name: 'Binance',
    url: '#', // Remplacez par votre lien de parrainage
    category: 'cex',
    bonus: '20% réduction fees',
    description: 'Plus grande plateforme crypto au monde'
  },
  {
    name: 'Bybit',
    url: '#', // Remplacez par votre lien de parrainage
    category: 'cex',
    bonus: '$30 bonus',
    description: 'Trading dérivés et futures'
  },
  {
    name: 'OKX',
    url: '#', // Remplacez par votre lien de parrainage
    category: 'cex',
    bonus: '40% réduction fees',
    description: 'Trading avancé et DeFi'
  },
  {
    name: 'Bitget',
    url: '#', // Remplacez par votre lien de parrainage
    category: 'cex',
    bonus: '$100 bonus',
    description: 'Copy trading et futures'
  },
  {
    name: 'Gate.io',
    url: '#', // Remplacez par votre lien de parrainage
    category: 'cex',
    bonus: '40% réduction fees',
    description: 'Large sélection d\'altcoins'
  },
  {
    name: 'KuCoin',
    url: '#', // Remplacez par votre lien de parrainage
    category: 'cex',
    bonus: '20% réduction fees',
    description: 'Trading spot et futures'
  },
  // DEX Platforms
  {
    name: 'GMX',
    url: '#', // Remplacez par votre lien de parrainage
    category: 'dex',
    bonus: 'Réduction fees',
    description: 'Trading perpétuels décentralisé'
  },
  {
    name: 'Hyperliquid',
    url: '#', // Remplacez par votre lien de parrainage
    category: 'dex',
    bonus: 'Points bonus',
    description: 'DEX haute performance'
  },
  {
    name: 'dYdX',
    url: '#', // Remplacez par votre lien de parrainage
    category: 'dex',
    bonus: 'Réduction fees',
    description: 'Trading dérivés avancé'
  },
  // Premium Tools
  {
    name: 'TradingView',
    url: '#', // Remplacez par votre lien de parrainage
    category: 'premium',
    bonus: '30 jours gratuits',
    description: 'Analyse technique professionnelle'
  }
];

const ReferralLinks: React.FC = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cex': return <TrendingUp className="w-4 h-4" />;
      case 'dex': return <Zap className="w-4 h-4" />;
      case 'premium': return <Star className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cex': return 'from-neon-green/20 to-neon-cyan/20 border-neon-green/30';
      case 'dex': return 'from-neon-purple/20 to-neon-pink/20 border-neon-purple/30';
      case 'premium': return 'from-neon-orange/20 to-neon-yellow/20 border-neon-orange/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'cex': return 'Exchanges Centralisés';
      case 'dex': return 'Exchanges Décentralisés';
      case 'premium': return 'Outils Premium';
      default: return 'Autres';
    }
  };

  const groupedPlatforms = referralPlatforms.reduce((acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = [];
    }
    acc[platform.category].push(platform);
    return acc;
  }, {} as Record<string, ReferralPlatform[]>);

  return (
    <div className="relative">
      {/* Background with animated border */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-orange/10 rounded-xl blur-sm"></div>
      <div className="relative bg-dark-100/90 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 shadow-2xl">
        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-neon-green rounded-tl-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-neon-purple rounded-tr-xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-neon-orange rounded-bl-xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-neon-cyan rounded-br-xl animate-pulse"></div>

        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="font-orbitron font-bold text-2xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-orange bg-clip-text text-transparent mb-2">
            🚀 Plateformes Recommandées
          </h3>
          <p className="text-gray-400 font-orbitron">
            Accédez aux meilleures plateformes avec des bonus exclusifs
          </p>
        </div>

        {/* Platform Categories */}
        <div className="space-y-6">
          {Object.entries(groupedPlatforms).map(([category, platforms]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-techno-500/20 to-neon-purple/20 rounded-lg">
                  {getCategoryIcon(category)}
                </div>
                <h4 className="font-orbitron font-semibold text-lg text-white">
                  {getCategoryTitle(category)}
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className={`relative overflow-hidden rounded-lg border bg-gradient-to-br ${getCategoryColor(platform.category)} p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-cyan/20 group`}
                  >
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-orbitron font-bold text-white text-lg">
                            {platform.name}
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {platform.description}
                          </p>
                        </div>
                        {getCategoryIcon(platform.category)}
                      </div>
                      
                      {platform.bonus && (
                        <div className="mb-3 p-2 bg-neon-green/20 rounded border border-neon-green/30">
                          <p className="text-neon-green font-orbitron font-semibold text-sm">
                            🎁 {platform.bonus}
                          </p>
                        </div>
                      )}
                      
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-techno-500 to-neon-purple hover:from-techno-600 hover:to-neon-purple/80 transition-all duration-300 font-orbitron"
                      >
                        <a 
                          href={platform.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          S'inscrire
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom disclaimer */}
        <div className="mt-6 pt-4 border-t border-gray-700/50 text-center">
          <p className="text-gray-500 text-xs font-orbitron">
            ⚡ En utilisant ces liens, vous soutenez le développement de cette plateforme
          </p>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>
      </div>
    </div>
  );
};

export default ReferralLinks;
