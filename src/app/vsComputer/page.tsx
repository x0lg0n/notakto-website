'use client'

import { useEffect, useState } from 'react';
import Board from './Board';
import { BoardSize, BoardState, DifficultyLevel } from '@/services/types';
import { isBoardDead } from '@/services/logic';
import { playMoveSound, playWinSound } from '@/services/sounds';
import { useMute } from '@/services/store';
import { useRouter } from 'next/navigation';
import WinnerModal from '../../modals/WinnerModal';
import BoardConfigModal from '../../modals/BoardConfigModal';
import { useCoins, useXP } from '@/services/store';
import DifficultyModal from '../../modals/DifficultyModal';
import { findBestMove } from '@/services/ai';
import { calculateRewards } from '@/services/economyUtils';
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { handleBuyCoins } from '@/services/payment';


const Game = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [boards, setBoards] = useState<BoardState[]>([]);
    const [boardSize, setBoardSize] = useState<BoardSize>(3);
    const [gameHistory, setGameHistory] = useState<BoardState[][]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [winner, setWinner] = useState<string>('');
    const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
    const [numberOfBoards, setNumberOfBoards] = useState<number>(3);
    const [showBoardConfig, setShowBoardConfig] = useState<boolean>(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
    const [showDifficultyModal, setShowDifficultyModal] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
    const [sessionId, setSessionId] = useState<string>('');
    
    const mute = useMute((state) => state.mute);
    const setMute = useMute((state) => state.setMute);
    const Coins = useCoins((state) => state.coins);
    const setCoins = useCoins((state) => state.setCoins);
    const XP = useXP((state) => state.XP);
    const setXP = useXP((state) => state.setXP);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const { canShowToast, triggerToastCooldown } = useToastCooldown(4000);

    // Initialize game from server
  const initGame = async (num: number, size: BoardSize, diff: DifficultyLevel) => {
    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          numberOfBoards: num,
          boardSize: size,
          difficulty: diff
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSessionId(data.sessionId);
        setBoards(data.gameState.boards);
        setCurrentPlayer(data.gameState.currentPlayer);
        setBoardSize(data.gameState.boardSize);
        setNumberOfBoards(data.gameState.numberOfBoards);
        setDifficulty(data.gameState.difficulty);
        setGameHistory(data.gameState.gameHistory);
      } else {
        toast.error('Failed to initialize game');
        // Fallback to client-side initialization
        const initialBoards = Array(num).fill(null).map(() => Array(size * size).fill(''));
        setBoards(initialBoards);
        setCurrentPlayer(1);
        setGameHistory([initialBoards]);
      }
    } catch (error) {
      toast.error('Error initializing game');
      // Fallback to client-side initialization
      const initialBoards = Array(num).fill(null).map(() => Array(size * size).fill(''));
      setBoards(initialBoards);
      setCurrentPlayer(1);
      setGameHistory([initialBoards]);
    }
  };
    
    const makeMove = (boardIndex: number, cellIndex: number) => {
        if (boards[boardIndex][cellIndex] !== '' || isBoardDead(boards[boardIndex], boardSize)) return;

        const newBoards = boards.map((board, idx) =>
            idx === boardIndex ? [
                ...board.slice(0, cellIndex),
                'X',
                ...board.slice(cellIndex + 1)
            ] : [...board]
        );
        playMoveSound(mute);
        setBoards(newBoards);
        setGameHistory([...gameHistory, newBoards]);

        if (newBoards.every(board => isBoardDead(board, boardSize))) {
            const loser = currentPlayer;
            const winner = loser === 1 ? 2 : 1;
            const isHumanWinner = winner === 1;
            const rewards = calculateRewards(isHumanWinner, difficulty, numberOfBoards, boardSize);

            if (isHumanWinner) {
                setCoins(Coins + rewards.coins);
                setXP(XP + rewards.xp);
            } else {
                setXP(Math.round(XP + rewards.xp * 0.25));
            }
            const winnerName = winner === 1 ? "You" : "Computer";
            setWinner(winnerName);
            setShowWinnerModal(true);
            playWinSound(mute);
            return;
        }

        setCurrentPlayer(prev => prev === 1 ? 2 : 1);
    };

    const resetGame = (num: number, size: BoardSize) => {
        const initialBoards = Array(num).fill(null).map(() => Array(size * size).fill(''));
        setBoards(initialBoards);
        setCurrentPlayer(1);
        setGameHistory([initialBoards]);
        setShowWinnerModal(false);
    };
    const handleBoardConfigChange = (num: number, size: number) => {
        setNumberOfBoards(Math.min(5, Math.max(1, num)));
        setBoardSize(size as BoardSize);
        setShowBoardConfig(false);
        resetGame(num, size as BoardSize);
    };
    const handleUndo = () => {
        if (gameHistory.length >= 3) {
            if (Coins >= 100) {
                setCoins(Coins - 100);
                setBoards(gameHistory[gameHistory.length - 3]);
                setGameHistory(h => h.slice(0, -2));
            } else if (canShowToast()) {
                toast('Insufficient Coins. You need at least 100 coins to undo!', { autoClose: 4500 });
                triggerToastCooldown();
            }
        } else if (canShowToast()) {
            toast('No Moves available to undo!', { autoClose: 4500 });
            triggerToastCooldown();
        }
    };
    const handleSkip = () => {
        if (Coins >= 200) {
            setCoins(Coins - 200);
            setCurrentPlayer(prev => prev === 1 ? 2 : 1);
        } else if (canShowToast()) {
            toast('Insufficient Coins. You need at least 200 coins to skip!', { autoClose: 4500 });
            triggerToastCooldown();
        }
    };

    const router = useRouter();
    const exitToMenu = () => {
        router.push('/');
    }

    useEffect(() => {
        resetGame(numberOfBoards, boardSize);
    }, []);

    useEffect(() => {
        if (currentPlayer === 2) {
            const timeout = setTimeout(() => {
                try {
                    const move = findBestMove(boards, difficulty, boardSize, numberOfBoards);
                    if (move) {
                        makeMove(move.boardIndex, move.cellIndex);
                    }
                } catch (error) {
                    console.error("Error finding the best move:", error);
                }
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentPlayer, boards, difficulty, boardSize, numberOfBoards]);

    return (
        <div className="flex flex-col min-h-screen bg-black relative">
            <div className="flex-1">
                <div className="flex flex-col items-center px-6 py-4 -mb-8">
                    <div className="flex flex-row justify-center items-center -mt-2">
                        <span className="text-red-600 text-[35px] ">Coins: {Coins}</span>
                        <span className="text-red-600 text-[35px] "> | XP: {XP}</span>
                    </div>

                    <h2 className="text-red-600 text-[80px] mb-5 text-center">{currentPlayer == 1 ? "You" : "Computer"}</h2>
                </div>

                <div className="flex flex-wrap justify-center gap-4 p-4 w-full mb-20">
                    {boards.map((board, index) => (
                        <div key={index} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.3%-1.5rem)]" style={{ maxWidth: '400px' }}>
                            <Board
                                boardIndex={index}
                                boardState={board}
                                makeMove={makeMove}
                                isDead={isBoardDead(board, boardSize)}
                                boardSize={boardSize}
                            />
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center bg-blue-600 px-6 py-2 mt-2">
                    <button onClick={toggleMenu} className="text-white text-[35px]">Settings</button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 z-[9999] flex items-center justify-center px-4 overflow-y-auto">
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl py-8">
                        <button onClick={() => {
                            resetGame(numberOfBoards, boardSize);
                            setIsMenuOpen(false);
                        }} className="w-full sm:w-[45%] bg-blue-600 py-4 text-white text-[30px]">
                            Reset
                        </button>
                        <button onClick={() => {
                            setShowBoardConfig(!showBoardConfig);
                            setIsMenuOpen(false);
                        }
                        } className="w-full sm:w-[45%] bg-blue-600 py-4 text-white text-[30px]">
                            Game Configuration
                        </button>
                        <button
                            onClick={() => {
                                handleUndo();
                                setIsMenuOpen(false);
                            }}
                            disabled={Coins < 100}
                            className={`w-full sm:w-[45%] py-4 text-white text-[30px] ${Coins < 100 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600'}`}
                        >
                            Undo (100 coins)
                        </button>
                        <button
                            onClick={() => {
                                handleSkip();
                                setIsMenuOpen(false);
                            }}
                            disabled={Coins < 200}
                            className={`w-full sm:w-[45%] py-4 text-white text-[30px] ${Coins < 200 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600'}`}
                        >
                            Skip a Move (200 coins)
                        </button>
                        <button
                            onClick={() => handleBuyCoins(setIsProcessingPayment, canShowToast, triggerToastCooldown, setCoins, Coins)}
                            disabled={isProcessingPayment}
                            className={`w-full sm:w-[45%] flex justify-center items-center gap-2 py-4 text-white text-[30px] ${isProcessingPayment ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600'}`}
                        >
                            {isProcessingPayment && <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />}
                            {isProcessingPayment ? 'Processing...' : 'Buy Coins (100)'}
                        </button>
                        <button onClick={() => {
                            setShowDifficultyModal(true);
                            setIsMenuOpen(false);
                        }}
                            className="w-full sm:w-[45%] bg-blue-600 py-4 text-white text-[30px]"
                        >
                            AI Level: {difficulty}
                        </button>
                        <button onClick={() => setMute(!mute)} className="w-full sm:w-[45%] bg-blue-600 py-4 text-white text-[30px]">
                            Sound: {mute ? 'Off' : 'On'}
                        </button>
                        <button onClick={exitToMenu} className="w-full sm:w-[45%] bg-blue-600 py-4 text-white text-[30px]">
                            Main Menu
                        </button>
                        <button onClick={toggleMenu} className="w-full sm:w-[45%] bg-blue-600 py-4 text-white text-[30px]">
                            Return to Game
                        </button>
                    </div>
                </div>
            )}
            <WinnerModal
                visible={showWinnerModal}
                winner={winner}
                onPlayAgain={() => {
                    setShowWinnerModal(false);
                    resetGame(numberOfBoards, boardSize);
                }}
                onMenu={() => {
                    setShowWinnerModal(false);
                }}
            />
            <BoardConfigModal
                visible={showBoardConfig}
                currentBoards={numberOfBoards}
                currentSize={boardSize}
                onConfirm={handleBoardConfigChange}
                onCancel={() => setShowBoardConfig(false)}
            />
            <DifficultyModal
                visible={showDifficultyModal}
                onSelect={(level) => {
                    setDifficulty(level as DifficultyLevel);
                    setShowDifficultyModal(false);
                    resetGame(numberOfBoards, boardSize);
                }}
                onClose={() => setShowDifficultyModal(false)}
            />
        </div>
    );
};

export default Game;