import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { MarketTrend } from '../types';

interface TrendChartProps {
  data: MarketTrend;
  detailed?: boolean;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, detailed = false }) => {
  const isBullish = data.trend === 'bullish';
  const color = isBullish ? '#10b981' : '#ef4444'; // emerald-500 : red-500
  
  // Transform flat array into object array for Recharts
  const chartData = data.sparkline.map((val, idx) => ({
    time: idx,
    price: val
  }));

  if (!detailed) {
    // Mini sparkline for list view
    return (
      <div className="h-12 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={color} 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Detailed chart for dashboard view
  return (
    <div className="w-full h-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h3 className="text-sm text-slate-400">Price Structure (Simulated)</h3>
           <p className={`text-2xl font-bold ${isBullish ? 'text-emerald-400' : 'text-red-400'}`}>
             ${data.price.toLocaleString()}
           </p>
        </div>
        <div className="flex gap-4 text-xs">
           <div className="bg-slate-900 px-3 py-1 rounded border border-slate-700">
             <span className="text-slate-500 block">Support</span>
             <span className="text-slate-200 font-mono">${data.support}</span>
           </div>
           <div className="bg-slate-900 px-3 py-1 rounded border border-slate-700">
             <span className="text-slate-500 block">Resistance</span>
             <span className="text-slate-200 font-mono">${data.resistance}</span>
           </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`colorGradient-${data.symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            tickFormatter={(val) => `$${val}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
            itemStyle={{ color: color }}
            formatter={(value: number) => [`$${value}`, 'Price']}
            labelFormatter={() => ''}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#colorGradient-${data.symbol})`} 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
