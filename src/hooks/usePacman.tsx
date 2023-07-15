import { useState, useEffect, useRef } from "react";
import { Cell, GameBoard, Direction } from "../components/Game/Game";

const usePacMan = (
  initialPos: { x: number; y: number },
  gameBoard: GameBoard,
  isReady: boolean
) => {
  const [pacManPos, setPacManPos] = useState(initialPos);
  const [pacManDirection, setPacManDirection] = useState(Direction.Right);
  const movingInterval = useRef<NodeJS.Timeout | null>(null);

  const [isWarming, setIsWarming] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    const delayTimeout = setTimeout(() => {
      setIsWarming(true);
    }, 5000);
    return () => {
      clearTimeout(delayTimeout);
    };
  }, [isReady]);

  const handleDirectionChange = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
        setPacManDirection(Direction.Up);
        break;
      case "ArrowDown":
        setPacManDirection(Direction.Down);
        break;
      case "ArrowLeft":
        setPacManDirection(Direction.Left);
        break;
      case "ArrowRight":
        setPacManDirection(Direction.Right);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleDirectionChange);
    return () => {
      window.removeEventListener("keydown", handleDirectionChange);
    };
  }, []);

  useEffect(() => {
    if (!isReady || !isWarming) return;
    if (movingInterval.current) {
      clearInterval(movingInterval.current);
    }

    movingInterval.current = setInterval(() => {
      let newPos = { ...pacManPos };

      switch (pacManDirection) {
        case Direction.Up:
          newPos.y = Math.max(newPos.y - 1, 0);
          break;
        case Direction.Down:
          newPos.y = Math.min(newPos.y + 1, gameBoard.length - 1);
          break;
        case Direction.Left:
          if (pacManPos.y === 5) {
            newPos.x = Math.max(
              (newPos.x - 1 + gameBoard[0].length) % gameBoard[0].length
            );
          } else {
            newPos.x = Math.max(newPos.x - 1, 0);
          }
          break;
        case Direction.Right:
          if (pacManPos.y === 5) {
            newPos.x = Math.min((newPos.x + 1) % gameBoard[0].length);
          } else {
            newPos.x = Math.min(newPos.x + 1, gameBoard[0].length - 1);
          }
          break;
      }

      if (gameBoard[newPos.y][newPos.x] !== Cell.Wall) {
        gameBoard[pacManPos.y][pacManPos.x] = Cell.Empty;
        gameBoard[newPos.y][newPos.x] = Cell.PacMan;
        setPacManPos(newPos);
      }
    }, 200);

    return () => {
      if (movingInterval.current) {
        clearInterval(movingInterval.current);
      }
    };
  }, [pacManPos, pacManDirection, gameBoard, isReady]);

  return { pacManPos, pacManDirection, setPacManPos, setPacManDirection };
};

export default usePacMan;