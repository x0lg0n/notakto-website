import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Board from '../../src/app/vsComputer/Board';
import type { BoardState } from '../../src/services/types';

describe('Board Component', () => {
  const mockMakeMove = jest.fn();

  beforeEach(() => {
    mockMakeMove.mockClear();
  });

  it('renders empty 3x3 board correctly', () => {
    const boardState: BoardState = ['', '', '', '', '', '', '', '', ''];
    
    render(
      <Board 
        boardIndex={0}
        boardState={boardState}
        makeMove={mockMakeMove}
        isDead={false}
        boardSize={3}
      />
    );

    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(9);
  });

  it('renders board with X marks correctly', () => {
    const boardState: BoardState = ['X', '', 'X', '', '', '', '', '', ''];
    
    render(
      <Board 
        boardIndex={0}
        boardState={boardState}
        makeMove={mockMakeMove}
        isDead={false}
        boardSize={3}
      />
    );

    const xCells = screen.getAllByText('X');
    expect(xCells).toHaveLength(2);
  });

  it('applies correct grid layout for different board sizes', () => {
    const boardState4x4: BoardState = Array(16).fill('');
    
    const { container } = render(
      <Board 
        boardIndex={0}
        boardState={boardState4x4}
        makeMove={mockMakeMove}
        isDead={false}
        boardSize={4}
      />
    );

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveStyle({
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))'
    });

    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(16);
  });

  it('handles cell clicks correctly', () => {
    const boardState: BoardState = ['', '', '', '', '', '', '', '', ''];
    
    render(
      <Board 
        boardIndex={1}
        boardState={boardState}
        makeMove={mockMakeMove}
        isDead={false}
        boardSize={3}
      />
    );

    const cells = screen.getAllByRole('button');
    fireEvent.click(cells[4]); // Click center cell

    expect(mockMakeMove).toHaveBeenCalledWith(1, 4);
  });

  it('disables cells when board is dead', () => {
    const boardState: BoardState = ['X', '', '', '', '', '', '', '', ''];
    
    render(
      <Board 
        boardIndex={0}
        boardState={boardState}
        makeMove={mockMakeMove}
        isDead={true}
        boardSize={3}
      />
    );

    const cells = screen.getAllByRole('button');
    cells.forEach(cell => {
      expect(cell).toBeDisabled();
    });
  });

  it('applies opacity when board is dead', () => {
    const boardState: BoardState = ['X', 'X', 'X', '', '', '', '', '', ''];
    
    const { container } = render(
      <Board 
        boardIndex={0}
        boardState={boardState}
        makeMove={mockMakeMove}
        isDead={true}
        boardSize={3}
      />
    );

    const boardContainer = container.firstChild;
    expect(boardContainer).toHaveClass('opacity-60');
  });

  it('does not apply opacity when board is alive', () => {
    const boardState: BoardState = ['X', 'X', '', '', '', '', '', '', ''];
    
    const { container } = render(
      <Board 
        boardIndex={0}
        boardState={boardState}
        makeMove={mockMakeMove}
        isDead={false}
        boardSize={3}
      />
    );

    const boardContainer = container.firstChild;
    expect(boardContainer).not.toHaveClass('opacity-60');
  });

  it('prevents clicks on filled cells', () => {
    const boardState: BoardState = ['X', '', '', '', '', '', '', '', ''];
    
    render(
      <Board 
        boardIndex={0}
        boardState={boardState}
        makeMove={mockMakeMove}
        isDead={false}
        boardSize={3}
      />
    );

    const cells = screen.getAllByRole('button');
    const filledCell = cells[0];
    
    expect(filledCell).toBeDisabled();
    fireEvent.click(filledCell);
    expect(mockMakeMove).not.toHaveBeenCalled();
  });

  it('allows clicks on empty cells in alive boards', () => {
    const boardState: BoardState = ['X', '', '', '', '', '', '', '', ''];
    
    render(
      <Board 
        boardIndex={2}
        boardState={boardState}
        makeMove={mockMakeMove}
        isDead={false}
        boardSize={3}
      />
    );

    const cells = screen.getAllByRole('button');
    const emptyCell = cells[1];
    
    expect(emptyCell).not.toBeDisabled();
    fireEvent.click(emptyCell);
    expect(mockMakeMove).toHaveBeenCalledWith(2, 1);
  });

  it('handles different board sizes correctly', () => {
    const testCases = [
      { size: 2, expectedCells: 4 },
      { size: 3, expectedCells: 9 },
      { size: 4, expectedCells: 16 },
      { size: 5, expectedCells: 25 }
    ];

    testCases.forEach(({ size, expectedCells }) => {
      const boardState: BoardState = Array(expectedCells).fill('');
      
      const { unmount } = render(
        <Board 
          boardIndex={0}
          boardState={boardState}
          makeMove={mockMakeMove}
          isDead={false}
          boardSize={size}
        />
      );

      const cells = screen.getAllByRole('button');
      expect(cells).toHaveLength(expectedCells);
      
      unmount(); // Clean up for next iteration
    });
  });

  it('maintains aspect ratio for square boards', () => {
    const boardState: BoardState = ['', '', '', '', '', '', '', '', ''];
    
    const { container } = render(
      <Board 
        boardIndex={0}
        boardState={boardState}
        makeMove={mockMakeMove}
        isDead={false}
        boardSize={3}
      />
    );

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveStyle({
      aspectRatio: '1/1'
    });
  });

  it('passes correct parameters to makeMove for different positions', () => {
    const boardState: BoardState = Array(9).fill('');
    
    render(
      <Board 
        boardIndex={3}
        boardState={boardState}
        makeMove={mockMakeMove}
        isDead={false}
        boardSize={3}
      />
    );

    const cells = screen.getAllByRole('button');
    
    // Test corner cells
    fireEvent.click(cells[0]); // Top-left
    expect(mockMakeMove).toHaveBeenLastCalledWith(3, 0);
    
    fireEvent.click(cells[2]); // Top-right
    expect(mockMakeMove).toHaveBeenLastCalledWith(3, 2);
    
    fireEvent.click(cells[6]); // Bottom-left
    expect(mockMakeMove).toHaveBeenLastCalledWith(3, 6);
    
    fireEvent.click(cells[8]); // Bottom-right
    expect(mockMakeMove).toHaveBeenLastCalledWith(3, 8);
    
    // Test center
    fireEvent.click(cells[4]); // Center
    expect(mockMakeMove).toHaveBeenLastCalledWith(3, 4);

    expect(mockMakeMove).toHaveBeenCalledTimes(5);
  });
});