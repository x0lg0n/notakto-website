interface CellProps {
  boardIndex: number;
  cellIndex: number;
  value: string;
  onPress: (boardIndex: number, cellIndex: number) => void;
  disabled: boolean;
  boardSize: number;
}

const Cell = ({ boardIndex, cellIndex, value, onPress, disabled, boardSize }: CellProps) => {
  const screenWidth = window.innerWidth;
  const cellSize = (screenWidth * 0.9) / boardSize - 10;

  return (
    <button
      onClick={() => onPress(boardIndex, cellIndex)}
      disabled={disabled || !!value}
      className="bg-black border border-gray-300 m-1 flex items-center justify-center"
      style={{ width: cellSize, height: cellSize }}
    >
      <span
        className="text-red-600 font-pixelvt"
        style={{ fontSize: cellSize * 0.4 }}
      >
        {value}
      </span>
    </button>
  );
};

export default Cell;
