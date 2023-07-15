import { useState, useEffect } from "react";
import useGhost from "./useGhost";
import usePacMan from "./usePacman";
import { Cell, GameBoard, GameStatus } from "../components/Game/Game";

const dy = [-1, 1, 0, 0];
const dx = [0, 0, -1, 1];

const shadowBlinkyAI = (
  ghostPos: { y: number; x: number },
  gameBoard: GameBoard,
  pacManPos: { y: number; x: number }
) => {
  const newGhostPos = { ...ghostPos };

  const INF = 10_000;

  const from: Array<Array<-1 | Number[]>> = gameBoard.map((row) =>
    row.map((_) => -1)
  );
  const distances = gameBoard.map((row) => row.map((_) => INF));
  distances[ghostPos.y][ghostPos.x] = 0;

  // TODO: change to use FIFO queue
  const que = [[ghostPos.y, ghostPos.x]];

  while (que.length > 0) {
    const [y, x] = que.shift() as number[];
    for (let i = 0; i < 4; i++) {
      const ny = y + dy[i];
      const nx = x + dx[i];
      if (gameBoard[ny][nx] !== Cell.Wall && distances[ny][nx] === INF) {
        distances[ny][nx] = distances[y][x] + 1;
        from[ny][nx] = [y, x];
        que.push([ny, nx]);
      }
    }
  }

  let ty = pacManPos.y;
  let tx = pacManPos.x;

  while (from[ty][tx] !== -1 && distances[ty][tx] > 1) {
    const [y, x] = from[ty][tx] as number[];
    ty = y;
    tx = x;
  }

  newGhostPos.y = ty;
  newGhostPos.x = tx;

  return newGhostPos;
};

// TODO: Implement
// const speedyPinkyAI = () => {}

// TODO: Implement
// const bashfulInkyAI = () => {}

const pokeyClydeAI = (
  // TODO: Currently completely random, would like to add logic to move away from Pacman
  // if it is closer and closer if it is further away

  ghostPos: { y: number; x: number },
  gameBoard: GameBoard,
  pacManPos: { y: number; x: number }
) => {
  const newGhostPos = { ...ghostPos };

  const movablePos = [];
  for (let i = 0; i < 4; i++) {
    const ny = ghostPos.y + dy[i];
    const nx = ghostPos.x + dx[i];
    if (gameBoard[ny][nx] !== Cell.Wall) {
      movablePos.push({ y: ny, x: nx });
    }
  }

  const random = Math.floor(Math.random() * movablePos.length);
  newGhostPos.y = movablePos[random].y;
  newGhostPos.x = movablePos[random].x;

  return newGhostPos;
};

const usePacManGame = (
  initialPos: { y: number; x: number },
  initialGhostPos: { y: number; x: number },
  initialGhostPos2: { y: number; x: number },
  gameBoard: GameBoard
) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.ReadyToStart
  );

  const startGame = (warmUpTime: number = 5000) => {
    setGameStatus(GameStatus.Ready);
    setTimeout(() => {
      setGameStatus(GameStatus.InProgress);
    }, warmUpTime);
  };

  const { pacManPos, pacManDirection } = usePacMan(
    initialPos,
    gameBoard,
    gameStatus
  );

  const { ghostPos } = useGhost(
    initialGhostPos,
    gameBoard,
    pacManPos,
    shadowBlinkyAI,
    gameStatus
  );

  const { ghostPos: ghostPos2 } = useGhost(
    initialGhostPos2,
    gameBoard,
    pacManPos,
    pokeyClydeAI,
    gameStatus
  );

  const ghostPositions = [ghostPos, ghostPos2];

  useEffect(() => {
    if (gameStatus !== GameStatus.InProgress) {
      return;
    }

    if (
      ghostPositions.some(
        (ghostPos) => pacManPos.x === ghostPos.x && pacManPos.y === ghostPos.y
      )
    ) {
      setGameStatus(GameStatus.GameOver);
    } else if (!gameBoard.some((row) => row.includes(Cell.Dot))) {
      setGameStatus(GameStatus.GameClear);
    }
  }, [pacManPos, ghostPositions, gameBoard, gameStatus]);

  return { gameBoard, pacManDirection, gameStatus, startGame };
};

export default usePacManGame;
