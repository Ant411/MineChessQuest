import { ChessLogic, ChessPiece, Position, Move } from './ChessLogic';

export interface MultiPlayerMove extends Move {
  playerId: number;
  isTeamMove?: boolean;
  allianceTarget?: number;
}

export interface Alliance {
  players: number[];
  duration: number;
  createdTurn: number;
}

export class MultiPlayerRules {
  private alliances: Alliance[] = [];
  private playerColors = ['white', 'black', 'red', 'blue'];
  
  // 3-Player Chess Rules
  static getTriangularBoardPositions(): Position[] {
    const positions: Position[] = [];
    const size = 9;
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= row; col++) {
        positions.push({ row, col });
      }
    }
    return positions;
  }

  static setupTriangularBoard(): (ChessPiece | null)[][] {
    const board: (ChessPiece | null)[][] = Array(9).fill(null).map(() => Array(9).fill(null));
    
    // Player 1 (White) - Bottom left
    const player1Pieces: [number, number, ChessPiece][] = [
      [8, 0, { type: 'rook', color: 'white' }],
      [8, 1, { type: 'knight', color: 'white' }],
      [8, 2, { type: 'bishop', color: 'white' }],
      [8, 3, { type: 'queen', color: 'white' }],
      [8, 4, { type: 'king', color: 'white' }],
      [8, 5, { type: 'bishop', color: 'white' }],
      [8, 6, { type: 'knight', color: 'white' }],
      [8, 7, { type: 'rook', color: 'white' }],
      [8, 8, { type: 'rook', color: 'white' }]
    ];

    // Player 2 (Black) - Top
    const player2Pieces: [number, number, ChessPiece][] = [
      [0, 0, { type: 'king', color: 'black' }],
      [1, 0, { type: 'queen', color: 'black' }],
      [1, 1, { type: 'bishop', color: 'black' }],
      [2, 0, { type: 'knight', color: 'black' }],
      [2, 1, { type: 'rook', color: 'black' }],
      [2, 2, { type: 'knight', color: 'black' }]
    ];

    // Player 3 (Red) - Bottom right
    const player3Pieces: [number, number, ChessPiece][] = [
      [4, 4, { type: 'king', color: 'red' }],
      [5, 4, { type: 'queen', color: 'red' }],
      [5, 5, { type: 'bishop', color: 'red' }],
      [6, 4, { type: 'knight', color: 'red' }],
      [6, 5, { type: 'rook', color: 'red' }],
      [6, 6, { type: 'knight', color: 'red' }]
    ];

    // Place pieces on board
    [...player1Pieces, ...player2Pieces, ...player3Pieces].forEach(([row, col, piece]) => {
      if (board[row] && col <= row) {
        board[row][col] = piece;
      }
    });

    // Add pawns
    [7, 6, 5].forEach(row => {
      for (let col = 0; col <= row && col < row; col++) {
        if (!board[row][col]) {
          const color = row === 7 ? 'white' : row === 6 ? 'black' : 'red';
          board[row][col] = { type: 'pawn', color: color as any };
        }
      }
    });

    return board;
  }

  // 4-Player Chess Rules
  static setupFourPlayerBoard(): (ChessPiece | null)[][] {
    const board: (ChessPiece | null)[][] = Array(10).fill(null).map(() => Array(10).fill(null));
    
    // Team 1: White (bottom) and Black (top)
    // Team 2: Red (left) and Blue (right)
    
    // White pieces (bottom)
    const whitePieces = [
      { type: 'rook', color: 'white' }, { type: 'knight', color: 'white' },
      { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' },
      { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' },
      { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }
    ];
    
    whitePieces.forEach((piece, col) => {
      if (col + 1 < 9) board[9][col + 1] = piece as ChessPiece;
    });
    
    // White pawns
    for (let col = 1; col < 9; col++) {
      board[8][col] = { type: 'pawn', color: 'white' };
    }

    // Black pieces (top)
    const blackPieces = [
      { type: 'rook', color: 'black' }, { type: 'knight', color: 'black' },
      { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' },
      { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' },
      { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }
    ];
    
    blackPieces.forEach((piece, col) => {
      if (col + 1 < 9) board[0][col + 1] = piece as ChessPiece;
    });
    
    // Black pawns
    for (let col = 1; col < 9; col++) {
      board[1][col] = { type: 'pawn', color: 'black' };
    }

    // Red pieces (left)
    const redPieces = [
      { type: 'rook', color: 'red' }, { type: 'knight', color: 'red' },
      { type: 'bishop', color: 'red' }, { type: 'queen', color: 'red' },
      { type: 'king', color: 'red' }, { type: 'bishop', color: 'red' },
      { type: 'knight', color: 'red' }, { type: 'rook', color: 'red' }
    ];
    
    redPieces.forEach((piece, row) => {
      if (row + 1 < 9) board[row + 1][0] = piece as ChessPiece;
    });
    
    // Red pawns
    for (let row = 1; row < 9; row++) {
      board[row][1] = { type: 'pawn', color: 'red' };
    }

    // Blue pieces (right)
    const bluePieces = [
      { type: 'rook', color: 'blue' }, { type: 'knight', color: 'blue' },
      { type: 'bishop', color: 'blue' }, { type: 'queen', color: 'blue' },
      { type: 'king', color: 'blue' }, { type: 'bishop', color: 'blue' },
      { type: 'knight', color: 'blue' }, { type: 'rook', color: 'blue' }
    ];
    
    bluePieces.forEach((piece, row) => {
      if (row + 1 < 9) board[row + 1][9] = piece as ChessPiece;
    });
    
    // Blue pawns
    for (let row = 1; row < 9; row++) {
      board[row][8] = { type: 'pawn', color: 'blue' };
    }

    return board;
  }

  // Alliance system for 3-player chess
  createAlliance(player1: number, player2: number, duration: number = 10): boolean {
    // Check if players are already in an alliance
    const existingAlliance = this.alliances.find(alliance => 
      alliance.players.includes(player1) || alliance.players.includes(player2)
    );
    
    if (existingAlliance) return false;

    this.alliances.push({
      players: [player1, player2],
      duration,
      createdTurn: 0 // Should be set to current turn
    });

    return true;
  }

  breakAlliance(playerId: number): boolean {
    const allianceIndex = this.alliances.findIndex(alliance => 
      alliance.players.includes(playerId)
    );
    
    if (allianceIndex !== -1) {
      this.alliances.splice(allianceIndex, 1);
      return true;
    }
    
    return false;
  }

  areAllied(player1: number, player2: number): boolean {
    return this.alliances.some(alliance => 
      alliance.players.includes(player1) && alliance.players.includes(player2)
    );
  }

  // Special move validation for multiplayer modes
  static isValidMultiPlayerMove(
    board: (ChessPiece | null)[][],
    move: MultiPlayerMove,
    gameMode: '3player' | '4player',
    currentPlayer: number
  ): boolean {
    const { from, to, playerId } = move;
    
    // Basic validation
    if (!ChessLogic.isValidMove(board, from, to, gameMode)) {
      return false;
    }

    const piece = board[from.row][from.col];
    if (!piece) return false;

    // Check if piece belongs to current player
    const expectedColor = ['white', 'black', 'red', 'blue'][playerId];
    if (piece.color !== expectedColor) return false;

    // 4-player team rules: can't capture teammate pieces
    if (gameMode === '4player') {
      const targetPiece = board[to.row][to.col];
      if (targetPiece) {
        const teammateColors = this.getTeammateColors(piece.color);
        if (teammateColors.includes(targetPiece.color)) {
          return false;
        }
      }
    }

    return true;
  }

  private static getTeammateColors(color: string): string[] {
    const teams = {
      'white': ['black'],
      'black': ['white'],
      'red': ['blue'],
      'blue': ['red']
    };
    return teams[color as keyof typeof teams] || [];
  }

  // Victory conditions
  static checkVictoryCondition(
    board: (ChessPiece | null)[][],
    gameMode: '3player' | '4player'
  ): { winner: string | null; gameOver: boolean } {
    const alivePlayers = this.getAlivePlayers(board);
    
    if (gameMode === '3player') {
      if (alivePlayers.length === 1) {
        return { winner: alivePlayers[0], gameOver: true };
      }
    } else if (gameMode === '4player') {
      // Team victory: if both enemy kings are captured
      const whiteAlive = alivePlayers.includes('white');
      const blackAlive = alivePlayers.includes('black');
      const redAlive = alivePlayers.includes('red');
      const blueAlive = alivePlayers.includes('blue');
      
      const team1Alive = whiteAlive || blackAlive;
      const team2Alive = redAlive || blueAlive;
      
      if (!team1Alive) {
        return { winner: 'Team 2 (Red & Blue)', gameOver: true };
      } else if (!team2Alive) {
        return { winner: 'Team 1 (White & Black)', gameOver: true };
      }
    }
    
    return { winner: null, gameOver: false };
  }

  private static getAlivePlayers(board: (ChessPiece | null)[][]): string[] {
    const alivePlayers = new Set<string>();
    
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece && piece.type === 'king') {
          alivePlayers.add(piece.color);
        }
      }
    }
    
    return Array.from(alivePlayers);
  }

  // Special abilities for multiplayer
  static getSpecialAbilities(piece: ChessPiece, gameMode: '3player' | '4player'): string[] {
    const abilities: string[] = [];
    
    switch (piece.type) {
      case 'pawn':
        abilities.push('Zombie Horde: Move multiple pawns of same color in one turn');
        break;
      case 'knight':
        abilities.push('Teleport: Jump to any empty square once per game');
        break;
      case 'bishop':
        abilities.push('Witch Potion: Heal damaged piece or poison enemy');
        break;
      case 'rook':
        abilities.push('Castle Wall: Create temporary barrier');
        break;
      case 'queen':
        abilities.push('Royal Command: Control enemy piece for one move');
        break;
      case 'king':
        abilities.push('Royal Decree: Force temporary alliance');
        break;
    }
    
    if (gameMode === '3player') {
      abilities.push('Alliance Formation: Create temporary partnership');
    }
    
    if (gameMode === '4player') {
      abilities.push('Team Coordination: Enhanced abilities with teammate');
    }
    
    return abilities;
  }

  // Turn order management
  static getNextPlayer(currentPlayer: number, gameMode: '3player' | '4player', alivePlayers: string[]): number {
    const maxPlayers = gameMode === '3player' ? 3 : 4;
    let nextPlayer = (currentPlayer + 1) % maxPlayers;
    
    // Skip eliminated players
    while (!alivePlayers.includes(['white', 'black', 'red', 'blue'][nextPlayer]) && 
           nextPlayer !== currentPlayer) {
      nextPlayer = (nextPlayer + 1) % maxPlayers;
    }
    
    return nextPlayer;
  }

  // Special movement rules for triangular board
  static getTriangularValidMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    piece: ChessPiece
  ): Position[] {
    const moves = ChessLogic.getValidMoves(board, position, '3player');
    
    // Filter moves to ensure they're within triangular bounds
    return moves.filter(move => {
      return move.row >= 0 && move.row < 9 && 
             move.col >= 0 && move.col <= move.row;
    });
  }

  // Corner bonus squares for special boards
  static getCornerBonuses(position: Position, gameMode: '3player' | '4player'): string[] {
    const bonuses: string[] = [];
    
    if (gameMode === '3player') {
      // Triangle corners provide movement bonuses
      if ((position.row === 0 && position.col === 0) ||
          (position.row === 8 && position.col === 0) ||
          (position.row === 8 && position.col === 8)) {
        bonuses.push('Corner Power: Extra move this turn');
      }
    } else if (gameMode === '4player') {
      // Center squares provide control bonuses
      if ((position.row >= 4 && position.row <= 5) &&
          (position.col >= 4 && position.col <= 5)) {
        bonuses.push('Center Control: Enhanced piece abilities');
      }
    }
    
    return bonuses;
  }
}
