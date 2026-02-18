import { MarketAnalysisData, Timeframe } from './types';

export const getGeminiPrompt = (timeframe: Timeframe): string => {
  let freshnessWindow = '15 minutes';
  if (timeframe === '1h' || timeframe === '4h') freshnessWindow = 'last hour';
  if (timeframe === '1m' || timeframe === '3m' || timeframe === '5m') freshnessWindow = 'last 15 minutes';

  return `
Atue como um **Algoritmo de HFT com Foco em ADX, Volatilidade Bilateral e Gestão de Risco**.

⚠️ **REGRA DE OURO SOBRE PREÇOS:** Nunca altere a escala decimal do ativo. Se o preço atual de mercado do FETUSDT é 0.16, não sugira suportes em 2.35. Use o ticker completo (ex: PENGUUSDT) para precisão da API.


🎯 **OBJETIVO:** Gerar OBRIGATORIAMENTE duas listas preenchidas: **3-5 BULLISH** e **3-5 BEARISH**.
Não aceite menos que 3 ativos por categoria. Se não houver tendências perfeitas, selecione os ativos com maior volume e momentum relativo que cheguem mais perto dos critérios.

---

### 📊 CRITÉRIOS TÉCNICOS:
1. **ADX & Momentum:** Foco em ativos com ADX > 25 e subindo.
2. **Teste dos 15 Períodos:** Máximas (Alta) ou Mínimas (Baixa) renovadas nos últimos ${freshnessWindow}.
3. **Cálculo de Risco:** Estime a volatilidade (ATR) para definir o Stop Loss ideal.

---

### 📤 FORMATO DE SAÍDA (JSON ESTRITO):
{
  "timestamp": "ISO Date String",
  "summary": "Resumo do cenário atual.",
  "marketHealth": {
    "projection": "Consistent Upward/Downward/Intermittent", 
    "flowState": "Consistent/Median/Intermittent", 
    "score": 0-100,
    "reasoning": "Breve explicação macro."
  },
  "bullish": [
    {
      "symbol": "TICKERUSDT",
      "price": 0.00,
      "change24h": 0.0,
      "trend": "bullish",
      "trendStrengthScore": 0-100, 
      "reasoning": "Análise técnica.",
      "support": 0.00,
      "resistance": 0.00,
      "sparkline": [10 pontos de preço na escala correta],
      "volatility": {
        "noise": "Low" ou "High",
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
      "symbol": "TICKERUSDT",
      "price": 0.00,
      "change24h": -0.0,
      "trend": "bearish",
      "trendStrengthScore": 0-100, 
      "reasoning": "Análise técnica.",
      "support": 0.00,
      "resistance": 0.00,
      "sparkline": [10 pontos de preço na escala correta],
      "volatility": {
        "noise": "Low" ou "High",
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

// Mantive o DEMO_DATA atualizado para você testar os cards clicando em "Load Demo"
export const DEMO_DATA: MarketAnalysisData = {
  timestamp: new Date().toISOString(),
  summary: "Dados de demonstração para validar os novos cards de risco.",
  marketHealth: {
    projection: "Median Upward",
    flowState: "Median",
    score: 65,
    reasoning: "Demonstração da interface."
  },
  bullish: [
    {
      symbol: "FETUSDT",
      price: 0.1686,
      change24h: 12.4,
      trend: "bullish",
      trendStrengthScore: 92,
      reasoning: "Rompimento de acumulação com ADX forte.",
      support: 0.155,
      resistance: 0.180,
      sparkline: [0.142, 0.145, 0.148, 0.152, 0.155, 0.158, 0.162, 0.165, 0.167, 0.1686],
      volatility: { noise: "Low", atrPercent: "1.8%", stopBuffer: "1.2%" },
      execution: { entry: 0.168, sl: 0.165, tp: 0.178 }
    }
  ],
  bearish: [
    {
      symbol: "GALAUSDT",
      price: 0.042,
      change24h: -10.5,
      trend: "bearish",
      trendStrengthScore: 88,
      reasoning: "Perda de suporte macro.",
      support: 0.038,
      resistance: 0.045,
      sparkline: [0.048, 0.047, 0.046, 0.045, 0.044, 0.043, 0.0425, 0.0422, 0.0421, 0.042],
      volatility: { noise: "High", atrPercent: "3.5%", stopBuffer: "2.8%" },
      execution: { entry: 0.042, sl: 0.044, tp: 0.039 }
    }
  ]
};