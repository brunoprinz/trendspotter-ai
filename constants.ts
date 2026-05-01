import { MarketAnalysisData, Timeframe } from './types';

export const getGeminiPrompt = (timeframe: Timeframe): string => {
  // Define o intervalo de "Frescor" baseado no timeframe escolhido
  let freshnessWindow = '15 minutes';
  if (timeframe === '1h' || timeframe === '4h') freshnessWindow = 'last hour';
  if (timeframe === '1m' || timeframe === '3m' || timeframe === '5m') freshnessWindow = 'last 15 minutes';

  return `
// Atue como um Algoritmo de HFT com Foco em ADX, Volatilidade Bilateral e Gestão de Risco.

⚠️ REGRA DE OURO SOBRE PREÇOS: Nunca altere a escala decimal do ativo. Use o ticker completo (ex: FETUSDT).

🎯 OBJETIVO: Gerar OBRIGATORIAMENTE duas listas: 3-5 BULLISH e 3-5 BEARISH.

### 📊 CRITÉRIOS TÉCNICOS:
1. **ADX & Convicção:** 
   - ADX > 25 + Direção Ascendente = Recomendação "Chico Bento Original" (Rompimento).
   - ADX < 20 ou Direção Descendente = Recomendação "Chico Bento Reverso" (Fading/Liquidez).
2. **Teste dos 15 Períodos:** Máximas/Mínimas renovadas nos últimos ${freshnessWindow}.
3. **Cálculo de Risco:** Estime volatilidade (ATR) para SL/TP de 1:1 rigoroso.

---

### 📊 CRITÉRIOS DE ANÁLISE AVANÇADA (ADX & VOLUME):

Para cada moeda, você deve calcular/estimar um 'trendStrengthScore' (0-100) baseado em 3 pilares:

1.  **ADX (Força da Tendência):**
    *   Se há muitas velas sobrepostas (overlap) = Score Baixo (<50).
    *   Se o movimento é vertical e sem pausas = Score Alto (>80).
    *   Conceito: Busque ativos onde o ADX estaria acima de 25 e subindo.

2.  **Consistência de Volume:**
    *   O volume deve aumentar na direção da tendência.
    *   Velas de rompimento (seja de alta ou baixa) devem ter volume pelo menos 2x a média.

3.  **Teste dos 15 Períodos (Adaptado):**
    *   Alta: Preço renovando MÁXIMAS nos últimos ${freshnessWindow}.
    *   Baixa: Preço renovando MÍNIMAS nos últimos ${freshnessWindow}.
    *   Nota: Se o ativo inverteu a direção nos últimos 5 minutos, descarte. Queremos continuidade.

---

### 🏥 MARKET HEALTH PROJECTION (NOVO - Seção Extra):
Além de listar os ativos, analise o comportamento histórico macro (Diário/Semanal) dos ativos identificados.
*   Consistent: O fluxo é limpo? Os ativos seguem topos e fundos claros também no gráfico diário?
*   Median: O fluxo é bom no curto prazo, mas contra a tendência macro ou lateral no diário.
*   Intermittent: Alta volatilidade, pavios longos, "rabiscos" no gráfico. Difícil operar.

Gere um diagnóstico: 'Consistent Upward', 'Median Downward', 'Intermittent Volatility', etc.

---

### 🕵️‍♂️ PARÂMETROS DE BUSCA (Busque ambos os lados):
*   Lado Compra: "Binance futures top gainers ${freshnessWindow}", "Crypto breakout strong volume"
*   Lado Venda: "Binance futures top losers ${freshnessWindow}", "Crypto breakdown support levels", "Coins dumping right now"

---

### 📤 FORMATO DE SAÍDA (JSON ESTRITO):
{
  "timestamp": "ISO Date String",
  "summary": "Resumo do cenário atual.",
  "marketHealth": {
    "projection": "Consistent Upward/Downward/Intermittent",
    "flowState": "Consistent/Median/Intermittent",
    "score": 0,
    "reasoning": "Breve explicação macro."
  },
  "bullish": [
    {
      "symbol": "TICKERUSDT",
      "price": 0.00,
      "adx": {
        "value": 0.00,
        "trend": "Rising/Falling/Flat"
      },
      "strategy": "Chico Bento Original ou Chico Bento Reverso",
      "trendStrengthScore": 0,
      "reasoning": "Análise técnica com foco no ADX.",
      "support": 0.00,
      "resistance": 0.00,
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
      "adx": {
        "value": 0.00,
        "trend": "Rising/Falling/Flat"
      },
      "strategy": "Chico Bento Original ou Chico Bento Reverso",
      "trendStrengthScore": 0,
      "reasoning": "Análise técnica com foco no ADX.",
      "support": 0.00,
      "resistance": 0.00,
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

export const DEMO_DATA: MarketAnalysisData = {
  timestamp: new Date().toISOString(),
  summary: "Sistema inicializado. Aguardando comando de varredura...",
  marketHealth: {
    projection: "Intermittent",
    flowState: "Median",
    score: 50,
    reasoning: "Pronto para analisar o ADX e Volatilidade."
  },
  bullish: [
    {
      symbol: "WAITING",
      price: 0,
      adx: { value: 0, trend: "Flat" },
      strategy: "Chico Bento Original",
      trendStrengthScore: 0,
      reasoning: "Aguardando dados...",
      support: 0,
      resistance: 0,
      execution: { entry: 0, sl: 0, tp: 0 }
    }
  ],
  bearish: [
    {
      symbol: "WAITING",
      price: 0,
      adx: { value: 0, trend: "Flat" },
      strategy: "Chico Bento Reverso",
      trendStrengthScore: 0,
      reasoning: "Aguardando dados...",
      support: 0,
      resistance: 0,
      execution: { entry: 0, sl: 0, tp: 0 }
    }
  ]
};
