import { CurrencyConversionServiceImpl } from '../CurrencyConversionService';

describe('CurrencyConversionService', () => {
  let currencyService: CurrencyConversionServiceImpl;

  beforeEach(() => {
    currencyService = new CurrencyConversionServiceImpl();
  });

  describe('convertToBaseCurrency', () => {
    it('should return same amount when converting to same currency', () => {
      const result = currencyService.convertToBaseCurrency(100, 'USD', 'USD');
      expect(result).toBe(100);
    });

    it('should convert EUR to USD correctly', () => {
      const result = currencyService.convertToBaseCurrency(100, 'EUR', 'USD');
      // 100 EUR * (1/0.85) = 117.65 USD
      expect(result).toBeCloseTo(117.65, 2);
    });

    it('should convert USD to EUR correctly', () => {
      const result = currencyService.convertToBaseCurrency(100, 'USD', 'EUR');
      // 100 USD * 0.85 = 85 EUR
      expect(result).toBeCloseTo(85, 2);
    });

    it('should convert between non-USD currencies correctly', () => {
      const result = currencyService.convertToBaseCurrency(100, 'EUR', 'GBP');
      // 100 EUR -> USD -> GBP: 100 * (1/0.85) * 0.73 = 85.88 GBP
      expect(result).toBeCloseTo(85.88, 2);
    });

    it('should throw error for unsupported currency', () => {
      expect(() => {
        currencyService.convertToBaseCurrency(100, 'INVALID', 'USD');
      }).toThrow('Unsupported currency: INVALID or USD');
    });
  });

  describe('getExchangeRate', () => {
    it('should return 1 for same currency', () => {
      const rate = currencyService.getExchangeRate('USD', 'USD');
      expect(rate).toBe(1);
    });

    it('should return correct USD to EUR rate', () => {
      const rate = currencyService.getExchangeRate('USD', 'EUR');
      expect(rate).toBeCloseTo(1.176, 3); // 1 USD = 1.176 EUR (1/0.85)
    });

    it('should return correct EUR to USD rate', () => {
      const rate = currencyService.getExchangeRate('EUR', 'USD');
      expect(rate).toBe(0.85); // 1 EUR = 0.85 USD
    });

    it('should throw error for unsupported currency', () => {
      expect(() => {
        currencyService.getExchangeRate('INVALID', 'USD');
      }).toThrow('Unsupported currency: INVALID or USD');
    });
  });

  describe('updateExchangeRates', () => {
    it('should update exchange rates correctly', () => {
      currencyService.updateExchangeRates({ EUR: 0.90 });
      const rate = currencyService.getExchangeRate('EUR', 'USD');
      expect(rate).toBe(0.90);
    });

    it('should add new currency rates', () => {
      currencyService.updateExchangeRates({ MXN: 20.0 });
      const rate = currencyService.getExchangeRate('MXN', 'USD');
      expect(rate).toBe(20.0);
    });
  });

  describe('getSupportedCurrencies', () => {
    it('should return all supported currencies', () => {
      const currencies = currencyService.getSupportedCurrencies();
      expect(currencies).toContain('USD');
      expect(currencies).toContain('EUR');
      expect(currencies).toContain('GBP');
      expect(currencies).toContain('CAD');
      expect(currencies).toContain('AUD');
      expect(currencies).toContain('JPY');
      expect(currencies).toContain('CHF');
      expect(currencies).toContain('CNY');
      expect(currencies).toContain('INR');
      expect(currencies).toContain('BRL');
    });
  });
}); 