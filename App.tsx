
import React, { useState, useEffect } from 'react';
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
  HeartPulse
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('prompt');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [data, setData] = useState<MarketAnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<MarketTrend | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Timeframe state
  const [timeframe, setTimeframe] = useState<Timeframe>('4h');
  const timeframes: Timeframe[] = ['1m', '3m', '5m', '15m', '1h', '4h', '1d', '1w'];

  // Parse JSON when submitted
  const handleAnalyze = () => {
    try {
      setError(null);
      // Try to clean the input if it has markdown wrappers
      let cleanInput = jsonInput.trim();
      if (cleanInput.startsWith('```json')) {
        cleanInput = cleanInput.replace('```json', '').replace('```', '');
      } else if (cleanInput.startsWith('```')) {
        cleanInput = cleanInput.replace('```', '').replace('```', '');
      }

      const parsedData: MarketAnalysisData = JSON.parse(cleanInput);
      
      // Basic validation
      if (!parsedData.bullish || !parsedData.bearish) {
        throw new Error("Invalid JSON structure. Missing 'bullish' or 'bearish' arrays.");
      }

      setData(parsedData);
      setSelectedCoin(parsedData.bullish[0] || parsedData.bearish[0]);
      setStep('dashboard');
    } catch (err) {
      setError("Failed to parse JSON. Please ensure you copied the exact output from Gemini.");
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    // Generate prompt based on selected timeframe
    const prompt = getGeminiPrompt(timeframe);
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadDemo = () => {
    setJsonInput(JSON.stringify(DEMO_DATA, null, 2));
    setData(DEMO_DATA);
    setSelectedCoin(DEMO_DATA.bullish[0]);
    setStep('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 text-slate-100 p-4 md:p-8">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <Activity size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              TrendSpotter AI
            </h1>
            <p className="text-xs text-slate-500 tracking-wider uppercase font-semibold">Gemini Powered • Market Structure</p>
          </div>
        </div>
        
        {step === 'dashboard' && (
          <button 
            onClick={() => {
              setStep('prompt');
              setJsonInput('');
            }}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Start Over
          </button>
        )}
      </header>

      {/* Progress */}
      <StepIndicator currentStep={step} />

      <main className="max-w-6xl mx-auto pb-12">
        
        {/* Step 1: Prompt Generation */}
        {step === 'prompt' && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white">Let Gemini Scan the Market</h2>
              <p className="text-slate-400 text-lg">
                Select your preferred trading timeframe, then copy the specialized prompt for Gemini.
              </p>
            </div>

            {/* Timeframe Selector */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-4 text-slate-300">
                 <Clock size={18} className="text-indigo-400" />
                 <span className="font-semibold text-sm uppercase tracking-wider">Select Timeframe</span>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`
                      py-2 px-1 rounded-lg text-sm font-medium transition-all duration-200 border
                      ${timeframe === tf 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'}
                    `}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {/* Card 1: Copy Prompt */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-indigo-500/50 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-slate-800 p-2 rounded-lg text-indigo-400 group-hover:text-indigo-300">
                    <ClipboardCopy size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">1. Copy System Prompt</h3>
                </div>
                <p className="text-slate-400 mb-6 text-sm">
                  Includes logic for detecting <strong>{timeframe.toUpperCase()}</strong> trends, checking <strong>ADX/Volume</strong>, and filtering choppy markets.
                </p>
                <button
                  onClick={copyToClipboard}
                  className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600"
                >
                  {copied ? <CheckCircle2 size={18} className="text-green-400" /> : <ClipboardCopy size={18} />}
                  {copied ? 'Copied to Clipboard!' : `Copy ${timeframe} Prompt`}
                </button>
              </div>

              {/* Card 2: Open Gemini */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-indigo-500/50 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-slate-800 p-2 rounded-lg text-indigo-400 group-hover:text-indigo-300">
                    <ExternalLink size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">2. Ask Gemini</h3>
                </div>
                <p className="text-slate-400 mb-6 text-sm">
                  Open Gemini in a new tab, paste the prompt, and wait for the JSON response.
                </p>
                <a
                  href="https://gemini.google.com/app"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setStep('input')}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  Open Gemini <ExternalLink size={18} />
                </a>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button onClick={loadDemo} className="text-sm text-slate-500 hover:text-indigo-400 underline underline-offset-4 flex items-center gap-1">
                <Play size={12} /> Or load demo data to see how it looks
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Input Data */}
        {step === 'input' && (
          <div className="animate-fade-in max-w-3xl mx-auto">
             <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Paste Analysis Result</h2>
              <p className="text-slate-400">
                Paste the JSON response from Gemini below (based on the <strong>{timeframe}</strong> chart).
              </p>
            </div>

            <div className="relative">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste JSON here... { "timestamp": "...", "bullish": [...] }'
                className="w-full h-64 bg-slate-900/80 border border-slate-700 rounded-2xl p-4 font-mono text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none custom-scrollbar shadow-inner"
              />
              {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg flex items-center gap-2 text-sm backdrop-blur-md">
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep('prompt')}
                className="flex-1 py-3 bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!jsonInput.trim()}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex justify-center items-center gap-2"
              >
                Generate Dashboard <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Dashboard */}
        {step === 'dashboard' && data && selectedCoin && (
          <div className="animate-fade-in space-y-6">
            
            {/* Market Summary */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                    <Search size={20} className="text-indigo-400" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Market Summary</h3>
                 </div>
                 <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50">
                    <Clock size={14} className="text-indigo-400" />
                    <span className="text-xs font-medium text-indigo-100">{timeframe.toUpperCase()} Analysis</span>
                 </div>
              </div>
              <p className="text-lg text-slate-200 leading-relaxed font-light">
                {data.summary}
              </p>
              <div className="mt-4 text-xs text-slate-500 font-mono">
                Analysis generated at: {new Date(data.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 min-h-[600px]">
              
              {/* Left Column: Lists */}
              <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-hidden">
                
                {/* Bullish List */}
                <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                   <div className="p-4 border-b border-slate-800 bg-emerald-950/20 flex items-center gap-2">
                      <TrendingUp className="text-emerald-500" size={20} />
                      <h3 className="font-bold text-emerald-100">Bullish Trends</h3>
                   </div>
                   <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar max-h-[300px] lg:max-h-none">
                      {data.bullish.map(coin => (
                        <CoinListItem 
                          key={coin.symbol} 
                          coin={coin} 
                          isSelected={selectedCoin.symbol === coin.symbol}
                          onClick={() => setSelectedCoin(coin)}
                        />
                      ))}
                   </div>
                </div>

                {/* Bearish List */}
                <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                   <div className="p-4 border-b border-slate-800 bg-red-950/20 flex items-center gap-2">
                      <TrendingDown className="text-red-500" size={20} />
                      <h3 className="font-bold text-red-100">Bearish Trends</h3>
                   </div>
                   <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar max-h-[300px] lg:max-h-none">
                      {data.bearish.map(coin => (
                        <CoinListItem 
                          key={coin.symbol} 
                          coin={coin} 
                          isSelected={selectedCoin.symbol === coin.symbol}
                          onClick={() => setSelectedCoin(coin)}
                        />
                      ))}
                   </div>
                </div>

              </div>

              {/* Right Column: Detail View */}
              <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      {selectedCoin.symbol}
                      <span className={`text-sm px-2 py-1 rounded font-medium border ${
                        selectedCoin.trend === 'bullish' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {selectedCoin.trend.toUpperCase()}
                      </span>
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                       <span className={`text-xl font-mono font-medium ${selectedCoin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                         {selectedCoin.change24h > 0 ? '+' : ''}{selectedCoin.change24h}%
                       </span>
                       <span className="text-slate-400 text-sm">24h Change</span>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    {/* Confidence Score */}
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Confidence</span>
                       <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-400" style={{ width: `${selectedCoin.confidence}%` }} />
                          </div>
                          <span className="text-sm font-bold text-slate-300">{selectedCoin.confidence}%</span>
                       </div>
                    </div>

                    {/* Trend Strength Score (ADX) */}
                    <div className="flex flex-col items-end">
                       <div className="flex items-center gap-1 text-[10px] uppercase text-indigo-400 font-bold tracking-wider">
                          <Zap size={10} /> Trend Strength
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${selectedCoin.trendStrengthScore > 80 ? 'bg-indigo-500' : 'bg-indigo-700'}`} 
                              style={{ width: `${selectedCoin.trendStrengthScore}%` }}
                            />
                          </div>
                          <span className="text-lg font-bold text-indigo-400">{selectedCoin.trendStrengthScore || 0}</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="mb-6 flex-grow">
                   <TrendChart data={selectedCoin} detailed />
                </div>

                {/* Reasoning Box */}
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    <BarChart3 size={16} /> Analysis & Reasoning ({timeframe})
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {selectedCoin.reasoning}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4">
                     <div>
                       <span className="text-xs text-slate-500 uppercase">Volume Profile</span>
                       <p className="font-mono text-slate-200 text-sm">{selectedCoin.volume}</p>
                     </div>
                     <div>
                       <span className="text-xs text-slate-500 uppercase">Structure</span>
                       <p className="font-mono text-slate-200 text-sm">
                         {selectedCoin.trend === 'bullish' ? 'Higher Highs / Lows' : 'Lower Highs / Lows'}
                       </p>
                     </div>
                  </div>
                </div>

              </div>
            </div>

            {/* MARKET HEALTH PROJECTION SECTION (New) */}
            {data.marketHealth && (
              <div className="mt-8 bg-slate-900 border border-indigo-900/30 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-600/20 rounded-lg">
                      <HeartPulse size={24} className="text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-indigo-100">
                      Market Health Projection
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    
                    {/* Projection Status */}
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-xl border border-slate-800">
                      <Gauge size={48} className={`mb-3
                          ${data.marketHealth.score > 70 ? 'text-emerald-400' : 
                            data.marketHealth.score < 30 ? 'text-red-400' : 'text-yellow-400'}
                      `} />
                      <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Trend Projection</span>
                      <span className={`text-xl font-bold text-center
                        ${data.marketHealth.projection.includes('Consistent') ? 'text-emerald-300' : 
                          data.marketHealth.projection.includes('Intermittent') ? 'text-red-300' : 'text-blue-300'}
                      `}>
                        {data.marketHealth.projection}
                      </span>
                    </div>

                    {/* Flow Consistency */}
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-xl border border-slate-800">
                      <Waves size={48} className={`mb-3
                          ${data.marketHealth.flowState === 'Consistent' ? 'text-indigo-400' : 
                            data.marketHealth.flowState === 'Median' ? 'text-blue-400' : 'text-slate-500'}
                      `} />
                      <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Flow State</span>
                      <span className={`text-xl font-bold
                        ${data.marketHealth.flowState === 'Consistent' ? 'text-indigo-300' : 
                          data.marketHealth.flowState === 'Median' ? 'text-blue-300' : 'text-slate-400'}
                      `}>
                        {data.marketHealth.flowState}
                      </span>
                      <div className="mt-2 text-xs text-slate-500 font-mono">
                         Score: {data.marketHealth.score}/100
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div className="md:col-span-1 flex flex-col justify-center bg-slate-950/30 p-6 rounded-xl border border-slate-800/50">
                       <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                         <Activity size={14} /> Historical Context Analysis
                       </h4>
                       <p className="text-slate-200 leading-relaxed text-sm">
                         {data.marketHealth.reasoning}
                       </p>
                    </div>

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

// Sub-component for the list item
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
          {coin.trendStrengthScore > 85 && (
            <Zap size={12} className="text-yellow-400 fill-yellow-400" />
          )}
        </div>
        <div className={`text-xs font-mono ${isBullish ? 'text-emerald-400' : 'text-red-400'}`}>
          {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
        </div>
      </div>
      
      {/* Mini Sparkline */}
      <TrendChart data={coin} />
    </button>
  );
};

export default App;
