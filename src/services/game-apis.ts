import { BoardSize, DifficultyLevel } from './types';

const API_BASE = '/api/game';

export interface ApiResponse {
  success: boolean;
  gameState?: any;
  gameOver?: boolean;
  error?: string;
}

export async function createGame(
  numberOfBoards: number, 
  boardSize: BoardSize, 
  difficulty: DifficultyLevel
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numberOfBoards, boardSize, difficulty })
    });
    return await response.json();
  } catch (error) {
    console.error('Create game API error:', error);
    return { success: false, error: 'Failed to create game' };
  }
}

export async function makeMove(
  sessionId: string, 
  boardIndex: number, 
  cellIndex: number
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, boardIndex, cellIndex })
    });
    return await response.json();
  } catch (error) {
    console.error('Make move API error:', error);
    return { success: false, error: 'Failed to make move' };
  }
}

export async function resetGame(sessionId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    return await response.json();
  } catch (error) {
    console.error('Reset game API error:', error);
    return { success: false, error: 'Failed to reset game' };
  }
}

export async function updateConfig(
  sessionId: string,
  numberOfBoards: number,
  boardSize: BoardSize,
  difficulty: DifficultyLevel
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, numberOfBoards, boardSize, difficulty })
    });
    return await response.json();
  } catch (error) {
    console.error('Update config API error:', error);
    return { success: false, error: 'Failed to update config' };
  }
}

export async function undoMove(sessionId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/undo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    return await response.json();
  } catch (error) {
    console.error('Undo move API error:', error);
    return { success: false, error: 'Failed to undo move' };
  }
}

export async function skipMove(sessionId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/skip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    return await response.json();
  } catch (error) {
    console.error('Skip move API error:', error);
    return { success: false, error: 'Failed to skip move' };
  }
}