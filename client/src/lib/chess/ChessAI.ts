import { ChessLogic, ChessPiece, Position, Move } from './ChessLogic';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

interface EvaluatedMove {
  move: Move;
  score: number;
}

export class ChessAI {
  private difficulty: AIDifficulty;
  private maxDepth: number;

  constructor(difficulty: AIDifficulty = 'medium') {
    this.difficulty = difficulty;
    this.maxDepth = this.getMaxDepth(difficulty);
  }

  private getMaxDepth(difficulty: AIDifficulty): number {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      case 'extreme': return 4;
      default: return 2;
    }
  }

  getBestMove(
    board: (ChessPiece | null)[][],
    aiColor: 'white' | 'black' | 'red' | 'blue',
    gameMode: string = '2player'
  ): Move | null {
    const moves = this.getAllPossibleMoves(board, aiColor, gameMode);
    if (moves.length === 0) return null;

    if (this.difficulty === 'easy') {
      return this.getRandomMove(moves);
    }

    const evaluatedMoves = moves.map(move => ({
      move,
      score: this.minimax(
        this.applyMove(board, move),
        this.maxDepth - 1,
        false,
        aiColor,
        gameMode,
        -Infinity,
        Infinity
      )
    }));

    // Sort by score (best first)
    evaluatedMoves.sort((a, b) => b.score - a.score);

    // Add some randomness for lower difficulties
    if (this.difficulty === 'medium' && Math.random() < 0.2) {
      return evaluatedMoves[Math.floor(Math.random() * Math.min(3, evaluatedMoves.length))].move;
    }

    return evaluatedMoves[0].move;
  }

  private minimax(
    board: (ChessPiece | null)[][],
    depth: number,
    isMaximizing: boolean,
    aiColor: 'white' | 'black' | 'red' | 'blue',
    gameMode: string,
    alpha: number,
    beta: number
  ): number {
    if (depth === 0) {
      return this.evaluateBoard(board, aiColor);
    }

    const currentColor = isMaximizing ? aiColor : this.getOpponentColor(aiColor);
    const moves = this.getAllPossibleMoves(board, currentColor, gameMode);

    if (moves.length === 0) {
      // Check if it's checkmate or stalemate
      if (ChessLogic.isInCheck(board, currentColor, gameMode)) {
        return isMaximizing ? -10000 : 10000;
      }
      return 0; // Stalemate
    }

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of moves) {
        const newBoard = this.applyMove(board, move);
        const score = this.minimax(newBoard, depth - 1, false, aiColor, gameMode, alpha, beta);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const move of moves) {
        const newBoard = this.applyMove(board, move);
        const score = this.minimax(newBoard, depth - 1, true, aiColor, gameMode, alpha, beta);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return minScore;
    }
  }

  private evaluateBoard(
    board: (ChessPiece | null)[][],
    aiColor: 'white' | 'black' | 'red' | 'blue'
  ): number {
    let score = 0;
    
    const pieceValues = {
      'pawn': 10,
      'knight': 30,
      'bishop': 30,
      'rook': 50,
      'queen': 90,
      'king': 900
    };

    const positionValues = {
      'pawn': [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
      ],
      'knight': [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
      ]
    };

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (!piece) continue;

        let pieceScore = pieceValues[piece.type];
        
        // Add position bonus
        if (positionValues[piece.type] && row < 8 && col < 8) {
          const posBonus = piece.color === 'white' ? 
            positionValues[piece.type][7 - row][col] : 
            positionValues[piece.type][row][col];
          pieceScore += posBonus / 10;
        }

        if (piece.color === aiColor) {
          score += pieceScore;
        } else {
          score -= pieceScore;
        }
      }
    }

    // Bonus for controlling center
    const centerSquares = [[3, 3], [3, 4], [4, 3], [4, 4]];
    centerSquares.forEach(([row, col]) => {
      if (board[row] && board[row][col]) {
        const piece = board[row][col];
        if (piece && piece.color === aiColor) {
          score += 10;
        } else if (piece) {
          score -= 10;
        }
      }
    });

    return score;
  }

  private getAllPossibleMoves(
    board: (ChessPiece | null)[][],
    color: 'white' | 'black' | 'red' | 'blue',
    gameMode: string
  ): Move[] {
    const moves: Move[] = [];

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          const validMoves = ChessLogic.getValidMoves(board, { row, col }, gameMode);
          
          validMoves.forEach(to => {
            moves.push({
              from: { row, col },
              to,
              piece,
              capturedPiece: board[to.row][to.col]
            });
          });
        }
      }
    }

    return moves;
  }

  private applyMove(board: (ChessPiece | null)[][], move: Move): (ChessPiece | null)[][] {
    const newBoard = board.map(row => [...row]);
    
    newBoard[move.to.row][move.to.col] = move.piece;
    newBoard[move.from.row][move.from.col] = null;

    return newBoard;
  }

  private getRandomMove(moves: Move[]): Move {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  private getOpponentColor(aiColor: 'white' | 'black' | 'red' | 'blue'): 'white' | 'black' | 'red' | 'blue' {
    // Simple opponent detection for 2-player games
    return aiColor === 'white' ? 'black' : 'white';
  }

  setDifficulty(difficulty: AIDifficulty) {
    this.difficulty = difficulty;
    this.maxDepth = this.getMaxDepth(difficulty);
  }
}
