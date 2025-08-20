import { NextRequest, NextResponse } from 'next/server';
import { BoardState, BoardSize, DifficultyLevel } from '@/services/types';
import { isBoardDead } from '@/services/ai';
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