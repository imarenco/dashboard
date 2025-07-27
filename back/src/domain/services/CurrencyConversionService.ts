export interface CurrencyConversionService {
  convertToBaseCurrency(amount: number, fromCurrency: string, toCurrency: string): number;
  getExchangeRate(fromCurrency: string, toCurrency: string): number;
}

export class CurrencyConversionServiceImpl implements CurrencyConversionService {
  private exchangeRates: Record<string, number> = {
    // Base currency is USD, so USD rate is 1
    USD: 1,
    // Example exchange rates (in a real app, these would come from an API)
    EUR: 0.85,
    GBP: 0.73,
    CAD: 1.25,
    AUD: 1.35,
    JPY: 110.0,
    CHF: 0.92,
    CNY: 6.45,
    INR: 74.5,
    BRL: 5.2,
  };

  convertToBaseCurrency(amount: number, fromCurrency: string, toCurrency: string = 'USD'): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const fromRate = this.getExchangeRate(fromCurrency, 'USD');
    const toRate = this.getExchangeRate(toCurrency, 'USD');
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  }

  getExchangeRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const fromRate = this.exchangeRates[fromCurrency];
    const toRate = this.exchangeRates[toCurrency];

    if (!fromRate || !toRate) {
      throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
    }

    // Convert from one currency to another via USD
    return fromRate / toRate;
  }

  // Method to update exchange rates (useful for real-time updates)
  updateExchangeRates(newRates: Partial<Record<string, number>>): void {
    this.exchangeRates = { ...this.exchangeRates, ...newRates } as Record<string, number>;
  }

  // Method to get all supported currencies
  getSupportedCurrencies(): string[] {
    return Object.keys(this.exchangeRates);
  }
} 