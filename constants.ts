import { MarketAnalysisData, Timeframe } from './types';

export const getGeminiPrompt = (timeframe: Timeframe): string => {
  let freshnessWindow = '15 minutes';
  if (timeframe === '1h' || timeframe === '4h') freshnessWindow = 'last hour';
  if (timeframe === '1m' || timeframe === '3m' || timeframe === '5m') freshnessWindow = 'last 15 minutes';

  return `
// Atue como um Algoritmo de HFT com Foco em ADX, Volatilidade Bilateral e Gestão de Risco.
⚠️ REGRA DE OURO SOBRE PREÇOS: Nunca altere a escala decimal do ativo. Use o ticker completo (ex: FETUSDT).
🎯 OBJETIVO: Gerar OBRIGATORIAMENTE duas listas: 3-5 BULLISH e 3-5 BEARISH.

### 📊 CRITÉRIOS TÉCNICOS:
1. ADX > 25 + Direção Ascendente = "Chico Bento Original".
2. ADX < 20 ou Direção Descendente = "Chico Bento Reverso".
3. Teste dos 15 Períodos nos últimos ${freshnessWindow}.

### 📤 FORMATO DE SAÍDA (JSON ESTRITO):
{
  "timestamp": "ISO Date String",
  "summary": "Resumo do cenário.",
  "marketHealth": {
    "projection": "Consistent/Intermittent",
    "flowState": "Median",
    "score": 50,
    "reasoning": "Explicação."
  },
  "bullish": [{ "symbol": "TICKERUSDT", "price": 0, "adx": { "value": 0, "trend": "Rising" }, "strategy": "Chico Bento Original", "trendStrengthScore": 0, "reasoning": "...", "support": 0, "resistance": 0, "execution": { "entry": 0, "sl": 0, "tp": 0 } }],
  "bearish": [{ "symbol": "TICKERUSDT", "price": 0, "adx": { "value": 0, "trend": "Falling" }, "strategy": "Chico Bento Original", "trendStrengthScore": 0, "reasoning": "...", "support": 0, "resistance": 0, "execution": { "entry": 0, "sl": 0, "tp": 0 } }]
}`;
};

export const DEMO_DATA: MarketAnalysisData = {
  timestamp: new Date().toISOString(),
  summary: "Aguardando Varredura...",
  marketHealth: {
    projection: "Intermittent",
    flowState: "Median",
    score: 50,
    reasoning: "Sistema pronto."
  },
  bullish: [
    {
      symbol: "BTCUSDT",
      price: 0,
      adx: { value: 0, trend: "Flat" },
      strategy: "Chico Bento Original",
      trendStrengthScore: 0,
      reasoning: "Carregando...",
      support: 0,
      resistance: 0,
      execution: { entry: 0, sl: 0, tp: 0 }
    }
  ],
  bearish: [
    {
      symbol: "ETHUSDT",
      price: 0,
      adx: { value: 0, trend: "Flat" },
      strategy: "Chico Bento Original",
      trendStrengthScore: 0,
      reasoning: "Carregando...",
      support: 0,
      resistance: 0,
      execution: { entry: 0, sl: 0, tp: 0 }
    }
  ]
};
