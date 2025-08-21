import { NextRequest, NextResponse } from 'next/server';
import { gameSessions } from '@/lib/game-sessions';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    const gameState = gameSessions.get(sessionId);
    
    if (!gameState) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    if (gameState.gameHistory.length < 3) {
      return NextResponse.json({ error: 'No moves to undo' }, { status: 400 });
    }
    
    gameState.boards = gameState.gameHistory[gameState.gameHistory.length - 3];
    gameState.gameHistory = gameState.gameHistory.slice(0, -2);
    gameState.currentPlayer = 1;
    
    gameSessions.set(sessionId, gameState);
    return NextResponse.json({ success: true, gameState });
  } catch (error) {
    console.error('Undo move error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}