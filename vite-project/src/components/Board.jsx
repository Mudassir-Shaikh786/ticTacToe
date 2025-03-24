import { useState, useEffect } from "react";
import JSConfetti from "js-confetti";

const jsConfetti = new JSConfetti(); // Initialize once

function Board() {
  const initialSquares = new Array(9).fill(null);
  const [squares, setSquares] = useState(initialSquares);
  const [isXNext, setXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  // Function to check winner
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  // Handle square click
  const handleSquares = (i) => {
    if (winner || squares[i]) return;
    const newSquares = squares.slice();
    newSquares[i] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setXNext(!isXNext);
  };

  // Detect winner, show confetti, delay alert, then reset
  useEffect(() => {
    const result = calculateWinner(squares);
    if (result) {
      setWinner(result);

      jsConfetti.addConfetti({
        emojis: ["🤩", "🥳", "🤠", "😻", "👌", "👍"],
      });

      // Wait 1 second to let confetti display before alert
      setTimeout(() => {
        alert(`Winner: ${result}`);
        resetGame();
      }, 1000);
    }
  }, [squares]);

  const resetGame = () => {
    setSquares(initialSquares);
    setXNext(true);
    setWinner(null);
  };

  const isDraw = squares.every(square => square !== null) && !winner;
  const status = winner ? `Winner: ${winner}` : isDraw ? "It's a Draw!" : `Next Player: ${isXNext ? "X" : "O"}`;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl mb-2 text-white">{status}</h2>
      <div className="grid grid-cols-3 gap-2">
        {squares.map((value, index) => (
          <button
            key={index}
            onClick={() => handleSquares(index)}
            className="w-24 h-24 bg-blue-500 text-white text-3xl font-bold flex items-center justify-center border-2 border-white transition-all hover:bg-orange-500"
          >
            {value}
          </button>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-800"
        onClick={resetGame}
      >
        Reset Game
      </button>
    </div>
  );
}

export default Board;
