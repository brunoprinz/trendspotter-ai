
import { MarketAnalysisData, Timeframe } from './types';

export const getGeminiPrompt = (timeframe: Timeframe): string => {
  // Define o intervalo de "Frescor" baseado no timeframe escolhido
  let freshnessWindow = '15 minutes';
  if (timeframe === '1h' || timeframe === '4h') freshnessWindow = 'last hour';
  if (timeframe === '1m' || timeframe === '3m' || timeframe === '5m') freshnessWindow = 'last 15 minutes';

  return `
Atue como um **Algoritmo de HFT com Foco em ADX e Volatilidade Bilateral**.

🎯 **OBJETIVO:** Gerar duas listas distintas: **TOP 3-5 BULLISH** e **TOP 3-5 BEARISH**.
O usuário notou que você estava ignorando tendências de baixa. **É CRÍTICO buscar ativamente por moedas em queda livre (panic selling/breakdown).**

---

### 📊 CRITÉRIOS DE ANÁLISE AVANÇADA (ADX & VOLUME):

Para cada moeda, você deve calcular/estimar um **'trendStrengthScore' (0-100)** baseado em 3 pilares:

1.  **ADX (Força da Tendência):**
    *   Se o movimento é vertical e sem pausas = Score Alto (>80).
    *   Se há muitas velas sobrepostas (overlap) = Score Baixo (<50).
    *   *Conceito:* Busque ativos onde o ADX estaria acima de 25 e subindo.

2.  **Consistência de Volume:**
    *   O volume deve aumentar na direção da tendência.
    *   Velas de rompimento (seja de alta ou baixa) devem ter volume pelo menos 2x a média.

3.  **Teste dos 15 Períodos (Adaptado):**
    *   **Alta:** Preço renovando MÁXIMAS nos últimos ${freshnessWindow}.
    *   **Baixa:** Preço renovando MÍNIMAS nos últimos ${freshnessWindow}.
    *   *Nota:* Se o ativo inverteu a direção nos últimos 5 minutos, descarte. Queremos **continuidade**.

---

### 🏥 MARKET HEALTH PROJECTION (NOVO - Seção Extra):
Além de listar os ativos, analise o comportamento histórico macro (Diário/Semanal) dos ativos identificados.
*   **Consistent:** O fluxo é limpo? Os ativos seguem topos e fundos claros também no gráfico diário?
*   **Median:** O fluxo é bom no curto prazo, mas contra a tendência macro ou lateral no diário.
*   **Intermittent:** Alta volatilidade, pavios longos, "rabiscos" no gráfico. Difícil operar.

Gere um diagnóstico: 'Consistent Upward', 'Median Downward', 'Intermittent Volatility', etc.

---

### 🕵️‍♂️ PARÂMETROS DE BUSCA (Busque ambos os lados):
*   Lado Compra: "Binance futures top gainers ${freshnessWindow}", "Crypto breakout strong volume"
*   Lado Venda: "Binance futures top losers ${freshnessWindow}", "Crypto breakdown support levels", "Coins dumping right now"

---

### 📤 FORMATO DE SAÍDA (JSON Obrigatório):
{
  "timestamp": "ISO Date String",
  "summary": "Resumo balanceado. Ex: 'Mercado misto. Encontramos 4 ativos rompendo topos e 3 ativos perdendo suportes importantes com alto volume de venda.'",
  "marketHealth": {
    "projection": "Consistent Upward", 
    "flowState": "Consistent", 
    "score": 85,
    "reasoning": "A maioria dos ativos listados (Bullish) também apresenta estrutura de alta no gráfico diário e semanal, confirmando um fluxo saudável e sustentável."
  },
  "bullish": [
    {
      "symbol": "COINUSDT",
      "price": 0.00,
      "change24h": 5.0,
      "trend": "bullish",
      "confidence": 95,
      "trendStrengthScore": 88, 
      "reasoning": "ADX alto. Rompeu resistência de $10. Topos e fundos ascendentes claros no 15m.",
      "volume": "Compra agressiva",
      "support": 0.00,
      "resistance": 0.00,
      "sparkline": [10, 10.2, 10.4, 10.3, 10.6, 10.9, 11.2, 11.5, 11.8, 12.0]
    }
  ],
  "bearish": [
     {
      "symbol": "DOWNUSDT",
      "price": 0.00,
      "change24h": -8.0,
      "trend": "bearish",
      "confidence": 92,
      "trendStrengthScore": 85, 
      "reasoning": "Perdeu o suporte principal. Panic selling detectado. Candles vermelhos grandes sem pavio inferior.",
      "volume": "Venda Massiva",
      "support": 0.00,
      "resistance": 0.00,
      "sparkline": [12.0, 11.8, 11.5, 11.2, 11.3, 11.0, 10.8, 10.5, 10.2, 10.0]
    }
  ]
}

**NOTA:** Tente preencher pelo menos 3 slots em 'bullish' e 3 slots em 'bearish'. Se o mercado estiver caindo muito, preencha mais o bearish.
`;
};

