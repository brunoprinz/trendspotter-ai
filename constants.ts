{/* Analysis Reasoning */}
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                        <Activity size={14} /> Analysis Reasoning
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedCoin.reasoning}
                      </p>
                    </div>

                    {/* NOVO BLOCO: RISK CALIBRATION */}
                    {selectedCoin.volatility && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20">
                          <h4 className="text-xs font-bold text-indigo-400 uppercase mb-3 flex items-center gap-2">
                            <Gauge size={14} /> Volatility & Noise
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Market Noise</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                selectedCoin.volatility.noise === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {selectedCoin.volatility.noise}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">ATR Relative</span>
                              <span className="text-sm font-mono text-slate-200">{selectedCoin.volatility.atrPercent}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
                          <h4 className="text-xs font-bold text-amber-400 uppercase mb-3 flex items-center gap-2">
                            <AlertTriangle size={14} /> Execution Risk
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Stop Buffer</span>
                              <span className="text-sm font-mono text-amber-400">± {selectedCoin.volatility.stopBuffer}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Rec. Leverage</span>
                              <span className="text-sm font-mono text-slate-200">
                                {selectedCoin.volatility.noise === 'High' ? 'Low' : 'Normal'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NOVO BLOCO: TARGET LEVELS (SL/TP) */}
                    {selectedCoin.execution && (
                      <div className="mt-4 p-4 bg-slate-900/80 rounded-xl border border-slate-700 border-dashed">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Suggested Execution</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <p className="text-[10px] text-slate-500 uppercase">Entry</p>
                            <p className="text-sm font-mono text-white">{selectedCoin.execution.entry}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-red-500 uppercase">Stop Loss</p>
                            <p className="text-sm font-mono text-red-400">{selectedCoin.execution.sl}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-emerald-500 uppercase">Take Profit</p>
                            <p className="text-sm font-mono text-emerald-400">{selectedCoin.execution.tp}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// Sub-componente da lista (MANTIDO IGUAL)
const CoinListItem: React.FC<{
  coin: MarketTrend;
  isSelected: boolean;
  onClick: () => void;
}> = ({ coin, isSelected, onClick }) => {
  const isBullish = coin.trend === 'bullish';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
        isSelected 
        ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
        : 'bg-slate-800/30 border-transparent hover:bg-slate-800'
      }`}
    >
      <div className="text-left">
        <div className="font-bold text-sm text-slate-200 flex items-center gap-2">
          {coin.symbol}
          {coin.trendStrengthScore > 85 && <Zap size={12} className="text-yellow-400 fill-yellow-400" />}
        </div>
        <div className={`text-xs font-mono ${isBullish ? 'text-emerald-400' : 'text-red-400'}`}>
          {isBullish ? '+' : ''}{coin.change24h}%
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-xs font-mono text-slate-300">${coin.price}</div>
          <div className="text-[10px] text-slate-500 uppercase">Score: {coin.trendStrengthScore}</div>
        </div>
        <div className={`p-1.5 rounded-lg ${isBullish ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
          {isBullish ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-red-500" />}
        </div>
      </div>
    </button>
  );
};

export default App;