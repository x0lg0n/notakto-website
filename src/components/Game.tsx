import React, { useState } from 'react';
import Board from './Board';
import LiveMode from './LiveMode';
import { GameProps } from '../services/types';
const PAY_URL="https://curious-comfortable-puck.glitch.me";

const Game: React.FC<GameProps> = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleBuyCoins = async () => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch(`${PAY_URL}/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: '1.00',
          currency: 'INR',
          customerId: 'user_123',
          customerName: 'Test User',
        }),
      });

      const data = await response.json();
      if (data.success) {
        window.open(data.paymentUrl, '_blank');
        checkPaymentStatus(data.chargeId);
      } else {
        alert('Payment Failed: Could not initiate payment. Please try again.');
      }
    } catch (error) {
      alert('Error: Payment processing failed.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const checkPaymentStatus = async (orderId: string) => {
    try {
      const response = await fetch(`${PAY_URL}/order-status/${orderId}`);
      const data = await response.json();

      if (data.status === 'paid') {
        alert('Success! 100 coins added to your account!');
        props.onAddCoins?.(100);
      } else {
        setTimeout(() => checkPaymentStatus(orderId), 5000);
      }
    } catch (error) {
      alert('Error verifying payment status.');
    }
  };

  if (props.gameMode === 'liveMatch') {
    return <LiveMode onClose={props.exitToMenu} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="flex-1">
        <div className="flex flex-col items-center px-6 py-4 -mb-8">
          {props.gameMode === 'vsComputer' && (
            <div className="flex flex-row justify-center items-center -mt-2">
              <span className="text-red-600 text-[35px] font-[pixelvt]">Coins: {props.coins}</span>
              <span className="text-red-600 text-[35px] font-[pixelvt]"> | XP: {props.experience}</span>
            </div>
          )}
          <h2 className="text-red-600 text-[80px] font-[pixelvt] mb-5 text-center">{props.currentPlayer}</h2>
        </div>

        <div className="flex flex-wrap justify-center pb-5">
          {props.boards.map((board, index) => (
            <Board
              key={index}
              boardIndex={index}
              boardState={board}
              makeMove={props.makeMove}
              isDead={props.isBoardDead(board)}
              boardSize={props.boardSize}
            />
          ))}
        </div>

        <div className="relative bottom-0 left-0 right-0 flex justify-center items-center bg-blue-600 px-6 py-4">
          <button onClick={toggleMenu} className="text-white text-[35px] font-[pixelfont]">Settings</button>
        </div>

        {isMenuOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-60 z-50">
            <div className="w-full h-full" onClick={toggleMenu}></div>
            <div className="p-4 absolute inset-0 flex flex-col items-center gap-2 z-50">
              <button onClick={props.onBoardConfigPress} className="w-full bg-blue-600 py-4 text-white text-[30px] font-[pixelvt]">Game Configuration</button>

              {props.gameMode === 'vsPlayer' && (
                <button onClick={props.onResetNames} className="w-full bg-blue-600 py-4 text-white text-[30px] font-[pixelvt]">Reset Names</button>
              )}

              {props.gameMode === 'vsComputer' && (
                <>
                  <button
                    onClick={props.onUndo}
                    disabled={!props.canUndo}
                    className={`w-full py-4 text-white text-[30px] font-[pixelvt] ${!props.canUndo ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600'}`}
                  >
                    Undo (100 coins)
                  </button>
                  <button
                    onClick={props.onSkip}
                    disabled={!props.canSkip}
                    className={`w-full py-4 text-white text-[30px] font-[pixelvt] ${!props.canSkip ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600'}`}
                  >
                    Skip a Move (200 coins)
                  </button>
                  <button
                    onClick={handleBuyCoins}
                    disabled={isProcessingPayment}
                    className={`w-full flex justify-center items-center gap-2 py-4 text-white text-[30px] font-[pixelvt] ${isProcessingPayment ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600'}`}
                  >
                    {isProcessingPayment && <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />}
                    {isProcessingPayment ? 'Processing...' : 'Buy Coins (100)'}
                  </button>
                </>
              )}

              <button onClick={props.resetGame} className="w-full bg-blue-600 py-4 text-white text-[30px] font-[pixelvt]">Reset</button>

              {props.gameMode === 'vsComputer' && (
                <button onClick={props.onDifficultyPress!} className="w-full bg-blue-600 py-4 text-white text-[30px] font-[pixelvt]">
                  AI Level: {props.difficulty}
                </button>
              )}

              <button onClick={props.toggleMute} className="w-full bg-blue-600 py-4 text-white text-[30px] font-[pixelvt]">
                Sound: {props.isMuted ? 'Off' : 'On'}
              </button>

              <button onClick={props.exitToMenu} className="w-full bg-blue-600 py-4 text-white text-[30px] font-[pixelvt]">Main Menu</button>
              <button onClick={toggleMenu} className="w-full bg-blue-600 py-4 text-white text-[30px] font-[pixelvt]">Return to Game</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
