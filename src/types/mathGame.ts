export type GameMode = 'classic' | 'time';
export type GameStatus = 'menu' | 'playing' | 'gameOver';

export interface Block {
  id: string;
  value: number;
  row: number;
  col: number;
  isSelected: boolean;
}

export interface MathGameState {
  grid: Block[];
  targetSum: number;
  currentSum: number;
  score: number;
  highScore: number;
  level: number;
  mode: GameMode;
  status: GameStatus;
  timeLeft: number;
  maxTime: number;
}
