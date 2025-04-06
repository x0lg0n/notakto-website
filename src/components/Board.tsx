import React from 'react';
import Cell from './Cell';
import type { BoardProps } from '../services/types';

const Board: React.FC<BoardProps> = ({ boardIndex, boardState, makeMove, isDead, boardSize }) => {
  return (
    <div className={`mb-8 ${isDead ? 'opacity-60 bg-gray-100' : 'bg-black'}`}>
      {Array.from({ length: boardSize }).map((_, row) => (
        <div key={row} className="flex flex-row">
          {Array.from({ length: boardSize }).map((_, col) => {
            const cellIndex = row * boardSize + col;
            return (
              <Cell
                key={cellIndex}
                boardIndex={boardIndex}
                cellIndex={cellIndex}
                value={boardState[cellIndex]}
                onPress={makeMove}
                disabled={isDead}
                boardSize={boardSize}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
