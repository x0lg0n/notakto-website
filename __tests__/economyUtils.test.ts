import { calculateRewards } from '../src/services/economyUtils';
import type { DifficultyLevel, BoardSize } from '../src/services/types';

describe('Economy Utils', () => {
  describe('calculateRewards', () => {
    // Mock Math.random to make tests deterministic
    let mockRandom: jest.SpyInstance;
    
    beforeEach(() => {
      // Mock random to return predictable values
      mockRandom = jest.spyOn(Math, 'random');
    });

    afterEach(() => {
      mockRandom.mockRestore();
    });

    it('awards coins and XP for wins', () => {
      // Mock Math.random to return consistent values
      mockRandom
        .mockReturnValueOnce(0.5) // coinMultiplier = 3 (Math.trunc(0.5*5)+1)
        .mockReturnValueOnce(0.5); // xpMultiplier = 8 (Math.trunc(0.5*5)+6)

      const result = calculateRewards(true, 3, 2, 3);
      
      const baseMultiplier = 3 * 2 * 3; // difficulty * numberOfBoards * boardSize = 18
      expect(result.coins).toBe(baseMultiplier * 3); // 18 * 3 = 54
      expect(result.xp).toBe(baseMultiplier * 8); // 18 * 8 = 144
    });

    it('awards no coins but XP for losses', () => {
      mockRandom
        .mockReturnValueOnce(0.8) // coinMultiplier = 5 (not used for losses)
        .mockReturnValueOnce(0.2); // xpMultiplier = 7 (not used for losses)

      const result = calculateRewards(false, 2, 3, 4);
      
      const baseMultiplier = 2 * 3 * 4; // 24
      expect(result.coins).toBe(0);
      expect(result.xp).toBe(baseMultiplier); // Base multiplier only for losses
    });

    it('scales rewards with difficulty level', () => {
      mockRandom
        .mockReturnValueOnce(0) // coinMultiplier = 1
        .mockReturnValueOnce(0); // xpMultiplier = 6

      const easyResult = calculateRewards(true, 1, 2, 3);
      const hardResult = calculateRewards(true, 5, 2, 3);
      
      expect(hardResult.coins).toBe(easyResult.coins * 5);
      expect(hardResult.xp).toBe(easyResult.xp * 5);
    });

    it('scales rewards with number of boards', () => {
      mockRandom
        .mockReturnValueOnce(0) // coinMultiplier = 1
        .mockReturnValueOnce(0); // xpMultiplier = 6

      const singleBoardResult = calculateRewards(true, 3, 1, 3);
      const multiBoardResult = calculateRewards(true, 3, 4, 3);
      
      expect(multiBoardResult.coins).toBe(singleBoardResult.coins * 4);
      expect(multiBoardResult.xp).toBe(singleBoardResult.xp * 4);
    });

    it('scales rewards with board size', () => {
      mockRandom
        .mockReturnValueOnce(0) // coinMultiplier = 1
        .mockReturnValueOnce(0); // xpMultiplier = 6

      const smallBoardResult = calculateRewards(true, 3, 2, 2);
      const largeBoardResult = calculateRewards(true, 3, 2, 5);
      
      expect(largeBoardResult.coins).toBe(smallBoardResult.coins * 2.5);
      expect(largeBoardResult.xp).toBe(smallBoardResult.xp * 2.5);
    });

    it('handles edge case with minimum values', () => {
      mockRandom
        .mockReturnValueOnce(0) // coinMultiplier = 1
        .mockReturnValueOnce(0); // xpMultiplier = 6

      const result = calculateRewards(true, 1, 1, 2);
      
      const baseMultiplier = 1 * 1 * 2; // 2
      expect(result.coins).toBe(2 * 1); // 2
      expect(result.xp).toBe(2 * 6); // 12
    });

    it('handles edge case with maximum values', () => {
      mockRandom
        .mockReturnValueOnce(0.99) // coinMultiplier = 5 (Math.trunc(0.99*5)+1)
        .mockReturnValueOnce(0.99); // xpMultiplier = 10 (Math.trunc(0.99*5)+6)

      const result = calculateRewards(true, 5, 5, 5);
      
      const baseMultiplier = 5 * 5 * 5; // 125
      expect(result.coins).toBe(baseMultiplier * 5); // 625
      expect(result.xp).toBe(baseMultiplier * 10); // 1250
    });

    it('uses random multipliers correctly', () => {
      // Test that coinMultiplier is between 1-5 and xpMultiplier is between 6-10
      const results = [];
      
      for (let i = 0; i < 100; i++) {
        mockRandom
          .mockReturnValueOnce(Math.random())
          .mockReturnValueOnce(Math.random());
          
        const result = calculateRewards(true, 1, 1, 1);
        results.push(result);
      }

      results.forEach(result => {
        expect(result.coins).toBeGreaterThanOrEqual(1); // min: 1*1 = 1
        expect(result.coins).toBeLessThanOrEqual(5);    // max: 1*5 = 5
        expect(result.xp).toBeGreaterThanOrEqual(6);    // min: 1*6 = 6
        expect(result.xp).toBeLessThanOrEqual(10);      // max: 1*10 = 10
      });
    });

    it('maintains consistent base multiplier calculation', () => {
      mockRandom
        .mockReturnValueOnce(0) // coinMultiplier = 1
        .mockReturnValueOnce(0); // xpMultiplier = 6

      const testCases: Array<[boolean, DifficultyLevel, number, BoardSize]> = [
        [true, 1, 1, 2],
        [true, 3, 2, 3],
        [true, 5, 3, 4],
        [false, 2, 4, 5]
      ];

      testCases.forEach(([isWin, difficulty, numberOfBoards, boardSize]) => {
        const result = calculateRewards(isWin, difficulty, numberOfBoards, boardSize);
        const expectedBase = difficulty * numberOfBoards * boardSize;
        
        if (isWin) {
          expect(result.coins).toBe(expectedBase * 1); // coinMultiplier = 1
          expect(result.xp).toBe(expectedBase * 6); // xpMultiplier = 6
        } else {
          expect(result.coins).toBe(0);
          expect(result.xp).toBe(expectedBase);
        }
      });
    });
  });
});