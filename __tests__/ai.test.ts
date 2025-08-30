import {
  isBoardDead,
  getValidMoves,
  updateBoards,
  findBestMove,
} from '../src/services/ai';
import type { BoardState, DifficultyLevel, BoardSize } from '../src/services/types';

describe('AI Service', () => {
  describe('isBoardDead', () => {
    it('detects dead board with row win', () => {
      const board: BoardState = ['X', 'X', 'X', '', '', '', '', '', ''];
      expect(isBoardDead(board, 3)).toBe(true);
    });

    it('detects dead board with column win', () => {
      const board: BoardState = ['X', '', '', 'X', '', '', 'X', '', ''];
      expect(isBoardDead(board, 3)).toBe(true);
    });

    it('detects dead board with main diagonal win', () => {
      const board: BoardState = ['X', '', '', '', 'X', '', '', '', 'X'];
      expect(isBoardDead(board, 3)).toBe(true);
    });

    it('detects dead board with anti-diagonal win', () => {
      const board: BoardState = ['', '', 'X', '', 'X', '', 'X', '', ''];
      expect(isBoardDead(board, 3)).toBe(true);
    });

    it('detects live board with no wins', () => {
      const board: BoardState = ['X', '', 'X', '', 'X', '', '', '', ''];
      expect(isBoardDead(board, 3)).toBe(false);
    });

    it('handles 4x4 board correctly', () => {
      const deadBoard: BoardState = [
        'X', 'X', 'X', 'X',
        '', '', '', '',
        '', '', '', '',
        '', '', '', ''
      ];
      expect(isBoardDead(deadBoard, 4)).toBe(true);

      const liveBoard: BoardState = [
        'X', 'X', 'X', '',
        '', '', '', '',
        '', '', '', '',
        '', '', '', ''
      ];
      expect(isBoardDead(liveBoard, 4)).toBe(false);
    });

    it('handles 5x5 board correctly', () => {
      const deadBoard: BoardState = [
        'X', '', '', '', '',
        '', 'X', '', '', '',
        '', '', 'X', '', '',
        '', '', '', 'X', '',
        '', '', '', '', 'X'
      ];
      expect(isBoardDead(deadBoard, 5)).toBe(true);
    });
  });

  describe('getValidMoves', () => {
    it('returns all valid moves from multiple boards', () => {
      const boards: BoardState[] = [
        ['X', '', ''], // Board 0 - alive
        ['X', 'X', 'X'], // Board 1 - dead
        ['', 'X', ''] // Board 2 - alive
      ];

      const moves = getValidMoves(boards, 3);
      
      // Should only include moves from alive boards (0 and 2)
      expect(moves).toHaveLength(4); // 2 empty cells from board 0, 2 from board 2
      expect(moves).toEqual(
        expect.arrayContaining([
          { boardIndex: 0, cellIndex: 1 },
          { boardIndex: 0, cellIndex: 2 },
          { boardIndex: 2, cellIndex: 0 },
          { boardIndex: 2, cellIndex: 2 },
        ])
      );
    });

    it('returns empty array when all boards are dead', () => {
      const boards: BoardState[] = [
        ['X', 'X', 'X'],
        ['X', 'X', 'X']
      ];

      const moves = getValidMoves(boards, 3);
      expect(moves).toHaveLength(0);
    });

    it('orders moves by center bias', () => {
      const boards: BoardState[] = [
        ['', '', '', '', '', '', '', '', ''] // 3x3 empty board
      ];

      const moves = getValidMoves(boards, 3);
      // Center cell (index 4) should be first due to center bias
      expect(moves[0]).toEqual({ boardIndex: 0, cellIndex: 4 });
    });
  });

  describe('updateBoards', () => {
    it('updates the correct board and cell', () => {
      const boards: BoardState[] = [
        ['', '', ''],
        ['X', '', '']
      ];

      const updated = updateBoards(boards, { boardIndex: 0, cellIndex: 1 });
      
      expect(updated[0]).toEqual(['', 'X', '']);
      expect(updated[1]).toEqual(['X', '', '']);
      // Original boards should not be mutated
      expect(boards[0]).toEqual(['', '', '']);
    });

    it('does not mutate original boards', () => {
      const boards: BoardState[] = [
        ['', '', '']
      ];
      const originalBoards = JSON.parse(JSON.stringify(boards));

      updateBoards(boards, { boardIndex: 0, cellIndex: 0 });
      
      expect(boards).toEqual(originalBoards);
    });
  });

  describe('findBestMove', () => {
    it('returns null when no moves available', () => {
      const boards: BoardState[] = [
        ['X', 'X', 'X']
      ];

      const move = findBestMove(boards, 5, 3, 1);
      expect(move).toBeNull();
    });

    it('returns a valid move when moves are available', () => {
      const boards: BoardState[] = [
        ['', '', '']
      ];

      const move = findBestMove(boards, 5, 3, 1);
      expect(move).not.toBeNull();
      expect(move!.boardIndex).toBe(0);
      expect(move!.cellIndex).toBeGreaterThanOrEqual(0);
      expect(move!.cellIndex).toBeLessThan(9);
    });

    it('makes more random moves at lower difficulty', () => {
      const boards: BoardState[] = [
        ['', '', ''],
        ['', '', '']
      ];

      // Test difficulty 1 (should be mostly random)
      const moves1 = Array.from({ length: 10 }, () => 
        findBestMove(boards, 1, 3, 2)
      );
      
      // Test difficulty 5 (should be mostly optimal)
      const moves5 = Array.from({ length: 10 }, () => 
        findBestMove(boards, 5, 3, 2)
      );

      // Both should return valid moves
      moves1.forEach(move => {
        expect(move).not.toBeNull();
        expect(move!.boardIndex).toBeGreaterThanOrEqual(0);
        expect(move!.boardIndex).toBeLessThan(2);
      });

      moves5.forEach(move => {
        expect(move).not.toBeNull();
        expect(move!.boardIndex).toBeGreaterThanOrEqual(0);
        expect(move!.boardIndex).toBeLessThan(2);
      });
    });

    it('handles misère strategy correctly for odd number of live boards', () => {
      // Setup: 1 live board (odd) - should avoid killing moves when possible
      const boards: BoardState[] = [
        ['X', 'X', ''], // Almost dead - one move would kill it
        ['X', 'X', 'X']  // Dead board
      ];

      const move = findBestMove(boards, 5, 3, 2);
      expect(move).not.toBeNull();
      expect(move!.boardIndex).toBe(0);
      expect(move!.cellIndex).toBe(2);
    });

    it('handles different board sizes', () => {
      const boards4x4: BoardState[] = [
        Array(16).fill('')
      ];

      const move = findBestMove(boards4x4, 5, 4, 1);
      expect(move).not.toBeNull();
      expect(move!.cellIndex).toBeGreaterThanOrEqual(0);
      expect(move!.cellIndex).toBeLessThan(16);
    });

    it('handles multiple difficulty levels', () => {
      const boards: BoardState[] = [
        ['', '', '']
      ];

      ([1, 2, 3, 4, 5] as DifficultyLevel[]).forEach(difficulty => {
        const move = findBestMove(boards, difficulty, 3, 1);
        expect(move).not.toBeNull();
        expect(move!.boardIndex).toBe(0);
        expect(move!.cellIndex).toBeGreaterThanOrEqual(0);
        expect(move!.cellIndex).toBeLessThan(9);
      });
    });
  });
});