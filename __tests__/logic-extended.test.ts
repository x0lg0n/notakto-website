import { isBoardDead } from '../src/services/logic';
import type { BoardState } from '../src/services/types';

describe('Logic Service - Extended Tests', () => {
  describe('isBoardDead - Additional Edge Cases', () => {
    it('handles empty boards correctly', () => {
      const board: BoardState = ['', '', '', '', '', '', '', '', ''];
      expect(isBoardDead(board, 3)).toBe(false);
    });

    it('handles single cell boards', () => {
      expect(isBoardDead([''], 1)).toBe(false);
      expect(isBoardDead(['X'], 1)).toBe(true);
    });

    it('handles 2x2 boards correctly', () => {
      // Row win
      const rowWin: BoardState = ['X', 'X', '', ''];
      expect(isBoardDead(rowWin, 2)).toBe(true);

      // Column win
      const colWin: BoardState = ['X', '', 'X', ''];
      expect(isBoardDead(colWin, 2)).toBe(true);

      // Main diagonal win
      const diagWin: BoardState = ['X', '', '', 'X'];
      expect(isBoardDead(diagWin, 2)).toBe(true);

      // Anti-diagonal win
      const antiDiagWin: BoardState = ['', 'X', 'X', ''];
      expect(isBoardDead(antiDiagWin, 2)).toBe(true);

      // No win
      const noWin: BoardState = ['X', '', '', ''];
      expect(isBoardDead(noWin, 2)).toBe(false);
    });

    it('correctly handles larger board sizes', () => {
      // 5x5 board with first row filled
      const board5x5: BoardState = [
        'X', 'X', 'X', 'X', 'X',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', ''
      ];
      expect(isBoardDead(board5x5, 5)).toBe(true);

      // 5x5 board with almost complete row
      const almostWin5x5: BoardState = [
        'X', 'X', 'X', 'X', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', ''
      ];
      expect(isBoardDead(almostWin5x5, 5)).toBe(false);
    });

    it('detects column wins in different positions', () => {
      // First column
      const firstCol: BoardState = ['X', '', '', 'X', '', '', 'X', '', ''];
      expect(isBoardDead(firstCol, 3)).toBe(true);

      // Middle column
      const middleCol: BoardState = ['', 'X', '', '', 'X', '', '', 'X', ''];
      expect(isBoardDead(middleCol, 3)).toBe(true);

      // Last column
      const lastCol: BoardState = ['', '', 'X', '', '', 'X', '', '', 'X'];
      expect(isBoardDead(lastCol, 3)).toBe(true);
    });

    it('detects row wins in different positions', () => {
      // First row
      const firstRow: BoardState = ['X', 'X', 'X', '', '', '', '', '', ''];
      expect(isBoardDead(firstRow, 3)).toBe(true);

      // Middle row
      const middleRow: BoardState = ['', '', '', 'X', 'X', 'X', '', '', ''];
      expect(isBoardDead(middleRow, 3)).toBe(true);

      // Last row
      const lastRow: BoardState = ['', '', '', '', '', '', 'X', 'X', 'X'];
      expect(isBoardDead(lastRow, 3)).toBe(true);
    });

    it('handles mixed content correctly', () => {
      // Board with mixed X and other characters - only X counts for wins
      const mixedBoard: BoardState = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
      expect(isBoardDead(mixedBoard, 3)).toBe(true); // Main diagonal is all X

      // Mixed board without win
      const noWinMixed: BoardState = ['X', 'O', '', 'O', 'X', '', '', 'O', 'X'];
      expect(isBoardDead(noWinMixed, 3)).toBe(false);
    });

    it('performance test with larger boards', () => {
      // Create a 10x10 board with diagonal win
      const size = 10;
      const largeBoard: BoardState = Array(size * size).fill('');
      
      // Fill main diagonal with X
      for (let i = 0; i < size; i++) {
        largeBoard[i * (size + 1)] = 'X';
      }

      expect(isBoardDead(largeBoard, size)).toBe(true);
    });

    it('validates board size parameter consistency', () => {
      // 3x3 board checked as 4x4 should return false (no valid 4x4 wins)
      const board3x3: BoardState = ['X', 'X', 'X', '', '', '', '', '', ''];
      expect(isBoardDead(board3x3, 4)).toBe(false);

      // 4x4 board checked as 3x3 could give unexpected results
      const board4x4: BoardState = [
        'X', 'X', 'X', 'X',
        '', '', '', '',
        '', '', '', '',
        '', '', '', ''
      ];
      // When interpreted as 3x3, first 9 cells are ['X', 'X', 'X', 'X', '', '', '', '', '']
      // First row: ['X', 'X', 'X'] - this is a win
      expect(isBoardDead(board4x4.slice(0, 9), 3)).toBe(true);
    });

    it('handles boards with all cells filled but no wins', () => {
      const noWinFull: BoardState = [
        'X', 'O', 'X',
        'O', 'O', 'X',
        'O', 'X', 'O'
      ];
      expect(isBoardDead(noWinFull, 3)).toBe(false);
    });

    it('verifies both diagonals are checked correctly', () => {
      // Test main diagonal (top-left to bottom-right)
      const mainDiag4x4: BoardState = [
        'X', '', '', '',
        '', 'X', '', '',
        '', '', 'X', '',
        '', '', '', 'X'
      ];
      expect(isBoardDead(mainDiag4x4, 4)).toBe(true);

      // Test anti-diagonal (top-right to bottom-left)
      const antiDiag4x4: BoardState = [
        '', '', '', 'X',
        '', '', 'X', '',
        '', 'X', '', '',
        'X', '', '', ''
      ];
      expect(isBoardDead(antiDiag4x4, 4)).toBe(true);
    });
  });
});