import React, { useState } from 'react';
import { getLivePrice } from './services/binanceService';
import { AppStep, MarketAnalysisData, MarketTrend, Timeframe } from './types';
import { getGeminiPrompt, DEMO_DATA } from './constants';
import { TrendChart } from './components/TrendChart';
import { StepIndicator } from './components/StepIndicator';
import { 
  ClipboardCopy, 
  ExternalLink, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Play,
  CheckCircle2,
  BarChart3,
  Activity,
  Search,
  Clock,
  Zap,
  Gauge,
  Waves,
  HeartPulse,
  RefreshCw 
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('prompt');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [data, setData] = useState<MarketAnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<MarketTrend | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [timeframe, setTimeframe] = useState<Timeframe>('4h');
  const timeframes: Timeframe[] = ['1m', '3m', '5m', '15m', '1h', '4h', '1d', '1w'];

  const enrichWithLivePrices = async (assets: any[]) => {
    return await Promise.all(
      assets.map(async (asset) => {
        const realPrice = await getLivePrice(asset.symbol);
        return {
          ...asset,
          price: realPrice > 0 ? realPrice : asset.price,
          verified: realPrice > 0 
        };
      })
    );
  };

  const handleRefreshPrices = async () => {
    if (!data) return;
    setIsRefreshing(true);
    try {
      const [refreshedBullish, refreshedBearish] = await Promise.all([
        enrichWithLivePrices(data?.bullish),
        enrichWithLivePrices(data?.bearish)
      ]);
      const updatedData = { ...data, bullish: refreshedBullish, bearish: refreshedBearish };
      setData(updatedData);
      if (selectedCoin) {
        const found = [...refreshedBullish, ...refreshedBearish].find(c => c.symbol === selectedCoin.symbol);
        if (found) setSelectedCoin(found);
      }
    } catch (err) {
      console.error("Erro ao atualizar preços", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setError(null);
      const cleanInput = jsonInput.replace(/```json|```/g, '').trim();
      const parsedData: MarketAnalysisData = JSON.parse(cleanInput);
      const [updatedBullish, updatedBearish] = await Promise.all([
        enrichWithLivePrices(parsedData.bullish),
        enrichWithLivePrices(parsedData.bearish)
      ]);
      const finalData = { ...parsedData, bullish: updatedBullish, bearish: updatedBearish };
      setData(finalData);
      setSelectedCoin(finalData.bullish[0] || finalData.bearish[0]);
      setStep('dashboard');
    } catch (err) {
      setError('Erro ao processar JSON. Verifique o formato e tente novamente.');
    }
  };

  const copyToClipboard = () => {
    const prompt = getGeminiPrompt(timeframe);
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadDemo = () => {
    setData(DEMO_DATA);
    setSelectedCoin(DEMO_DATA.bullish[0]);
    setStep('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 text-slate-100 p-4 md:p-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <Activity size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">TrendSpotter AI</h1>
            <p className="text-xs text-slate-500 tracking-wider uppercase font-semibold">Gemini Powered • Market Structure</p>
          </div>
        </div>
        {step === 'dashboard' && (
          <button onClick={() => { setStep('prompt'); setJsonInput(''); }} className="text-sm text-slate-400 hover:text-white transition-colors">Start Over</button>
        )}
      </header>

      <StepIndicator currentStep={step} />

      <main className="max-w-6xl mx-auto pb-12">
        {step === 'prompt' && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white">Let Gemini Scan the Market</h2>
              <p className="text-slate-400 text-lg">Escolha o tempo gráfico e copie o prompt para o Gemini.</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm max-w-3xl mx-auto text-center">
               <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {timeframes.map((tf) => (
                  <button key={tf} onClick={() => setTimeframe(tf)} className={`py-2 px-1 rounded-lg text-sm font-medium border transition-all ${timeframe === tf ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{tf}</button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">1. Copy Prompt</h3>
                <button onClick={copyToClipboard} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center gap-2">
                  {copied ? <CheckCircle2 size={18} className="text-green-400" /> : <ClipboardCopy size={18} />}
                  {copied ? 'Copied!' : `Copy ${timeframe} Prompt`}
                </button>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">2. Ask Gemini</h3>
                <a href="https://gemini.google.com/app" target="_blank" rel="noreferrer" onClick={() => setStep('input')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center gap-2">
                  Open Gemini <ExternalLink size={18} />
                </a>
              </div>
            </div>
            <button onClick={loadDemo} className="block mx-auto text-sm text-slate-500 hover:text-indigo-400">Load demo data</button>
          </div>
        )}

        {step === 'input' && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder="Cole o JSON aqui..." className="w-full h-64 bg-slate-900/80 border border-slate-700 rounded-2xl p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
            {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep('prompt')} className="flex-1 py-3 border border-slate-700 rounded-xl">Back</button>
              <button onClick={handleAnalyze} className="flex-1 py-3 bg-indigo-600 rounded-xl font-bold">Analyze JSON</button>
            </div>
          </div>
        )}

        {step === 'dashboard' && data && selectedCoin && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
               <div>
                  <h3 className="text-white font-bold flex items-center gap-2"><Activity size={18} className="text-indigo-400" /> Live Dashboard</h3>
                  <p className="text-xs text-slate-500">Preços atualizados via Binance API</p>
               </div>
               <button onClick={handleRefreshPrices} disabled={isRefreshing} className={`flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-indigo-500/20 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                 <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                 {isRefreshing ? 'Updating...' : 'Refresh Prices'}
               </button>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
              <p className="text-lg text-slate-200 leading-relaxed font-light">{data.summary}</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 min-h-[600px]">
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                   <div className="p-4 border-b border-slate-800 bg-emerald-950/20 flex items-center gap-2 text-emerald-100 font-bold">
                      <TrendingUp size={20} className="text-emerald-500" /> Bullish Trends
                   </div>
                   <div className="p-2 space-y-2 overflow-y-auto max-h-[380px]">
                      {data?.bullish?.map(coin => (
                        <CoinListItem key={coin.symbol} coin={coin} isSelected={selectedCoin?.symbol === coin.symbol} onClick={() => setSelectedCoin(coin)} />
                      ))}
                   </div>
                </div>
                <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                   <div className="p-4 border-b border-slate-800 bg-red-950/20 flex items-center gap-2 text-red-100 font-bold">
                      <TrendingDown size={20} className="text-red-500" /> Bearish Trends
                   </div>
                   <div className="p-2 space-y-2 overflow-y-auto max-h-[380px]">
                      {data.bearish?.map(coin => (
                        <CoinListItem key={coin.symbol} coin={coin} isSelected={selectedCoin?.symbol === coin.symbol} onClick={() => setSelectedCoin(coin)} />
                      ))}
                   </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      {selectedCoin.symbol}
                      <span className={`text-sm px-2 py-1 rounded font-medium border ${selectedCoin.trend === 'bullish' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{selectedCoin?.trend?.toUpperCase() || "CARREGANDO..."}</span>
                    </h2>
                    <div className="mt-2 font-mono text-2xl text-white">${selectedCoin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                  </div>
                  <div className="text-right">
                     <span className="text-[10px] uppercase text-slate-500 font-bold">Trend Strength</span>
                     <div className="text-2xl font-bold text-indigo-400">{selectedCoin.trendStrengthScore}</div>
                  </div>
                </div>

                <div className="mb-6 flex-grow"><TrendChart data={selectedCoin} detailed /></div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><Activity size={14} /> Analysis Reasoning</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{selectedCoin.reasoning}</p>
                </div>

                {selectedCoin.volatility && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase mb-3 flex items-center gap-2"><Gauge size={14} /> Volatility & Noise</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Market Noise</span><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedCoin.volatility.noise === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{selectedCoin.volatility.noise}</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs text-slate-400">ATR Relative</span><span className="text-sm font-mono text-slate-200">{selectedCoin.volatility.atrPercent}</span></div>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
                      <h4 className="text-xs font-bold text-amber-400 uppercase mb-3 flex items-center gap-2"><AlertTriangle size={14} /> Execution Risk</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Stop Buffer</span><span className="text-sm font-mono text-amber-400">± {selectedCoin.volatility.stopBuffer}</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Rec. Leverage</span><span className="text-sm font-mono text-slate-200">{selectedCoin.volatility.noise === 'High' ? 'Low' : 'Normal'}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedCoin.execution && (
                  <div className="mt-4 p-4 bg-slate-900/80 rounded-xl border border-slate-700 border-dashed">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Suggested Execution</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center"><p className="text-[10px] text-slate-500 uppercase">Entry</p><p className="text-sm font-mono text-white">{selectedCoin.execution.entry}</p></div>
                      <div className="text-center"><p className="text-[10px] text-red-500 uppercase">Stop Loss</p><p className="text-sm font-mono text-red-400">{selectedCoin.execution.sl}</p></div>
                      <div className="text-center"><p className="text-[10px] text-emerald-500 uppercase">Take Profit</p><p className="text-sm font-mono text-emerald-400">{selectedCoin.execution.tp}</p></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const CoinListItem: React.FC<{
  coin: MarketTrend;
  isSelected: boolean;
  onClick: () => void;
}> = ({ coin, isSelected, onClick }) => {
  const isBullish = coin.trend === 'bullish';
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${isSelected ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-slate-800/30 border-transparent hover:bg-slate-800'}`}>
      <div className="text-left">
        <div className="font-bold text-sm text-slate-200 flex items-center gap-2">{coin.symbol}{coin.trendStrengthScore > 85 && <Zap size={12} className="text-yellow-400 fill-yellow-400" />}</div>
        <div className={`text-xs font-mono ${isBullish ? 'text-emerald-400' : 'text-red-400'}`}>{isBullish ? '+' : ''}{coin.change24h}%</div>
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
