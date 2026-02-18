// binanceService.ts - Versão Otimizada
export const getLivePrice = async (symbol: string): Promise<number> => {
  try {
    // Trocamos para o endpoint mais leve
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    if (!response.ok) throw new Error('Falha na resposta da Binance');
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Erro ao buscar preço para ${symbol}:`, error);
    return 0;
  }
};