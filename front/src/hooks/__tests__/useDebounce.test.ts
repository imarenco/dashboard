import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should debounce function calls', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebounce(mockCallback, 500));

    // Call the debounced function multiple times quickly
    act(() => {
      result.current('test1');
      result.current('test2');
      result.current('test3');
    });

    // Function should not be called immediately
    expect(mockCallback).not.toHaveBeenCalled();

    // Fast-forward time by 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Function should be called only once with the last argument
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('test3');
  });

  it('should reset timer on each call', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebounce(mockCallback, 500));

    // First call
    act(() => {
      result.current('first');
    });

    // Advance time by 300ms (less than 500ms)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Function should not be called yet
    expect(mockCallback).not.toHaveBeenCalled();

    // Second call (should reset timer)
    act(() => {
      result.current('second');
    });

    // Advance time by 300ms again (total 600ms, but timer was reset)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Function should not be called yet
    expect(mockCallback).not.toHaveBeenCalled();

    // Advance time by 200ms more (total 500ms from last call)
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Function should be called with the last argument
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('second');
  });

  it('should handle multiple arguments', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebounce(mockCallback, 500));

    act(() => {
      result.current('arg1', 'arg2', 123);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });

  it('should work with different delay times', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebounce(mockCallback, 1000));

    act(() => {
      result.current('test');
    });

    // Advance time by 500ms (less than 1000ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockCallback).not.toHaveBeenCalled();

    // Advance time by 500ms more (total 1000ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockCallback).toHaveBeenCalledWith('test');
  });

  it('should handle zero delay', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebounce(mockCallback, 0));

    act(() => {
      result.current('test');
    });

    // Function should be called immediately with zero delay
    // Need to flush timers for zero delay
    act(() => {
      jest.runAllTimers();
    });

    expect(mockCallback).toHaveBeenCalledWith('test');
  });
}); 