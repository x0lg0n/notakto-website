import { NextRequest, NextResponse } from 'next/server';
import { BoardState, BoardSize, DifficultyLevel } from '@/services/types';
import { findBestMove, isBoardDead, updateBoards } from '@/services/ai';
import { calculateRewards } from '@/services/economyUtils';

// In-memory store for game state (we'll improve this later)
const gameSessions = new Map();

export async function POST(request: NextRequest) {
    try {
        const { action, sessionId, ...data } = await request.json();

        if (action === 'create') {
            // Create a new game session
            const { numberOfBoards, boardSize, difficulty } = data;
            const sessionId = Math.random().toString(36).substring(2);

            const initialBoards = Array(numberOfBoards).fill(null)
                .map(() => Array(boardSize * boardSize).fill(''));

            const gameState = {
                boards: initialBoards,
                currentPlayer: 1,
                winner: '',
                boardSize,
                numberOfBoards,
                difficulty,
                gameHistory: [initialBoards],
                coins: 0,
                xp: 0
            };

            gameSessions.set(sessionId, gameState);

            return NextResponse.json({
                success: true,
                sessionId,
                gameState
            });
        } else if (action === 'move') {
            // Process a player move
            const { boardIndex, cellIndex } = data;
            const gameState = gameSessions.get(sessionId);

            if (!gameState) {
                return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            }

            // Validate move
            if (gameState.boards[boardIndex][cellIndex] !== '' ||
                isBoardDead(gameState.boards[boardIndex], gameState.boardSize)) {
                return NextResponse.json({ error: 'Invalid move' }, { status: 400 });
            }

            // Update boards
            const newBoards = updateBoards(gameState.boards, { boardIndex, cellIndex });
            gameState.boards = newBoards;
            gameState.gameHistory.push(newBoards);

            // Check for game end
            if (newBoards.every(board => isBoardDead(board, gameState.boardSize))) {
                const loser = gameState.currentPlayer;
                const winner = loser === 1 ? 2 : 1;
                const isHumanWinner = winner === 1;
                const rewards = calculateRewards(isHumanWinner, gameState.difficulty,
                    gameState.numberOfBoards, gameState.boardSize);

                gameState.winner = winner === 1 ? "You" : "Computer";
                gameState.coins = rewards.coins;
                gameState.xp = rewards.xp;

                gameSessions.set(sessionId, gameState);
                return NextResponse.json({
                    success: true,
                    gameState,
                    gameOver: true
                });
            }

            // Switch player
            gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;

            // If it's AI's turn, make AI move
            if (gameState.currentPlayer === 2) {
                const move = findBestMove(
                    gameState.boards,
                    gameState.difficulty,
                    gameState.boardSize,
                    gameState.numberOfBoards
                );

                if (move) {
                    const aiBoards = updateBoards(gameState.boards, move);
                    gameState.boards = aiBoards;
                    gameState.gameHistory.push(aiBoards);

                    // Check for game end after AI move
                    if (aiBoards.every(board => isBoardDead(board, gameState.boardSize))) {
                        const loser = gameState.currentPlayer;
                        const winner = loser === 1 ? 2 : 1;
                        const isHumanWinner = winner === 1;
                        const rewards = calculateRewards(isHumanWinner, gameState.difficulty,
                            gameState.numberOfBoards, gameState.boardSize);

                        gameState.winner = winner === 1 ? "You" : "Computer";
                        gameState.coins = rewards.coins;
                        gameState.xp = rewards.xp;

                        gameSessions.set(sessionId, gameState);
                        return NextResponse.json({
                            success: true,
                            gameState,
                            gameOver: true
                        });
                    }

                    gameState.currentPlayer = 1;
                }
            }

            gameSessions.set(sessionId, gameState);
            return NextResponse.json({ success: true, gameState });
        } else if (action === 'reset') {
            // Reset the game
            const gameState = gameSessions.get(sessionId);

            if (!gameState) {
                return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            }

            const initialBoards = Array(gameState.numberOfBoards).fill(null)
                .map(() => Array(gameState.boardSize * gameState.boardSize).fill(''));

            gameState.boards = initialBoards;
            gameState.currentPlayer = 1;
            gameState.winner = '';
            gameState.gameHistory = [initialBoards];
            gameState.coins = 0;
            gameState.xp = 0;

            gameSessions.set(sessionId, gameState);
            return NextResponse.json({ success: true, gameState });
        }else if (action === 'config') {
            // Update game configuration
            const { numberOfBoards, boardSize, difficulty } = data;
            const gameState = gameSessions.get(sessionId);

            if (!gameState) {
                return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            }

            gameState.numberOfBoards = numberOfBoards;
            gameState.boardSize = boardSize;
            gameState.difficulty = difficulty;

            // Reset with new configuration
            const initialBoards = Array(numberOfBoards).fill(null)
                .map(() => Array(boardSize * boardSize).fill(''));

            gameState.boards = initialBoards;
            gameState.currentPlayer = 1;
            gameState.winner = '';
            gameState.gameHistory = [initialBoards];
            gameState.coins = 0;
            gameState.xp = 0;

            gameSessions.set(sessionId, gameState);
            return NextResponse.json({ success: true, gameState });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Game API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}