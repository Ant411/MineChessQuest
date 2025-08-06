// Chess game logic and types
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black' | 'red' | 'blue';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  position?: { row: number; col: number };
  id?: string;
}

export interface Square {
  row: number;
  col: number;
}

export interface Move {
  from: Square;
  to: Square;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  special?: 'castling' | 'en_passant' | 'promotion';
}

export interface GameResult {
  winner: PieceColor | null;
  type: 'checkmate' | 'stalemate' | 'draw' | 'resignation';
  moves: Move[];
}

export class ChessLogic {
  private board: (ChessPiece | null)[][];
  private currentPlayer: PieceColor;
  private gameHistory: Move[];
  private gameMode: '2player' | '3player' | '4player';

  constructor(gameMode: '2player' | '3player' | '4player' = '2player') {
    this.gameMode = gameMode;
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.gameHistory = [];
  }

  private initializeBoard(): (ChessPiece | null)[][] {
    const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    
    if (this.gameMode === '2player') {
      return this.init2PlayerBoard(board);
    } else if (this.gameMode === '3player') {
      return this.init3PlayerBoard(board);
    } else {
      return this.init4PlayerBoard(board);
    }
  }

  private init2PlayerBoard(board: (ChessPiece | null)[][]): (ChessPiece | null)[][] {
    // Standard chess setup
    const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    
    // Black pieces (top)
    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: backRow[i], color: 'black' };
      board[1][i] = { type: 'pawn', color: 'black' };
    }
    
    // White pieces (bottom)  
    for (let i = 0; i < 8; i++) {
      board[6][i] = { type: 'pawn', color: 'white' };
      board[7][i] = { type: backRow[i], color: 'white' };
    }
    
    return board;
  }

  private init3PlayerBoard(board: (ChessPiece | null)[][]): (ChessPiece | null)[][] {
    // Triangular arrangement for 3 players
    // White at bottom, Black at top-left, Red at top-right
    const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    
    // White pieces (bottom)
    for (let i = 0; i < 8; i++) {
      board[6][i] = { type: 'pawn', color: 'white' };
      board[7][i] = { type: backRow[i], color: 'white' };
    }
    
    // Black pieces (top-left)
    for (let i = 0; i < 4; i++) {
      board[0][i] = { type: backRow[i], color: 'black' };
      board[1][i] = { type: 'pawn', color: 'black' };
    }
    
    // Red pieces (top-right)
    for (let i = 4; i < 8; i++) {
      board[0][i] = { type: backRow[i], color: 'red' };
      board[1][i] = { type: 'pawn', color: 'red' };
    }
    
    return board;
  }

  private init4PlayerBoard(board: (ChessPiece | null)[][]): (ChessPiece | null)[][] {
    // Four-corner setup
    const cornerPieces: PieceType[] = ['rook', 'knight', 'bishop', 'queen'];
    
    // White (bottom)
    for (let i = 2; i < 6; i++) {
      board[6][i] = { type: 'pawn', color: 'white' };
      board[7][i] = { type: cornerPieces[i - 2], color: 'white' };
    }
    board[7][3] = { type: 'king', color: 'white' };
    
    // Black (top)
    for (let i = 2; i < 6; i++) {
      board[1][i] = { type: 'pawn', color: 'black' };
      board[0][i] = { type: cornerPieces[i - 2], color: 'black' };
    }
    board[0][3] = { type: 'king', color: 'black' };
    
    // Red (left)
    for (let i = 2; i < 6; i++) {
      board[i][1] = { type: 'pawn', color: 'red' };
      board[i][0] = { type: cornerPieces[i - 2], color: 'red' };
    }
    board[3][0] = { type: 'king', color: 'red' };
    
    // Blue (right)
    for (let i = 2; i < 6; i++) {
      board[i][6] = { type: 'pawn', color: 'blue' };
      board[i][7] = { type: cornerPieces[i - 2], color: 'blue' };
    }
    board[3][7] = { type: 'king', color: 'blue' };
    
    return board;
  }

  public getBoard(): (ChessPiece | null)[][] {
    return this.board.map(row => [...row]);
  }

  public getCurrentPlayer(): PieceColor {
    return this.currentPlayer;
  }

  public getValidMoves(from: Square): Square[] {
    const piece = this.board[from.row]?.[from.col];
    if (!piece || piece.color !== this.currentPlayer) {
      return [];
    }

    const moves: Square[] = [];
    
    switch (piece.type) {
      case 'pawn':
        moves.push(...this.getPawnMoves(from, piece.color));
        break;
      case 'rook':
        moves.push(...this.getRookMoves(from));
        break;
      case 'knight':
        moves.push(...this.getKnightMoves(from));
        break;
      case 'bishop':
        moves.push(...this.getBishopMoves(from));
        break;
      case 'queen':
        moves.push(...this.getQueenMoves(from));
        break;
      case 'king':
        moves.push(...this.getKingMoves(from));
        break;
    }

    // Filter out moves that would put own king in check
    return moves.filter(to => !this.wouldBeInCheck(from, to, piece.color));
  }

  private getPawnMoves(from: Square, color: PieceColor): Square[] {
    const moves: Square[] = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    
    // Forward move
    const oneForward = { row: from.row + direction, col: from.col };
    if (this.isValidSquare(oneForward) && !this.board[oneForward.row][oneForward.col]) {
      moves.push(oneForward);
      
      // Two squares forward from starting position
      if (from.row === startRow) {
        const twoForward = { row: from.row + 2 * direction, col: from.col };
        if (this.isValidSquare(twoForward) && !this.board[twoForward.row][twoForward.col]) {
          moves.push(twoForward);
        }
      }
    }
    
    // Diagonal captures
    const captureLeft = { row: from.row + direction, col: from.col - 1 };
    const captureRight = { row: from.row + direction, col: from.col + 1 };
    
    if (this.isValidSquare(captureLeft) && this.isEnemyPiece(captureLeft, color)) {
      moves.push(captureLeft);
    }
    
    if (this.isValidSquare(captureRight) && this.isEnemyPiece(captureRight, color)) {
      moves.push(captureRight);
    }
    
    return moves;
  }

  private getRookMoves(from: Square): Square[] {
    const moves: Square[] = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const to = { row: from.row + dr * i, col: from.col + dc * i };
        if (!this.isValidSquare(to)) break;
        
        const targetPiece = this.board[to.row][to.col];
        if (!targetPiece) {
          moves.push(to);
        } else {
          if (targetPiece.color !== this.currentPlayer) {
            moves.push(to);
          }
          break;
        }
      }
    }
    
    return moves;
  }

  private getKnightMoves(from: Square): Square[] {
    const moves: Square[] = [];
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    for (const [dr, dc] of knightMoves) {
      const to = { row: from.row + dr, col: from.col + dc };
      if (this.isValidSquare(to)) {
        const targetPiece = this.board[to.row][to.col];
        if (!targetPiece || targetPiece.color !== this.currentPlayer) {
          moves.push(to);
        }
      }
    }
    
    return moves;
  }

  private getBishopMoves(from: Square): Square[] {
    const moves: Square[] = [];
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    
    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const to = { row: from.row + dr * i, col: from.col + dc * i };
        if (!this.isValidSquare(to)) break;
        
        const targetPiece = this.board[to.row][to.col];
        if (!targetPiece) {
          moves.push(to);
        } else {
          if (targetPiece.color !== this.currentPlayer) {
            moves.push(to);
          }
          break;
        }
      }
    }
    
    return moves;
  }

  private getQueenMoves(from: Square): Square[] {
    return [...this.getRookMoves(from), ...this.getBishopMoves(from)];
  }

  private getKingMoves(from: Square): Square[] {
    const moves: Square[] = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [dr, dc] of directions) {
      const to = { row: from.row + dr, col: from.col + dc };
      if (this.isValidSquare(to)) {
        const targetPiece = this.board[to.row][to.col];
        if (!targetPiece || targetPiece.color !== this.currentPlayer) {
          moves.push(to);
        }
      }
    }
    
    return moves;
  }

  private isValidSquare(square: Square): boolean {
    return square.row >= 0 && square.row < 8 && square.col >= 0 && square.col < 8;
  }

  private isEnemyPiece(square: Square, playerColor: PieceColor): boolean {
    const piece = this.board[square.row][square.col];
    return piece !== null && piece.color !== playerColor;
  }

  private wouldBeInCheck(from: Square, to: Square, playerColor: PieceColor): boolean {
    // Temporarily make the move
    const originalPiece = this.board[to.row][to.col];
    const movingPiece = this.board[from.row][from.col];
    
    this.board[to.row][to.col] = movingPiece;
    this.board[from.row][from.col] = null;
    
    // Check if king is in check
    const inCheck = this.isKingInCheck(playerColor);
    
    // Restore the board
    this.board[from.row][from.col] = movingPiece;
    this.board[to.row][to.col] = originalPiece;
    
    return inCheck;
  }

  private isKingInCheck(playerColor: PieceColor): boolean {
    const kingPosition = this.findKing(playerColor);
    if (!kingPosition) return false;
    
    // Check if any enemy piece can attack the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color !== playerColor) {
          const moves = this.getValidMovesForPiece({ row, col }, piece);
          if (moves.some(move => move.row === kingPosition.row && move.col === kingPosition.col)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  private findKing(color: PieceColor): Square | null {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.type === 'king' && piece.color === color) {
          return { row, col };
        }
      }
    }
    return null;
  }

  private getValidMovesForPiece(from: Square, piece: ChessPiece): Square[] {
    // Similar to getValidMoves but without check validation to avoid recursion
    const moves: Square[] = [];
    
    switch (piece.type) {
      case 'pawn':
        return this.getPawnMoves(from, piece.color);
      case 'rook':
        return this.getRookMoves(from);
      case 'knight':
        return this.getKnightMoves(from);
      case 'bishop':
        return this.getBishopMoves(from);
      case 'queen':
        return this.getQueenMoves(from);
      case 'king':
        return this.getKingMoves(from);
    }
    
    return moves;
  }

  public makeMove(from: Square, to: Square): boolean {
    const piece = this.board[from.row][from.col];
    if (!piece || piece.color !== this.currentPlayer) {
      return false;
    }

    const validMoves = this.getValidMoves(from);
    const isValidMove = validMoves.some(move => move.row === to.row && move.col === to.col);
    
    if (!isValidMove) {
      return false;
    }

    // Make the move
    const capturedPiece = this.board[to.row][to.col];
    this.board[to.row][to.col] = piece;
    this.board[from.row][from.col] = null;

    // Record the move
    const move: Move = { from, to, piece, capturedPiece: capturedPiece || undefined };
    this.gameHistory.push(move);

    // Switch to next player
    this.nextPlayer();

    return true;
  }

  private nextPlayer(): void {
    const playerOrder: PieceColor[] = 
      this.gameMode === '2player' ? ['white', 'black'] :
      this.gameMode === '3player' ? ['white', 'black', 'red'] :
      ['white', 'black', 'red', 'blue'];

    const currentIndex = playerOrder.indexOf(this.currentPlayer);
    this.currentPlayer = playerOrder[(currentIndex + 1) % playerOrder.length];
  }

  public isGameOver(): GameResult | null {
    // Check for checkmate, stalemate, etc.
    const validMovesExist = this.hasValidMoves(this.currentPlayer);
    const inCheck = this.isKingInCheck(this.currentPlayer);

    if (!validMovesExist) {
      if (inCheck) {
        // Checkmate
        const winner = this.getPreviousPlayer();
        return {
          winner,
          type: 'checkmate',
          moves: [...this.gameHistory]
        };
      } else {
        // Stalemate
        return {
          winner: null,
          type: 'stalemate',
          moves: [...this.gameHistory]
        };
      }
    }

    return null;
  }

  private hasValidMoves(playerColor: PieceColor): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === playerColor) {
          const moves = this.getValidMoves({ row, col });
          if (moves.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private getPreviousPlayer(): PieceColor {
    const playerOrder: PieceColor[] = 
      this.gameMode === '2player' ? ['white', 'black'] :
      this.gameMode === '3player' ? ['white', 'black', 'red'] :
      ['white', 'black', 'red', 'blue'];

    const currentIndex = playerOrder.indexOf(this.currentPlayer);
    const prevIndex = (currentIndex - 1 + playerOrder.length) % playerOrder.length;
    return playerOrder[prevIndex];
  }
}

export default ChessLogic;