
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ChartData {
  time: string;
  rate: number;
  volume: number;
}

interface FundingRateChartProps {
  data: ChartData[];
  exchange: string;
}

const FundingRateChart: React.FC<FundingRateChartProps> = ({ data, exchange }) => {
  return (
    <div className="data-card">
      <div className="mb-6">
        <h3 className="font-orbitron font-semibold text-xl text-white mb-2">
          {exchange} - Funding Rate Evolution
        </h3>
        <p className="text-gray-400">24h historical data with volume correlation</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
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
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#00f5ff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRate)"
              strokeDasharray="0"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats below chart */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
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
      </div>
    </div>
  );
};

export default FundingRateChart;
