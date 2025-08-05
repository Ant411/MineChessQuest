export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black' | 'red' | 'blue';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: ChessPiece;
  capturedPiece?: ChessPiece | null;
  specialMove?: 'castling' | 'en_passant' | 'promotion';
}

export class ChessLogic {
  static isValidMove(
    board: (ChessPiece | null)[][],
    from: Position,
    to: Position,
    gameMode: string = '2player'
  ): boolean {
    const piece = board[from.row][from.col];
    if (!piece) return false;

    // Check if destination is within bounds
    if (!this.isInBounds(to, gameMode)) return false;

    // Check if destination has own piece
    const targetPiece = board[to.row][to.col];
    if (targetPiece && targetPiece.color === piece.color) return false;

    // Get valid moves for this piece
    const validMoves = this.getValidMoves(board, from, gameMode);
    return validMoves.some(move => move.row === to.row && move.col === to.col);
  }

  static getValidMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    gameMode: string = '2player'
  ): Position[] {
    const piece = board[position.row][position.col];
    if (!piece) return [];

    switch (piece.type) {
      case 'pawn':
        return this.getPawnMoves(board, position, piece, gameMode);
      case 'rook':
        return this.getRookMoves(board, position, piece, gameMode);
      case 'knight':
        return this.getKnightMoves(board, position, piece, gameMode);
      case 'bishop':
        return this.getBishopMoves(board, position, piece, gameMode);
      case 'queen':
        return this.getQueenMoves(board, position, piece, gameMode);
      case 'king':
        return this.getKingMoves(board, position, piece, gameMode);
      default:
        return [];
    }
  }

  private static getPawnMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    piece: ChessPiece,
    gameMode: string
  ): Position[] {
    const moves: Position[] = [];
    const { row, col } = position;
    
    // Direction based on color
    const direction = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;

    // Forward move
    const nextRow = row + direction;
    if (this.isInBounds({ row: nextRow, col }, gameMode) && !board[nextRow][col]) {
      moves.push({ row: nextRow, col });

      // Double move from starting position
      if (row === startRow) {
        const doubleRow = row + 2 * direction;
        if (this.isInBounds({ row: doubleRow, col }, gameMode) && !board[doubleRow][col]) {
          moves.push({ row: doubleRow, col });
        }
      }
    }

    // Diagonal captures
    [-1, 1].forEach(dc => {
      const newCol = col + dc;
      if (this.isInBounds({ row: nextRow, col: newCol }, gameMode)) {
        const target = board[nextRow][newCol];
        if (target && target.color !== piece.color) {
          moves.push({ row: nextRow, col: newCol });
        }
      }
    });

    return moves;
  }

  private static getRookMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    piece: ChessPiece,
    gameMode: string
  ): Position[] {
    const moves: Position[] = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < 10; i++) {
        const newRow = position.row + dr * i;
        const newCol = position.col + dc * i;
        const newPos = { row: newRow, col: newCol };

        if (!this.isInBounds(newPos, gameMode)) break;

        const target = board[newRow][newCol];
        if (!target) {
          moves.push(newPos);
        } else {
          if (target.color !== piece.color) {
            moves.push(newPos);
          }
          break;
        }
      }
    });

    return moves;
  }

  private static getKnightMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    piece: ChessPiece,
    gameMode: string
  ): Position[] {
    const moves: Position[] = [];
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    knightMoves.forEach(([dr, dc]) => {
      const newRow = position.row + dr;
      const newCol = position.col + dc;
      const newPos = { row: newRow, col: newCol };

      if (this.isInBounds(newPos, gameMode)) {
        const target = board[newRow][newCol];
        if (!target || target.color !== piece.color) {
          moves.push(newPos);
        }
      }
    });

    return moves;
  }

  private static getBishopMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    piece: ChessPiece,
    gameMode: string
  ): Position[] {
    const moves: Position[] = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < 10; i++) {
        const newRow = position.row + dr * i;
        const newCol = position.col + dc * i;
        const newPos = { row: newRow, col: newCol };

        if (!this.isInBounds(newPos, gameMode)) break;

        const target = board[newRow][newCol];
        if (!target) {
          moves.push(newPos);
        } else {
          if (target.color !== piece.color) {
            moves.push(newPos);
          }
          break;
        }
      }
    });

    return moves;
  }

  private static getQueenMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    piece: ChessPiece,
    gameMode: string
  ): Position[] {
    // Queen moves like both rook and bishop
    return [
      ...this.getRookMoves(board, position, piece, gameMode),
      ...this.getBishopMoves(board, position, piece, gameMode)
    ];
  }

  private static getKingMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    piece: ChessPiece,
    gameMode: string
  ): Position[] {
    const moves: Position[] = [];
    
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        
        const newRow = position.row + dr;
        const newCol = position.col + dc;
        const newPos = { row: newRow, col: newCol };

        if (this.isInBounds(newPos, gameMode)) {
          const target = board[newRow][newCol];
          if (!target || target.color !== piece.color) {
            moves.push(newPos);
          }
        }
      }
    }

    return moves;
  }

  private static isInBounds(position: Position, gameMode: string): boolean {
    const { row, col } = position;
    
    switch (gameMode) {
      case '3player':
        // Triangular board bounds
        return row >= 0 && row < 9 && col >= 0 && col <= row;
      case '4player':
        // 10x10 board
        return row >= 0 && row < 10 && col >= 0 && col < 10;
      default:
        // Standard 8x8 board
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
  }

  static isInCheck(
    board: (ChessPiece | null)[][],
    kingColor: PieceColor,
    gameMode: string = '2player'
  ): boolean {
    // Find the king
    let kingPosition: Position | null = null;
    
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece && piece.type === 'king' && piece.color === kingColor) {
          kingPosition = { row, col };
          break;
        }
      }
      if (kingPosition) break;
    }

    if (!kingPosition) return false;

    // Check if any enemy piece can attack the king
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece && piece.color !== kingColor) {
          const moves = this.getValidMoves(board, { row, col }, gameMode);
          if (moves.some(move => move.row === kingPosition!.row && move.col === kingPosition!.col)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  static isCheckmate(
    board: (ChessPiece | null)[][],
    kingColor: PieceColor,
    gameMode: string = '2player'
  ): boolean {
    if (!this.isInCheck(board, kingColor, gameMode)) {
      return false;
    }

    // Try all possible moves for the player
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece && piece.color === kingColor) {
          const moves = this.getValidMoves(board, { row, col }, gameMode);
          
          for (const move of moves) {
            // Simulate the move
            const originalPiece = board[move.row][move.col];
            board[move.row][move.col] = piece;
            board[row][col] = null;

            const stillInCheck = this.isInCheck(board, kingColor, gameMode);

            // Undo the move
            board[row][col] = piece;
            board[move.row][move.col] = originalPiece;

            if (!stillInCheck) {
              return false; // Found a move that gets out of check
            }
          }
        }
      }
    }

    return true; // No moves can get out of check
  }
}
