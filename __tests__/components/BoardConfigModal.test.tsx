import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BoardConfigModal from '../../src/modals/BoardConfigModal';
import type { BoardSize, BoardNumber } from '../../src/services/types';

describe('BoardConfigModal Component', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when not visible', () => {
    const { container } = render(
      <BoardConfigModal
        visible={false}
        currentBoards={2}
        currentSize={3}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders modal when visible', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={2}
        currentSize={3}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Number of Boards')).toBeInTheDocument();
    expect(screen.getByText('Board Size')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('displays all board number options', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={2}
        currentSize={3}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Check all board numbers 1-5 are present
    [1, 2, 3, 4, 5].forEach(num => {
      expect(screen.getByText(num.toString())).toBeInTheDocument();
    });
  });

  it('displays all board size options', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={2}
        currentSize={3}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Check all board sizes 2x2 to 5x5 are present
    [2, 3, 4, 5].forEach(size => {
      expect(screen.getByText(`${size}x${size}`)).toBeInTheDocument();
    });
  });

  it('highlights current board selection', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={3}
        currentSize={4}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const selectedBoardButton = screen.getByText('3');
    expect(selectedBoardButton).toHaveClass('bg-red-600');

    // Other board buttons should have bg-blue-600
    const unselectedBoardButton = screen.getByText('1');
    expect(unselectedBoardButton).toHaveClass('bg-blue-600');
  });

  it('highlights current size selection', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={2}
        currentSize={4}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const selectedSizeButton = screen.getByText('4x4');
    expect(selectedSizeButton).toHaveClass('bg-red-600');

    // Other size buttons should have bg-blue-600
    const unselectedSizeButton = screen.getByText('2x2');
    expect(unselectedSizeButton).toHaveClass('bg-blue-600');
  });

  it('allows changing board number selection', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={2}
        currentSize={3}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const boardButton4 = screen.getByText('4');
    fireEvent.click(boardButton4);

    // Button should now be highlighted
    expect(boardButton4).toHaveClass('bg-red-600');
    
    // Previous selection should no longer be highlighted
    const boardButton2 = screen.getByText('2');
    expect(boardButton2).toHaveClass('bg-blue-600');
  });

  it('allows changing board size selection', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={2}
        currentSize={3}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const sizeButton5x5 = screen.getByText('5x5');
    fireEvent.click(sizeButton5x5);

    // Button should now be highlighted
    expect(sizeButton5x5).toHaveClass('bg-red-600');
    
    // Previous selection should no longer be highlighted
    const sizeButton3x3 = screen.getByText('3x3');
    expect(sizeButton3x3).toHaveClass('bg-blue-600');
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={2}
        currentSize={3}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm with current selections when Apply is clicked', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={2}
        currentSize={3}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);

    expect(mockOnConfirm).toHaveBeenCalledWith(2, 3);
  });

  it('calls onConfirm with updated selections', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={2}
        currentSize={3}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Change selections
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('4x4'));

    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);

    expect(mockOnConfirm).toHaveBeenCalledWith(5, 4);
  });

  it('has correct modal styling', () => {
    const { container } = render(
      <BoardConfigModal
        visible={true}
        currentBoards={2}
        currentSize={3}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const modalOverlay = container.firstChild;
    expect(modalOverlay).toHaveClass(
      'fixed',
      'inset-0',
      'bg-black/80',
      'flex',
      'items-center',
      'justify-center',
      'z-50'
    );

    const modalContent = screen.getByText('Number of Boards').closest('div');
    expect(modalContent).toHaveClass(
      'bg-black',
      'p-6',
      'w-[90%]',
      'max-w-xl',
      'text-center',
      'space-y-6'
    );
  });

  it('has correct button styling', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={1}
        currentSize={2}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Check board number button styling
    const boardButtons = screen.getAllByText(/^[1-5]$/);
    boardButtons.forEach(button => {
      expect(button).toHaveClass('min-w-[60px]', 'px-4', 'py-2', 'text-white', 'text-xl');
    });

    // Check action buttons styling
    const cancelButton = screen.getByText('Cancel');
    const applyButton = screen.getByText('Apply');

    [cancelButton, applyButton].forEach(button => {
      expect(button).toHaveClass(
        'flex-1',
        'py-3',
        'bg-blue-600',
        'text-white',
        'text-xl',
        'hover:bg-blue-700'
      );
    });
  });

  it('maintains responsive layout', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={2}
        currentSize={3}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Check flex layouts
    const boardButtonsContainer = screen.getByText('1').closest('.flex');
    expect(boardButtonsContainer).toHaveClass('flex', 'flex-wrap', 'gap-2', 'justify-center');

    const actionButtonsContainer = screen.getByText('Cancel').closest('.flex');
    expect(actionButtonsContainer).toHaveClass('flex', 'gap-4', 'pt-2');
  });

  it('handles all board and size combinations', () => {
    const boardNumbers = [1, 2, 3, 4, 5] as BoardNumber[];
    const boardSizes = [2, 3, 4, 5] as BoardSize[];

    boardNumbers.forEach(boards => {
      boardSizes.forEach(size => {
        const { unmount } = render(
          <BoardConfigModal
            visible={true}
            currentBoards={boards}
            currentSize={size}
            onConfirm={mockOnConfirm}
            onCancel={mockOnCancel}
          />
        );

        // Verify current selections are highlighted
        expect(screen.getByText(boards.toString())).toHaveClass('bg-red-600');
        expect(screen.getByText(`${size}x${size}`)).toHaveClass('bg-red-600');

        unmount();
      });
    });
  });

  it('preserves state during interaction', () => {
    render(
      <BoardConfigModal
        visible={true}
        currentBoards={1}
        currentSize={2}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    // Change board number
    fireEvent.click(screen.getByText('4'));
    // Change board size
    fireEvent.click(screen.getByText('5x5'));
    // Change board number again
    fireEvent.click(screen.getByText('3'));

    // Final state should be 3 boards, 5x5 size
    fireEvent.click(screen.getByText('Apply'));
    expect(mockOnConfirm).toHaveBeenCalledWith(3, 5);
  });
});