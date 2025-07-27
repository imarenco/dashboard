import { renderHook, act } from '@testing-library/react'
import { useSocket } from '../useSocket'
import { io } from 'socket.io-client'

// Mock socket.io-client
jest.mock('socket.io-client')

const mockSocket = {
  on: jest.fn(),
  emit: jest.fn(),
  off: jest.fn(),
  close: jest.fn(),
}

describe('useSocket', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(io as jest.Mock).mockReturnValue(mockSocket)
  })

  it('should initialize socket connection', () => {
    renderHook(() => useSocket())

    expect(io).toHaveBeenCalledWith('http://localhost:5001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  })

  it('should set up connection event handlers', () => {
    renderHook(() => useSocket())

    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function))
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function))
    expect(mockSocket.on).toHaveBeenCalledWith('connect_error', expect.any(Function))
    expect(mockSocket.on).toHaveBeenCalledWith('reconnect', expect.any(Function))
  })

  it('should join dashboard room on connect', () => {
    renderHook(() => useSocket())

    // Get the connect handler
    const connectCall = mockSocket.on.mock.calls.find(call => call[0] === 'connect')
    const connectHandler = connectCall[1]

    // Simulate connect event
    act(() => {
      connectHandler()
    })

    expect(mockSocket.emit).toHaveBeenCalledWith('join-dashboard')
  })

  it('should leave dashboard room on cleanup', () => {
    const { unmount } = renderHook(() => useSocket())

    unmount()

    expect(mockSocket.emit).toHaveBeenCalledWith('leave-dashboard')
    expect(mockSocket.close).toHaveBeenCalled()
  })

  it('should provide onNewTransaction callback', () => {
    const { result } = renderHook(() => useSocket())
    const mockCallback = jest.fn()

    result.current.onNewTransaction(mockCallback)

    expect(mockSocket.on).toHaveBeenCalledWith('newTransaction', mockCallback)
  })

  it('should provide onAnalyticsUpdate callback', () => {
    const { result } = renderHook(() => useSocket())
    const mockCallback = jest.fn()

    result.current.onAnalyticsUpdate(mockCallback)

    expect(mockSocket.on).toHaveBeenCalledWith('analyticsUpdate', mockCallback)
  })

  it('should provide offNewTransaction callback', () => {
    const { result } = renderHook(() => useSocket())

    result.current.offNewTransaction()

    expect(mockSocket.off).toHaveBeenCalledWith('newTransaction')
  })

  it('should provide offAnalyticsUpdate callback', () => {
    const { result } = renderHook(() => useSocket())

    result.current.offAnalyticsUpdate()

    expect(mockSocket.off).toHaveBeenCalledWith('analyticsUpdate')
  })

  it('should track connection state', () => {
    const { result } = renderHook(() => useSocket())

    // Initially should be false (not connected yet)
    expect(result.current.isConnected).toBe(false)

    // Get the connect handler and simulate connection
    const connectCall = mockSocket.on.mock.calls.find(call => call[0] === 'connect')
    const connectHandler = connectCall[1]

    act(() => {
      connectHandler()
    })

    // Now should be connected
    expect(result.current.isConnected).toBe(true)

    // Get the disconnect handler
    const disconnectCall = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect')
    const disconnectHandler = disconnectCall[1]

    // Simulate disconnect
    act(() => {
      disconnectHandler()
    })

    expect(result.current.isConnected).toBe(false)
  })
}) 