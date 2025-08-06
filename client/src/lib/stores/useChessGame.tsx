import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameState = "menu" | "player_setup" | "playing" | "game_over" | "help" | "scoreboard";
export type GameMode = "2player" | "1player" | "3player" | "4player";
export type Biome = "forest" | "desert" | "ocean" | "nether" | "end" | "mushroom" | "ice" | "jungle";

interface ChessPiece {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black' | 'red' | 'blue';
}

interface Square {
  row: number;
  col: number;
}

interface Animation {
  type: 'move' | 'capture' | 'special_move' | 'game_over';
  data: any;
  duration?: number;
  position?: [number, number, number];
}

interface ChessGameState {
  gameState: GameState;
  gameMode: GameMode;
  currentBiome: Biome;
  board: (ChessPiece | null)[][];
  currentPlayer: string;
  selectedSquare: Square | null;
  selectedPiece: ChessPiece | null;
  validMoves: { from: Square; to: Square }[];
  gameWinner: string | null;
  currentAnimation: Animation | null;
  
  // Actions
  setGameState: (state: GameState) => void;
  setGameMode: (mode: GameMode) => void;
  setBiome: (biome: Biome) => void;
  setCurrentBiome: (biome: string) => void;
  selectSquare: (square: Square) => void;
  selectPiece: (piece: ChessPiece) => void;
  makeMove: (from: Square, to: Square) => void;
  getValidMoves: (square: Square) => { from: Square; to: Square }[];
  nextPlayer: () => void;
  resetGame: () => void;
  playAnimation: (animation: Animation) => void;
  clearAnimation: () => void;
}

const initialBoard = (): (ChessPiece | null)[][] => {
  const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Set up initial chess positions
  // Black pieces (top)
  board[0][0] = { type: 'rook', color: 'black' };
  board[0][1] = { type: 'knight', color: 'black' };
  board[0][2] = { type: 'bishop', color: 'black' };
  board[0][3] = { type: 'queen', color: 'black' };
  board[0][4] = { type: 'king', color: 'black' };
  board[0][5] = { type: 'bishop', color: 'black' };
  board[0][6] = { type: 'knight', color: 'black' };
  board[0][7] = { type: 'rook', color: 'black' };
  
  // Black pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black' };
  }
  
  // White pawns
  for (let i = 0; i < 8; i++) {
    board[6][i] = { type: 'pawn', color: 'white' };
  }
  
  // White pieces (bottom)
  board[7][0] = { type: 'rook', color: 'white' };
  board[7][1] = { type: 'knight', color: 'white' };
  board[7][2] = { type: 'bishop', color: 'white' };
  board[7][3] = { type: 'queen', color: 'white' };
  board[7][4] = { type: 'king', color: 'white' };
  board[7][5] = { type: 'bishop', color: 'white' };
  board[7][6] = { type: 'knight', color: 'white' };
  board[7][7] = { type: 'rook', color: 'white' };
  
  return board;
};

