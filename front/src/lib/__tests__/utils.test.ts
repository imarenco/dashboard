import { generateTransactionKey, areTransactionsDuplicate } from '../utils';
import { Transaction } from '@/types/transaction';

describe('utils', () => {
  const mockTransaction1: Transaction = {
    id: '123',
    customerName: 'John Doe',
    amount: 100,
    createdAt: '2023-01-01T00:00:00.000Z'
  };

  const mockTransaction2: Transaction = {
    id: '456',
    customerName: 'Jane Smith',
    amount: 200,
    createdAt: '2023-01-02T00:00:00.000Z'
  };

  describe('generateTransactionKey', () => {
    it('should generate a unique key for a transaction', () => {
      const key = generateTransactionKey(mockTransaction1);
      expect(key).toBe('123-2023-01-01T00:00:00.000Z-John Doe-100');
    });

    it('should generate different keys for different transactions', () => {
      const key1 = generateTransactionKey(mockTransaction1);
      const key2 = generateTransactionKey(mockTransaction2);
      expect(key1).not.toBe(key2);
    });

    it('should generate the same key for identical transactions', () => {
      const identicalTransaction: Transaction = {
        id: '123',
        customerName: 'John Doe',
        amount: 100,
        createdAt: '2023-01-01T00:00:00.000Z'
      };
      
      const key1 = generateTransactionKey(mockTransaction1);
      const key2 = generateTransactionKey(identicalTransaction);
      expect(key1).toBe(key2);
    });
  });

  describe('areTransactionsDuplicate', () => {
    it('should return true for identical transactions', () => {
      const identicalTransaction: Transaction = {
        id: '123',
        customerName: 'John Doe',
        amount: 100,
        createdAt: '2023-01-01T00:00:00.000Z'
      };
      
      expect(areTransactionsDuplicate(mockTransaction1, identicalTransaction)).toBe(true);
    });

    it('should return false for different transactions', () => {
      expect(areTransactionsDuplicate(mockTransaction1, mockTransaction2)).toBe(false);
    });

    it('should return true for transactions with same ID but different other fields', () => {
      const sameIdTransaction: Transaction = {
        id: '123',
        customerName: 'Different Name',
        amount: 999,
        createdAt: '2023-12-31T23:59:59.999Z'
      };
      
      expect(areTransactionsDuplicate(mockTransaction1, sameIdTransaction)).toBe(false);
    });

    it('should return true for transactions with different ID but same other fields', () => {
      const sameFieldsTransaction: Transaction = {
        id: '999',
        customerName: 'John Doe',
        amount: 100,
        createdAt: '2023-01-01T00:00:00.000Z'
      };
      
      expect(areTransactionsDuplicate(mockTransaction1, sameFieldsTransaction)).toBe(false);
    });
  });
}); 