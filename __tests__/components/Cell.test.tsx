import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cell from '../../src/app/vsComputer/Cell';

describe('Cell Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders empty cell correctly', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value=""
        onPress={mockOnPress}
        disabled={false}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toBeInTheDocument();
    expect(cell).not.toBeDisabled();
    expect(cell).toHaveTextContent('');
  });

  it('renders cell with X value correctly', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value="X"
        onPress={mockOnPress}
        disabled={false}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toHaveTextContent('X');
    expect(cell).toBeDisabled(); // Should be disabled when has value
  });

  it('handles click on empty cell', () => {
    render(
      <Cell
        boardIndex={1}
        cellIndex={5}
        value=""
        onPress={mockOnPress}
        disabled={false}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    fireEvent.click(cell);

    expect(mockOnPress).toHaveBeenCalledWith(1, 5);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('prevents click when cell has value', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value="X"
        onPress={mockOnPress}
        disabled={false}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toBeDisabled();
    
    fireEvent.click(cell);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('prevents click when disabled', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value=""
        onPress={mockOnPress}
        disabled={true}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toBeDisabled();
    
    fireEvent.click(cell);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('applies correct styling for enabled cell', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value=""
        onPress={mockOnPress}
        disabled={false}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toHaveClass('bg-black');
    expect(cell).toHaveClass('hover:bg-gray-900');
    expect(cell).not.toHaveClass('bg-gray-800');
  });

  it('applies correct styling for disabled cell', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value=""
        onPress={mockOnPress}
        disabled={true}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toHaveClass('bg-gray-800');
    expect(cell).not.toHaveClass('bg-black');
  });

  it('has correct aspect ratio', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value=""
        onPress={mockOnPress}
        disabled={false}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toHaveClass('aspect-square');
  });

  it('has border styling', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value=""
        onPress={mockOnPress}
        disabled={false}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toHaveClass('border');
    expect(cell).toHaveClass('border-gray-300');
  });

  it('centers content correctly', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value="X"
        onPress={mockOnPress}
        disabled={false}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toHaveClass('flex');
    expect(cell).toHaveClass('items-center');
    expect(cell).toHaveClass('justify-center');
  });

  it('styles X text correctly', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value="X"
        onPress={mockOnPress}
        disabled={false}
        boardSize={3}
      />
    );

    const xText = screen.getByText('X');
    expect(xText).toHaveClass('text-red-600');
    expect(xText).toHaveClass('text-5xl');
    expect(xText).toHaveStyle({
      lineHeight: '1',
      filter: 'drop-shadow(0 0 2px rgba(255,0,0,0.5))'
    });
  });

  it('handles different board indices and cell indices', () => {
    const testCases = [
      { boardIndex: 0, cellIndex: 0 },
      { boardIndex: 1, cellIndex: 8 },
      { boardIndex: 2, cellIndex: 4 },
      { boardIndex: 3, cellIndex: 15 },
    ];

    testCases.forEach(({ boardIndex, cellIndex }) => {
      const { unmount } = render(
        <Cell
          boardIndex={boardIndex}
          cellIndex={cellIndex}
          value=""
          onPress={mockOnPress}
          disabled={false}
          boardSize={4}
        />
      );

      const cell = screen.getByRole('button');
      fireEvent.click(cell);
      
      expect(mockOnPress).toHaveBeenLastCalledWith(boardIndex, cellIndex);
      
      unmount();
      mockOnPress.mockClear();
    });
  });

  it('handles different values correctly', () => {
    const testValues = ['', 'X', 'O', '?'];

    testValues.forEach(value => {
      const { unmount } = render(
        <Cell
          boardIndex={0}
          cellIndex={0}
          value={value}
          onPress={mockOnPress}
          disabled={false}
          boardSize={3}
        />
      );

      const cell = screen.getByRole('button');
      
      if (value) {
        expect(cell).toHaveTextContent(value);
        expect(cell).toBeDisabled();
      } else {
        expect(cell).toHaveTextContent('');
        expect(cell).not.toBeDisabled();
      }
      
      unmount();
    });
  });

  it('maintains button semantics', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value=""
        onPress={mockOnPress}
        disabled={false}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell.tagName).toBe('BUTTON');
  });

  it('handles mouse interactions correctly', () => {
    render(
      <Cell
        boardIndex={0}
        cellIndex={0}
        value=""
        onPress={mockOnPress}
        disabled={false}
        boardSize={3}
      />
    );

    const cell = screen.getByRole('button');
    
    // Test mouse enter/leave for hover effects
    fireEvent.mouseEnter(cell);
    fireEvent.mouseLeave(cell);
    
    // Test click
    fireEvent.click(cell);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});