export const useChessGame = create<ChessGameState>()(
  subscribeWithSelector((set, get) => ({
    gameState: "menu",
    gameMode: "2player",
    currentBiome: "forest",
    board: initialBoard(),
    currentPlayer: "white",
    selectedSquare: null,
    selectedPiece: null,
    validMoves: [],
    gameWinner: null,
    currentAnimation: null,
    
    setGameState: (state) => set({ gameState: state }),
    
    setGameMode: (mode) => set({ gameMode: mode }),
    
    setBiome: (biome) => set({ currentBiome: biome }),
    setCurrentBiome: (biome) => set({ currentBiome: biome as Biome }),
    
    getValidMoves: (square) => {
      const { board } = get();
      const piece = board[square.row]?.[square.col];
      if (!piece) return [];
      
      const moves: { from: Square; to: Square }[] = [];
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      
      directions.forEach(([dr, dc]) => {
        const newRow = square.row + dr;
        const newCol = square.col + dc;
        
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const targetPiece = board[newRow][newCol];
          if (!targetPiece || targetPiece.color !== piece.color) {
            moves.push({
              from: square,
              to: { row: newRow, col: newCol }
            });
          }
        }
      });
      
      return moves;
    },
    
    selectSquare: (square) => {
      const currentState = get();
      if (currentState.selectedSquare) {
        const validMoves = get().getValidMoves(currentState.selectedSquare);
        const isValidMove = validMoves.some(move => 
          move.to.row === square.row && move.to.col === square.col
        );
        
        if (isValidMove) {
          get().makeMove(currentState.selectedSquare, square);
        }
        set({ selectedSquare: null, validMoves: [] });
      } else {
        const piece = currentState.board[square.row][square.col];
        if (piece && piece.color === currentState.currentPlayer) {
          const moves = get().getValidMoves(square);
          set({ 
            selectedSquare: square,
            selectedPiece: piece,
            validMoves: moves
          });
        }
      }
    },
    
    selectPiece: (piece) => set({ selectedPiece: piece }),
    
    makeMove: (from, to) => {
      const { board, currentPlayer } = get();
      const newBoard = board.map(row => [...row]);
      const piece = newBoard[from.row][from.col];
      const capturedPiece = newBoard[to.row][to.col];
      
      if (piece) {
        // Move piece
        newBoard[to.row][to.col] = piece;
        newBoard[from.row][from.col] = null;
        
        // Play animation
        const animation: Animation = {
          type: capturedPiece ? 'capture' : 'move',
          data: { from, to, piece, capturedPiece },
          position: [to.col - 3.5, 0.5, to.row - 3.5]
        };
        
        set({ 
          board: newBoard,
          selectedSquare: null,
          selectedPiece: null,
          validMoves: [],
          currentAnimation: animation
        });
        
        // Check for game over
        if (isGameOver(newBoard)) {
          setTimeout(() => {
            set({ gameState: 'game_over' });
          }, 2000);
        } else {
          get().nextPlayer();
        }
      }
    },
    
    nextPlayer: () => {
      const { currentPlayer, gameMode } = get();
      const playerColors = gameMode === '2player' ? ['white', 'black'] :
                          gameMode === '3player' ? ['white', 'black', 'red'] :
                          gameMode === '4player' ? ['white', 'black', 'red', 'blue'] :
                          ['white', 'black'];
      
      const currentIndex = playerColors.indexOf(currentPlayer);
      const nextIndex = (currentIndex + 1) % playerColors.length;
      set({ currentPlayer: playerColors[nextIndex] });
    },
    
    resetGame: () => set({
      board: initialBoard(),
      currentPlayer: "white",
      selectedSquare: null,
      selectedPiece: null,
      validMoves: [],
      gameWinner: null,
      currentAnimation: null
    }),
    
    playAnimation: (animation) => set({ currentAnimation: animation }),
    
    clearAnimation: () => set({ currentAnimation: null })
  }))
);

// Helper functions
function getValidMoves(board: (ChessPiece | null)[][], square: Square, piece: ChessPiece): Square[] {
  const moves: Square[] = [];
  const { row, col } = square;
  
  // Basic movement patterns (simplified for now)
  switch (piece.type) {
    case 'pawn':
      const direction = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      
      // Forward move
      if (board[row + direction] && board[row + direction][col] === null) {
        moves.push({ row: row + direction, col });
        
        // Double move from start
        if (row === startRow && board[row + 2 * direction][col] === null) {
          moves.push({ row: row + 2 * direction, col });
        }
      }
      
      // Diagonal captures
      [-1, 1].forEach(dc => {
        if (board[row + direction] && board[row + direction][col + dc] && 
            board[row + direction][col + dc]?.color !== piece.color) {
          moves.push({ row: row + direction, col: col + dc });
        }
      });
      break;
      
    case 'rook':
      // Horizontal and vertical moves
      [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
          const newRow = row + dr * i;
          const newCol = col + dc * i;
          
          if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
          
          const target = board[newRow][newCol];
          if (target === null) {
            moves.push({ row: newRow, col: newCol });
          } else {
            if (target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol });
            }
            break;
          }
        }
      });
      break;
      
    // Add other piece movements...
    default:
      // Basic movement for now
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          
          const newRow = row + dr;
          const newCol = col + dc;
          
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = board[newRow][newCol];
            if (target === null || target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        }
      }
  }
  
  return moves;
}

function isGameOver(board: (ChessPiece | null)[][]): boolean {
  // Simple check for kings
  let whiteKing = false;
  let blackKing = false;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === 'king') {
        if (piece.color === 'white') whiteKing = true;
        if (piece.color === 'black') blackKing = true;
      }
    }
  }
  
  return !whiteKing || !blackKing;
}
