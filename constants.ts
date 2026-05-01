import { MarketAnalysisData, Timeframe } from './types';

export const getGeminiPrompt = (timeframe: Timeframe): string => {
  // Define o intervalo de "Frescor" baseado no timeframe escolhido
  let freshnessWindow = '15 minutes';
  if (timeframe === '1h' || timeframe === '4h') freshnessWindow = 'last hour';
  if (timeframe === '1m' || timeframe === '3m' || timeframe === '5m') freshnessWindow = 'last 15 minutes';

  return `
Atue como um **Algoritmo de HFT com Foco em ADX e Volatilidade Bilateral**.

🎯 **OBJETIVO:** Gerar duas listas distintas: **TOP 3-5 BULLISH** e **TOP 3-5 BEARISH**.

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

### 📊 CRITÉRIOS TÉCNICOS:
1. **ADX & Convicção:** 
   - ADX > 25 + Direção Ascendente = Recomendação "Chico Bento Original" (Rompimento).
   - ADX < 20 ou Direção Descendente = Recomendação "Chico Bento Reverso" (Fading/Liquidez).
2. **Teste dos 15 Períodos:** Máximas/Mínimas renovadas nos últimos ${freshnessWindow}.
3. **Cálculo de Risco:** Estime volatilidade (ATR) para SL/TP de 1:1 rigoroso.

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
* Em todos os "reasoning": "Explique a análise técnica incluindo OBRIGATORIAMENTE o valor especifico do ADX e por que ele indica força ou fraqueza."

---

### 📤 FORMATO DE SAÍDA (JSON Obrigatório):

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

**NOTA:** Tente preencher pelo menos 3 slots em 'bullish' e 3 slots em 'bearish'. Se o mercado estiver caindo muito, preencha mais o bearish.
`;
};

export const DEMO_DATA: MarketAnalysisData = {
  "timestamp": "2026-05-01T14:25:34Z",
  "summary": "O mercado demonstra uma transição de regime após a expansão de momentum observada em ativos como FET e SOL. O fluxo global apresenta sinais de consolidação em topos locais, com o ADX começando a divergir entre ativos de alta e média capitalização.",
  "marketHealth": {
    "projection": "Intermittent",
    "flowState": "Median",
    "score": 58,
    "reasoning": "Embora o momentum de curto prazo tenha sido validado por rompimentos de volume (SOL/FET), a sustentação acima das resistências BKM ainda carece de confirmação macro, favorecendo o monitoramento de exaustão."
  },
  "bullish": [
    {
      "symbol": "FETUSDT",
      "price": 0.2003,
      "adx": {
        "value": 31.4,
        "trend": "Rising"
      },
      "strategy": "Chico Bento Original",
      "trendStrengthScore": 85,
      "reasoning": "Rompimento de topo com volume clímax e ADX em forte ascensão acima de 25, indicando continuidade do momentum.",
      "support": 0.1988,
      "resistance": 0.2021,
      "execution": {
        "entry": 0.2021,
        "sl": 0.2005,
        "tp": 0.2037
      }
    },
    {
      "symbol": "SOLUSDT",
      "price": 84.36,
      "adx": {
        "value": 29.8,
        "trend": "Rising"
      },
      "strategy": "Chico Bento Original",
      "trendStrengthScore": 78,
      "reasoning": "Ativo em modo rompimento compra (6/10) com ADX ascendente validando a força da tendência atual.",
      "support": 84.12,
      "resistance": 84.55,
      "execution": {
        "entry": 84.55,
        "sl": 84.41,
        "tp": 84.69
      }
    },
    {
      "symbol": "TAOUSDT",
      "price": 182.45,
      "adx": {
        "value": 26.2,
        "trend": "Rising"
      },
      "strategy": "Chico Bento Original",
      "trendStrengthScore": 65,
      "reasoning": "Recuperação de médias móveis curtas com ADX cruzando o limiar de 25, sugerindo nova fase de expansão.",
      "support": 180.08,
      "resistance": 185.30,
      "execution": {
        "entry": 185.30,
        "sl": 183.90,
        "tp": 186.70
      }
    }
  ],
  "bearish": [
    {
      "symbol": "WIFUSDT",
      "price": 0.1850,
      "adx": {
        "value": 18.5,
        "trend": "Falling"
      },
      "strategy": "Chico Bento Reverso",
      "trendStrengthScore": 72,
      "reasoning": "ADX abaixo de 20 e caindo indica ausência de tendência; rompimentos de topo são prováveis capturas de liquidez.",
      "support": 0.1795,
      "resistance": 0.1874,
      "execution": {
        "entry": 0.1874,
        "sl": 0.1882,
        "tp": 0.1866
      }
    },
    {
      "symbol": "NEARUSDT",
      "price": 1.312,
      "adx": {
        "value": 19.2,
        "trend": "Falling"
      },
      "strategy": "Chico Bento Reverso",
      "trendStrengthScore": 55,
      "reasoning": "Baixa volatilidade direcional favorece operações de retorno à média em extremidades de range.",
      "support": 1.291,
      "resistance": 1.329,
      "execution": {
        "entry": 1.329,
        "sl": 1.334,
        "tp": 1.324
      }
    },
    {
      "symbol": "LTCUSDT",
      "price": 72.15,
      "adx": {
        "value": 21.0,
        "trend": "Flat"
      },
      "strategy": "Chico Bento Reverso",
      "trendStrengthScore": 48,
      "reasoning": "Estagnação de preço em resistência histórica com ADX sem inclinação, sugerindo falha de rompimento.",
      "support": 70.80,
      "resistance": 73.20,
      "execution": {
        "entry": 73.20,
        "sl": 73.65,
        "tp": 72.75

    }
  ]
};
