import { useState, useEffect } from "react";
import JSConfetti from "js-confetti";

const jsConfetti = new JSConfetti(); // Initialize once

function Board() {
  const initialSquares = new Array(9).fill(null);
  const [squares, setSquares] = useState(initialSquares);
  const [isXNext, setXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  // Function to check winner and return winning line
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  }

  // Handle square click/touch
  const handleSquares = (i) => {
    if (winner || squares[i]) return;
    const newSquares = squares.slice();
    newSquares[i] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setXNext(!isXNext);
  };

  // Detect winner or draw and show modal
  useEffect(() => {
    const result = calculateWinner(squares);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);

      setTimeout(() => {
        jsConfetti.addConfetti({
          emojis: ["🤩", "🥳", "🤠", "😻", "👌", "👍"],
        });
        setModalMessage(`Winner: ${result.winner}`);
      }, 500);
    } else if (squares.every(square => square !== null)) {
      setTimeout(() => {
        setModalMessage("It's a Draw!");
      }, 500);
    }
  }, [squares]);

  // Reset game state
  const resetGame = () => {
    setSquares(initialSquares);
    setXNext(true);
    setWinner(null);
    setWinningLine([]);
    setModalMessage(null);
  };

  const status = winner
    ? `Winner: ${winner}`
    : squares.every(square => square !== null)
    ? "It's a Draw!"
    : `Next Player: ${isXNext ? "X" : "O"}`;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl mb-2 text-white">{status}</h2>

      <div className="grid grid-cols-3 gap-2">
        {squares.map((value, index) => (
          <button
            key={index}
            onClick={() => handleSquares(index)}
            onTouchStart={() => handleSquares(index)}
            className={`w-24 h-24 text-white text-3xl font-bold flex items-center justify-center border-2 border-white transition-all hover:bg-orange-500 ${
              winningLine.includes(index) ? 'bg-green-500' : 'bg-blue-500'
            }`}
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

      {/* Modal Popup */}
      {modalMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl mb-4">{modalMessage}</h2>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => {
                setModalMessage(null);
                resetGame();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Board;
