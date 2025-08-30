import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import WinnerModal from '../../src/modals/WinnerModal';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

describe('WinnerModal Component', () => {
  const mockOnPlayAgain = jest.fn();
  const mockOnMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders nothing when not visible', () => {
    const { container } = render(
      <WinnerModal
        visible={false}
        winner="Player 1"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders modal when visible', () => {
    render(
      <WinnerModal
        visible={true}
        winner="Player 1"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    expect(screen.getByText('Game Over!')).toBeInTheDocument();
    expect(screen.getByText('Player 1 wins')).toBeInTheDocument();
    expect(screen.getByText('Play Again')).toBeInTheDocument();
    expect(screen.getByText('Main Menu')).toBeInTheDocument();
  });

  it('displays "You won!" for "You" winner', () => {
    render(
      <WinnerModal
        visible={true}
        winner="You"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    expect(screen.getByText('You won!')).toBeInTheDocument();
  });

  it('displays winner name for other winners', () => {
    render(
      <WinnerModal
        visible={true}
        winner="Computer"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    expect(screen.getByText('Computer wins')).toBeInTheDocument();
  });

  it('handles Play Again button click', () => {
    render(
      <WinnerModal
        visible={true}
        winner="Player 1"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    const playAgainButton = screen.getByText('Play Again');
    fireEvent.click(playAgainButton);

    expect(mockOnPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('handles Main Menu button click', () => {
    render(
      <WinnerModal
        visible={true}
        winner="Player 1"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    const mainMenuButton = screen.getByText('Main Menu');
    fireEvent.click(mainMenuButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('has correct modal styling', () => {
    const { container } = render(
      <WinnerModal
        visible={true}
        winner="Player 1"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    const modalOverlay = container.firstChild;
    expect(modalOverlay).toHaveClass('fixed', 'inset-0', 'z-50', 'bg-black/50');

    const modalContent = screen.getByText('Game Over!').closest('div');
    expect(modalContent).toHaveClass('bg-black', 'rounded-xl', 'p-6');
  });

  it('displays Game Over title with correct styling', () => {
    render(
      <WinnerModal
        visible={true}
        winner="Player 1"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    const title = screen.getByText('Game Over!');
    expect(title).toHaveClass('text-5xl', 'text-red-600', 'mb-3');
  });

  it('displays winner message with correct styling', () => {
    render(
      <WinnerModal
        visible={true}
        winner="Player 2"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    const winnerMessage = screen.getByText('Player 2 wins');
    expect(winnerMessage).toHaveClass('text-2xl', 'text-red-500', 'mb-6');
  });

  it('has proper button layout', () => {
    render(
      <WinnerModal
        visible={true}
        winner="Player 1"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    const buttonContainer = screen.getByText('Play Again').closest('.flex');
    expect(buttonContainer).toHaveClass('flex', 'justify-between', 'gap-4', 'w-full');
  });

  it('centers modal content', () => {
    const { container } = render(
      <WinnerModal
        visible={true}
        winner="Player 1"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    const modalOverlay = container.firstChild;
    expect(modalOverlay).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('handles different winner names correctly', () => {
    const winners = ['Alice', 'Bob', 'Computer', 'AI', 'Player X'];

    winners.forEach(winner => {
      const { unmount } = render(
        <WinnerModal
          visible={true}
          winner={winner}
          onPlayAgain={mockOnPlayAgain}
          onMenu={mockOnMenu}
        />
      );

      expect(screen.getByText(`${winner} wins`)).toBeInTheDocument();
      unmount();
    });
  });

  it('has correct z-index for modal overlay', () => {
    const { container } = render(
      <WinnerModal
        visible={true}
        winner="Player 1"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    const modalOverlay = container.firstChild;
    expect(modalOverlay).toHaveClass('z-50');
  });

  it('maintains modal responsiveness', () => {
    const { container } = render(
      <WinnerModal
        visible={true}
        winner="Player 1"
        onPlayAgain={mockOnPlayAgain}
        onMenu={mockOnMenu}
      />
    );

    const modalContent = screen.getByText('Game Over!').closest('div');
    expect(modalContent).toHaveClass('w-[80%]', 'max-w-md');
  });
});