export const DEMO_DATA: MarketAnalysisData = {
  timestamp: new Date().toISOString(),
  summary: "Análise Bilateral: O mercado apresenta oportunidades claras em ambas as direções. Enquanto tokens de IA sobem forte, memecoins antigas estão perdendo suportes críticos.",
  marketHealth: {
    projection: "Median Upward",
    flowState: "Median",
    score: 65,
    reasoning: "Embora tenhamos rompimentos fortes em IA (Bullish), o Bitcoin enfrenta resistência no semanal, o que gera divergências e torna o fluxo menos consistente (Median) do que uma tendência de alta pura."
  },
  bullish: [
    {
      symbol: "OGNUSDT",
      price: 0.245,
      change24h: 8.4,
      trend: "bullish",
      confidence: 96,
      trendStrengthScore: 92,
      reasoning: "ADX estimado em 45+. O preço subiu verticalmente nos últimos 20 min com volume 3x a média.",
      volume: "Spike Climático",
      support: 0.235,
      resistance: 0.250,
      sparkline: [0.22, 0.22, 0.225, 0.225, 0.23, 0.235, 0.24, 0.242, 0.244, 0.245]
    },
    {
      symbol: "LPTUSDT",
      price: 18.20,
      change24h: 14.2,
      trend: "bullish",
      confidence: 92,
      trendStrengthScore: 88,
      reasoning: "Consistência Sólida: Topos e fundos ascendentes perfeitos no 15m.",
      volume: "Constante",
      support: 17.50,
      resistance: 19.00,
      sparkline: [16.5, 16.8, 17.0, 17.2, 17.1, 17.4, 17.8, 18.0, 18.1, 18.2]
    },
    {
      symbol: "PENDLE",
      price: 2.85,
      change24h: 5.5,
      trend: "bullish",
      confidence: 88,
      trendStrengthScore: 82,
      reasoning: "Rompimento de bandeira de alta. O ADX começou a inclinar para cima agora.",
      volume: "Entrando agora",
      support: 2.70,
      resistance: 3.00,
      sparkline: [2.70, 2.72, 2.71, 2.75, 2.74, 2.78, 2.80, 2.82, 2.84, 2.85]
    }
  ],
  "bearish": [
    {
      symbol: "MEMEUSDT",
      price: 0.024,
      change24h: -12.5,
      trend: "bearish",
      confidence: 95,
      trendStrengthScore: 94,
      reasoning: "Queda livre (Waterfall). ADX alto indicando forte tendência de baixa. Suportes sendo ignorados.",
      volume: "Venda massiva",
      support: 0.022,
      resistance: 0.026,
      sparkline: [0.030, 0.029, 0.028, 0.027, 0.026, 0.026, 0.025, 0.025, 0.0245, 0.024]
    },
    {
      symbol: "APEUSDT",
      price: 1.12,
      change24h: -6.5,
      trend: "bearish",
      confidence: 89,
      trendStrengthScore: 85,
      reasoning: "Perdeu o fundo da semana. Estrutura de baixa clara com topos descendentes no H1.",
      volume: "Acelerando na queda",
      support: 1.05,
      resistance: 1.18,
      sparkline: [1.25, 1.24, 1.22, 1.20, 1.19, 1.18, 1.15, 1.14, 1.13, 1.12]
    },
    {
      symbol: "SANDUSDT",
      price: 0.45,
      change24h: -4.2,
      trend: "bearish",
      confidence: 85,
      trendStrengthScore: 78,
      reasoning: "Rejeição forte na média de 200 períodos. Iniciando nova perna de baixa.",
      volume: "Venda moderada",
      support: 0.42,
      resistance: 0.48,
      sparkline: [0.48, 0.48, 0.47, 0.47, 0.46, 0.46, 0.455, 0.452, 0.45, 0.45]
    }
  ]
};
