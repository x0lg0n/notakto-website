import { renderHook, act } from '@testing-library/react';
import { useCoins, useXP, useUser, useMute, useTut } from '../src/services/store';

describe('Zustand Store', () => {
  beforeEach(() => {
    // Clear localStorage before each test to avoid test interference
    localStorage.clear();
  });

  describe('useCoins store', () => {
    it('initializes with default coins value', () => {
      const { result } = renderHook(() => useCoins());
      expect(result.current.coins).toBe(1000);
    });

    it('updates coins correctly', () => {
      const { result } = renderHook(() => useCoins());
      
      act(() => {
        result.current.setCoins(2500);
      });

      expect(result.current.coins).toBe(2500);
    });

    it('persists coins to localStorage', () => {
      const { result } = renderHook(() => useCoins());
      
      act(() => {
        result.current.setCoins(1500);
      });

      // Check if the value was persisted
      expect(result.current.coins).toBe(1500);
      
      // Create a new hook instance to verify persistence
      const { result: newResult } = renderHook(() => useCoins());
      expect(newResult.current.coins).toBe(1500);
    });

    it('handles zero coins', () => {
      const { result } = renderHook(() => useCoins());
      
      act(() => {
        result.current.setCoins(0);
      });

      expect(result.current.coins).toBe(0);
    });

    it('handles negative coins', () => {
      const { result } = renderHook(() => useCoins());
      
      act(() => {
        result.current.setCoins(-100);
      });

      expect(result.current.coins).toBe(-100);
    });

    it('handles large coin amounts', () => {
      const { result } = renderHook(() => useCoins());
      const largeAmount = 999999999;
      
      act(() => {
        result.current.setCoins(largeAmount);
      });

      expect(result.current.coins).toBe(largeAmount);
    });
  });

  describe('useXP store', () => {
    it('initializes with default XP value', () => {
      const { result } = renderHook(() => useXP());
      expect(result.current.XP).toBe(0);
    });

    it('updates XP correctly', () => {
      const { result } = renderHook(() => useXP());
      
      act(() => {
        result.current.setXP(150);
      });

      expect(result.current.XP).toBe(150);
    });

    it('persists XP to localStorage', () => {
      const { result } = renderHook(() => useXP());
      
      act(() => {
        result.current.setXP(300);
      });

      // Check if the value was persisted
      expect(result.current.XP).toBe(300);
      
      // Create a new hook instance to verify persistence
      const { result: newResult } = renderHook(() => useXP());
      expect(newResult.current.XP).toBe(300);
    });

    it('handles progressive XP increases', () => {
      const { result } = renderHook(() => useXP());
      
      act(() => {
        result.current.setXP(50);
      });
      expect(result.current.XP).toBe(50);

      act(() => {
        result.current.setXP(result.current.XP + 25);
      });
      expect(result.current.XP).toBe(75);

      act(() => {
        result.current.setXP(result.current.XP + 100);
      });
      expect(result.current.XP).toBe(175);
    });
  });

  describe('useUser store', () => {
    it('initializes with null user', () => {
      const { result } = renderHook(() => useUser());
      expect(result.current.user).toBeNull();
    });

    it('updates user correctly', () => {
      const { result } = renderHook(() => useUser());
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com'
      };
      
      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('handles user sign out', () => {
      const { result } = renderHook(() => useUser());
      const mockUser = { id: '123', name: 'Test User' };
      
      // Sign in
      act(() => {
        result.current.setUser(mockUser);
      });
      expect(result.current.user).toEqual(mockUser);

      // Sign out
      act(() => {
        result.current.setUser(null);
      });
      expect(result.current.user).toBeNull();
    });

    it('handles different user objects', () => {
      const { result } = renderHook(() => useUser());
      
      const user1 = { id: '1', name: 'User One' };
      const user2 = { id: '2', name: 'User Two', premium: true };
      
      act(() => {
        result.current.setUser(user1);
      });
      expect(result.current.user).toEqual(user1);

      act(() => {
        result.current.setUser(user2);
      });
      expect(result.current.user).toEqual(user2);
    });
  });

  describe('useMute store', () => {
    it('initializes with muted state', () => {
      const { result } = renderHook(() => useMute());
      expect(result.current.mute).toBe(true);
    });

    it('toggles mute state correctly', () => {
      const { result } = renderHook(() => useMute());
      
      // Should start muted
      expect(result.current.mute).toBe(true);
      
      // Unmute
      act(() => {
        result.current.setMute(false);
      });
      expect(result.current.mute).toBe(false);

      // Mute again
      act(() => {
        result.current.setMute(true);
      });
      expect(result.current.mute).toBe(true);
    });

    it('handles toggle functionality', () => {
      const { result } = renderHook(() => useMute());
      
      // Toggle from initial state (true -> false)
      act(() => {
        result.current.setMute(!result.current.mute);
      });
      expect(result.current.mute).toBe(false);

      // Toggle again (false -> true)
      act(() => {
        result.current.setMute(!result.current.mute);
      });
      expect(result.current.mute).toBe(true);
    });
  });

  describe('useTut store', () => {
    it('initializes with tutorial hidden', () => {
      const { result } = renderHook(() => useTut());
      expect(result.current.showTut).toBe(false);
    });

    it('shows tutorial correctly', () => {
      const { result } = renderHook(() => useTut());
      
      act(() => {
        result.current.setShowTut(true);
      });

      expect(result.current.showTut).toBe(true);
    });

    it('hides tutorial correctly', () => {
      const { result } = renderHook(() => useTut());
      
      // Show tutorial first
      act(() => {
        result.current.setShowTut(true);
      });
      expect(result.current.showTut).toBe(true);

      // Hide tutorial
      act(() => {
        result.current.setShowTut(false);
      });
      expect(result.current.showTut).toBe(false);
    });

    it('handles tutorial state toggle', () => {
      const { result } = renderHook(() => useTut());
      
      // Toggle from initial state (false -> true)
      act(() => {
        result.current.setShowTut(!result.current.showTut);
      });
      expect(result.current.showTut).toBe(true);

      // Toggle again (true -> false)
      act(() => {
        result.current.setShowTut(!result.current.showTut);
      });
      expect(result.current.showTut).toBe(false);
    });
  });

  describe('Store isolation', () => {
    it('stores operate independently', () => {
      const coinsHook = renderHook(() => useCoins());
      const xpHook = renderHook(() => useXP());
      const userHook = renderHook(() => useUser());
      const muteHook = renderHook(() => useMute());
      const tutHook = renderHook(() => useTut());

      // Update each store
      act(() => {
        coinsHook.result.current.setCoins(500);
        xpHook.result.current.setXP(100);
        userHook.result.current.setUser({ id: 'test' });
        muteHook.result.current.setMute(false);
        tutHook.result.current.setShowTut(true);
      });

      // Verify each store has its own state
      expect(coinsHook.result.current.coins).toBe(500);
      expect(xpHook.result.current.XP).toBe(100);
      expect(userHook.result.current.user).toEqual({ id: 'test' });
      expect(muteHook.result.current.mute).toBe(false);
      expect(tutHook.result.current.showTut).toBe(true);
    });
  });

  describe('Persistence behavior', () => {
    it('only persisted stores use localStorage', () => {
      const coinsHook = renderHook(() => useCoins());
      const userHook = renderHook(() => useUser());
      
      act(() => {
        coinsHook.result.current.setCoins(100);
        userHook.result.current.setUser({ id: 'test' });
      });

      // Coins should be persisted - create new hook to verify
      const newCoinsHook = renderHook(() => useCoins());
      expect(newCoinsHook.result.current.coins).toBe(100);

      // User should not be persisted - should remain default
      const newUserHook = renderHook(() => useUser());
      expect(newUserHook.result.current.user).toEqual({ id: '' });
    });
  });
});