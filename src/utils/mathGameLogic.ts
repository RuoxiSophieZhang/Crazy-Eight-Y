import { Block } from '../types/mathGame';

export const GRID_COLS = 6;
export const GRID_ROWS = 10;
export const INITIAL_ROWS = 4;

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const createRandomBlock = (row: number, col: number): Block => ({
  id: generateId(),
  value: Math.floor(Math.random() * 9) + 1,
  row,
  col,
  isSelected: false,
});

export const generateTargetSum = (level: number): number => {
  // Target sum increases slightly with level
  const min = 10 + Math.floor(level / 2);
  const max = 25 + level;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const checkGameOver = (grid: Block[]): boolean => {
  // If any block is at row 0 (top), game over
  return grid.some(block => block.row <= 0);
};

export const shiftBlocksUp = (grid: Block[]): Block[] => {
  return grid.map(block => ({
    ...block,
    row: block.row - 1,
  }));
};

export const addNewRowAtBottom = (grid: Block[]): Block[] => {
  const newRow: Block[] = [];
  for (let col = 0; col < GRID_COLS; col++) {
    newRow.push(createRandomBlock(GRID_ROWS - 1, col));
  }
  return [...grid, ...newRow];
};

export const initializeGrid = (): Block[] => {
  const grid: Block[] = [];
  for (let row = GRID_ROWS - INITIAL_ROWS; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      grid.push(createRandomBlock(row, col));
    }
  }
  return grid;
};
