
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ChartData {
  time: string;
  rate: number;
  volume: number;
}

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

interface FundingRateChartProps {
  data: ChartData[];
  exchange: string;
  opportunityData?: ArbitrageOpportunity;
}

const FundingRateChart: React.FC<FundingRateChartProps> = ({ data, exchange, opportunityData }) => {
  // Generate mock data for long and short rates over time
  const chartDataWithArbitrage = data.map((point, index) => ({
    ...point,
    longRate: opportunityData ? opportunityData.longRate + (Math.random() * 0.0002 - 0.0001) : point.rate,
    shortRate: opportunityData ? opportunityData.shortRate + (Math.random() * 0.0002 - 0.0001) : point.rate + 0.001,
    arbitrageProfit: opportunityData ? Math.abs((opportunityData.shortRate + (Math.random() * 0.0002 - 0.0001)) - (opportunityData.longRate + (Math.random() * 0.0002 - 0.0001))) : Math.abs(point.rate - (point.rate + 0.001))
  }));

  return (
    <div className="data-card">
      <div className="mb-6">
        <h3 className="font-orbitron font-semibold text-xl text-white mb-2">
          {opportunityData ? `${opportunityData.symbol} Arbitrage Analysis` : exchange}
        </h3>
        <p className="text-gray-400">
          {opportunityData ? 
            `Long on ${opportunityData.longExchange} vs Short on ${opportunityData.shortExchange}` : 
            '24h historical data with volume correlation'
          }
        </p>
      </div>

      {/* Arbitrage Summary */}
      {opportunityData && (
        <div className="mb-6 p-4 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-lg border border-neon-cyan/20">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Current Profit</p>
              <p className="text-neon-cyan font-orbitron font-bold text-xl">
                {opportunityData.profitPercentage.toFixed(4)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">24h Change</p>
              <p className={`font-orbitron font-bold text-xl ${opportunityData.change24h >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                {opportunityData.change24h >= 0 ? '+' : ''}{opportunityData.change24h.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Next Funding in</p>
            <p className="text-white font-medium">{opportunityData.nextFunding}</p>
          </div>
        </div>
      )}

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartDataWithArbitrage}>
            <defs>
              <linearGradient id="colorLongRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorShortRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff0080" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff0080" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorArbitrageProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00f5ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.6)"
              fontSize={12}
              fontFamily="Inter"
            />
            <YAxis 
              stroke="rgba(255,255,255,0.6)"
              fontSize={12}
              fontFamily="Inter"
              tickFormatter={(value) => `${(value * 100).toFixed(3)}%`}
            />
            {opportunityData ? (
              <>
                <Area
                  type="monotone"
                  dataKey="longRate"
                  stroke="#00ff88"
                  strokeWidth={2}
                  fillOpacity={0.3}
                  fill="url(#colorLongRate)"
                  name="Long Rate"
                />
                <Area
                  type="monotone"
                  dataKey="shortRate"
                  stroke="#ff0080"
                  strokeWidth={2}
                  fillOpacity={0.3}
                  fill="url(#colorShortRate)"
                  name="Short Rate"
                />
                <Line
                  type="monotone"
                  dataKey="arbitrageProfit"
                  stroke="#00f5ff"
                  strokeWidth={3}
                  dot={{ fill: '#00f5ff', strokeWidth: 2, r: 3 }}
                  name="Arbitrage Profit"
                />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#00f5ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorArbitrageProfit)"
                strokeDasharray="0"
                animationDuration={1500}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats below chart */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
        {opportunityData ? (
          <>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Avg Long Rate</p>
              <p className="text-neon-green font-orbitron font-semibold">
                {(opportunityData.longRate * 100).toFixed(4)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Avg Short Rate</p>
              <p className="text-neon-pink font-orbitron font-semibold">
                {(opportunityData.shortRate * 100).toFixed(4)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Spread</p>
              <p className="text-neon-cyan font-orbitron font-semibold">
                {(opportunityData.arbitrageProfit * 100).toFixed(4)}%
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Avg Rate</p>
              <p className="text-white font-orbitron font-semibold">
                {((data.reduce((sum, d) => sum + d.rate, 0) / data.length) * 100).toFixed(4)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Max Rate</p>
              <p className="text-neon-green font-orbitron font-semibold">
                {(Math.max(...data.map(d => d.rate)) * 100).toFixed(4)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Min Rate</p>
              <p className="text-neon-pink font-orbitron font-semibold">
                {(Math.min(...data.map(d => d.rate)) * 100).toFixed(4)}%
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FundingRateChart;
