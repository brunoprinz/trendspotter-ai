import { MarketAnalysisData, Timeframe } from './types';

export const getGeminiPrompt = (timeframe: Timeframe): string => {
  // Define o intervalo de "Frescor" baseado no timeframe escolhido
  let freshnessWindow = '15 minutes';
  if (timeframe === '1h' || timeframe === '4h') freshnessWindow = 'last hour';
  if (timeframe === '1m' || timeframe === '3m' || timeframe === '5m') freshnessWindow = 'last 15 minutes';

  return `
Atue como um **Algoritmo de HFT com Foco em ADX, Volatilidade Bilateral e Gestão de Risco**.

IMPORTANTE: Nunca mude a escala do ativo. Se o ativo custa 0.007, não escreva 0.015. Use o ticker completo (ex: PENGUUSDT) para garantir a busca via API.

🎯 **OBJETIVO:** Gerar duas listas distintas: **TOP 3-5 BULLISH** e **TOP 3-5 BEARISH**.
Busque ativamente por tendências fortes de alta e moedas em queda livre (panic selling/breakdown).

---

### 📊 CRITÉRIOS DE ANÁLISE ADX, VOLUME E RISCO:

Para cada moeda, calcule o **'trendStrengthScore' (0-100)** e analise a volatilidade:

1.  **ADX & Momentum:** Busque ativos com ADX acima de 25 e subindo. Movimentos verticais = Score Alto.
2.  **Teste dos 15 Períodos:** Renovação de MÁXIMAS (Alta) ou MÍNIMAS (Baixa) nos últimos ${freshnessWindow}.
3.  **Análise de Ruído (Volatility):** Identifique se o movimento é "limpo" ou se há muitos pavios (wicks) contra a tendência.
4.  **Parâmetros de Execução:** Defina um Stop Loss (SL) seguro baseado na volatilidade (ATR) e um Take Profit (TP) condizente.

---

### 🏥 MARKET HEALTH PROJECTION:
Gere um diagnóstico macro: 'Consistent Upward', 'Median Downward', 'Intermittent Volatility', etc.

---

### 📤 FORMATO DE SAÍDA (JSON Obrigatório - Não altere as chaves):
{
  "timestamp": "ISO Date String",
  "summary": "Resumo balanceado do mercado atual.",
  "marketHealth": {
    "projection": "Consistent Upward", 
    "flowState": "Consistent", 
    "score": 85,
    "reasoning": "Breve explicação da saúde macro."
  },
  "bullish": [
    {
      "symbol": "COINUSDT",
      "price": 0.00,
      "change24h": 5.0,
      "trend": "bullish",
      "trendStrengthScore": 88, 
      "reasoning": "Explicação técnica da tendência.",
      "support": 0.00,
      "resistance": 0.00,
      "sparkline": [10 pontos de preço],
      "volatility": {
        "noise": "Low" or "High",
        "atrPercent": "X.X%",
        "stopBuffer": "X.X%"
      },
      "execution": {
        "entry": 0.00,
        "sl": 0.00,
        "tp": 0.00
      }
    }
  ],
  "bearish": [
     {
      "symbol": "DOWNUSDT",
      "price": 0.00,
      "change24h": -8.0,
      "trend": "bearish",
      "trendStrengthScore": 85, 
      "reasoning": "Explicação técnica da queda.",
      "support": 0.00,
      "resistance": 0.00,
      "sparkline": [10 pontos de preço],
      "volatility": {
        "noise": "Low" or "High",
        "atrPercent": "X.X%",
        "stopBuffer": "X.X%"
      },
      "execution": {
        "entry": 0.00,
        "sl": 0.00,
        "tp": 0.00
      }
    }
  ]
}
`;
};

// Dados de demonstração atualizados para testar a nova UI
export const DEMO_DATA: MarketAnalysisData = {
  timestamp: new Date().toISOString(),
  summary: "Análise Bilateral: Ativos de IA mantêm fluxo consistente, enquanto o setor de DePIN sofre correções agudas com aumento de ruído.",
  marketHealth: {
    projection: "Median Upward",
    flowState: "Median",
    score: 65,
    reasoning: "Tendência de alta presente mas com ruído elevado em timeframes menores."
  },
  bullish: [
    {
      symbol: "FETUSDT",
      price: 1.45,
      change24h: 12.4,
      trend: "bullish",
      trendStrengthScore: 92,
      reasoning: "Rompimento vertical com ADX em 40. Baixo ruído nos candles de 15m.",
      support: 1.38,
      resistance: 1.55,
      sparkline: [1.32, 1.35, 1.38, 1.40, 1.41, 1.43, 1.44, 1.45, 1.44, 1.45],
      volatility: { noise: "Low", atrPercent: "1.8%", stopBuffer: "1.2%" },
      execution: { entry: 1.44, sl: 1.41, tp: 1.52 }
    }
  ],
  bearish: [
    {
      symbol: "OGNUSDT",
      price: 0.125,
      change24h: -15.2,
      trend: "bearish",
      trendStrengthScore: 94,
      reasoning: "Panic selling após quebra de suporte. Volume de venda 4x acima da média.",
      support: 0.115,
      resistance: 0.135,
      sparkline: [0.145, 0.142, 0.140, 0.138, 0.135, 0.132, 0.130, 0.128, 0.126, 0.125],
      volatility: { noise: "High", atrPercent: "3.5%", stopBuffer: "3.0%" },
      execution: { entry: 0.126, sl: 0.132, tp: 0.110 }
    }
  ]
};