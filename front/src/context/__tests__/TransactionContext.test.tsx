import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { TransactionProvider, useTransactionContext } from '../TransactionContext'
import { api } from '@/lib/api'

// Mock the API
jest.mock('@/lib/api')
const mockApi = api as jest.Mocked<typeof api>

// Mock the socket hook
jest.mock('@/hooks/useSocket')
const mockUseSocket = require('@/hooks/useSocket').useSocket

// Test component to access context
const TestComponent = () => {
  const { 
    transactions, 
    loading, 
    error, 
    searchTerm,
    setSearchTerm,
    addTransaction,
    searchTransactions 
  } = useTransactionContext()

  return (
    <div>
      <div data-testid="transactions-count">{transactions.length}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="search-term">{searchTerm}</div>
      <button onClick={() => setSearchTerm('test')}>Set Search</button>
      <button onClick={() => addTransaction({
        id: '1',
        customerName: 'Test User',
        amount: 100,
        currency: 'USD',
        createdAt: new Date().toISOString()
      })}>Add Transaction</button>
      <button onClick={() => searchTransactions('test')}>Search</button>
      <button onClick={() => searchTransactions('John')}>Search John</button>
    </div>
  )
}

describe('TransactionContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSocket.mockReturnValue({
      onNewTransaction: jest.fn(),
      onAnalyticsUpdate: jest.fn(),
    })
    // Mock initial API call
    mockApi.getTransactions.mockResolvedValue([])
  })

  it('should provide initial state', async () => {
    render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>
    )

    // Wait for initial data fetching to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('transactions-count')).toHaveTextContent('0')
    expect(screen.getByTestId('error')).toHaveTextContent('no-error')
    expect(screen.getByTestId('search-term')).toHaveTextContent('')
  })

  it('should set search term', async () => {
    render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>
    )

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    fireEvent.click(screen.getByText('Set Search'))
    expect(screen.getByTestId('search-term')).toHaveTextContent('test')
  })

  it('should add transaction', async () => {
    render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>
    )

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    fireEvent.click(screen.getByText('Add Transaction'))
    expect(screen.getByTestId('transactions-count')).toHaveTextContent('1')
  })

  it('should search transactions', async () => {
    const mockTransactions = [
      {
        id: '1',
        customerName: 'Test User',
        amount: 100,
        currency: 'USD',
        createdAt: new Date().toISOString()
      }
    ]
    mockApi.getTransactions.mockResolvedValue(mockTransactions)

    render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>
    )

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Search'))
    })

    await waitFor(() => {
      expect(mockApi.getTransactions).toHaveBeenCalledWith()
    })
  })

  it('should handle search error', async () => {
    mockApi.getTransactions.mockRejectedValue(new Error('Search failed'))

    render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>
    )

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Search'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Search failed')
    })
  })

  it('should filter transactions by search term', async () => {
    const mockTransactions = [
      {
        id: '1',
        customerName: 'John Doe',
        amount: 100,
        currency: 'USD',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        amount: 200,
        currency: 'EUR',
        createdAt: new Date().toISOString()
      }
    ]
    mockApi.getTransactions.mockResolvedValue(mockTransactions)

    render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>
    )

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByTestId('transactions-count')).toHaveTextContent('2')
    })

    // Then search for "John" which should match one transaction
    await act(async () => {
      fireEvent.click(screen.getByText('Search John'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('transactions-count')).toHaveTextContent('1')
    })
  })
}) 