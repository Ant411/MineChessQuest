import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  gamesPlayed: number;
  gamesWon: number;
  lastSeen: Date;
  deviceType: 'mobile' | 'desktop';
  connectionType: 'wifi' | 'bluetooth' | 'internet';
}

export interface GameRoom {
  id: string;
  name: string;
  gameMode: '2player' | '3player' | '4player';
  biome: string;
  players: Player[];
  maxPlayers: number;
  isPrivate: boolean;
  password?: string;
  status: 'waiting' | 'playing' | 'finished';
  gameState?: any;
  createdAt: Date;
  tournamentId?: string;
}

export interface Tournament {
  id: string;
  name: string;
  gameMode: '2player' | '3player' | '4player';
  biome: string;
  status: 'registration' | 'active' | 'finished';
  participants: Player[];
  maxParticipants: number;
  rounds: TournamentRound[];
  currentRound: number;
  winner?: Player;
  createdAt: Date;
  startTime?: Date;
  endTime?: Date;
}

export interface TournamentRound {
  roundNumber: number;
  matches: GameRoom[];
  status: 'pending' | 'active' | 'completed';
}

export interface PlayerHistory {
  playerId: string;
  games: GameHistoryEntry[];
  achievements: Achievement[];
  totalGamesPlayed: number;
  totalGamesWon: number;
  rating: number;
  favoriteOpponents: string[];
}

export interface GameHistoryEntry {
  gameId: string;
  gameMode: string;
  biome: string;
  players: Player[];
  result: 'win' | 'loss' | 'draw';
  moves: number;
  duration: number;
  date: Date;
  tournamentId?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export class MultiplayerServer {
  private wss: WebSocketServer;
  private players: Map<string, Player> = new Map();
  private rooms: Map<string, GameRoom> = new Map();
  private tournaments: Map<string, Tournament> = new Map();
  private playerConnections: Map<string, WebSocket> = new Map();
  private playerHistory: Map<string, PlayerHistory> = new Map();
  private nearbyPlayers: Map<string, Player[]> = new Map(); // For local WiFi/Bluetooth discovery

  constructor(server: any) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/multiplayer'
    });

    this.wss.on('connection', (ws: WebSocket, req) => {
      console.log('New multiplayer connection established');
      
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing message:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    // Initialize achievement system
    this.initializeAchievements();
  }

  private handleMessage(ws: WebSocket, message: any) {
    console.log('Received message:', message.type);

    switch (message.type) {
      case 'register_player':
        this.registerPlayer(ws, message.data);
        break;
      case 'find_nearby_players':
        this.findNearbyPlayers(ws, message.data);
        break;
      case 'create_room':
        this.createRoom(ws, message.data);
        break;
      case 'join_room':
        this.joinRoom(ws, message.data);
        break;
      case 'leave_room':
        this.leaveRoom(ws, message.data);
        break;
      case 'start_game':
        this.startGame(ws, message.data);
        break;
      case 'game_move':
        this.handleGameMove(ws, message.data);
        break;
      case 'create_tournament':
        this.createTournament(ws, message.data);
        break;
      case 'join_tournament':
        this.joinTournament(ws, message.data);
        break;
      case 'get_player_history':
        this.getPlayerHistory(ws, message.data);
        break;
      case 'get_leaderboard':
        this.getLeaderboard(ws, message.data);
        break;
      case 'invite_player':
        this.invitePlayer(ws, message.data);
        break;
      case 'matchmaking_request':
        this.handleMatchmaking(ws, message.data);
        break;
      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
    }
  }

  private registerPlayer(ws: WebSocket, data: any) {
    const player: Player = {
      id: data.playerId || uuidv4(),
      name: data.name,
      avatar: data.avatar,
      rating: data.rating || 1200,
      gamesPlayed: data.gamesPlayed || 0,
      gamesWon: data.gamesWon || 0,
      lastSeen: new Date(),
      deviceType: data.deviceType || 'desktop',
      connectionType: data.connectionType || 'internet'
    };

    this.players.set(player.id, player);
    this.playerConnections.set(player.id, ws);

    // Initialize player history if doesn't exist
    if (!this.playerHistory.has(player.id)) {
      this.playerHistory.set(player.id, {
        playerId: player.id,
        games: [],
        achievements: [],
        totalGamesPlayed: 0,
        totalGamesWon: 0,
        rating: player.rating,
        favoriteOpponents: []
      });
    }

    ws.send(JSON.stringify({
      type: 'player_registered',
      data: { player, rooms: Array.from(this.rooms.values()) }
    }));

    // Broadcast player joined to others
    this.broadcast({
      type: 'player_joined',
      data: { player }
    }, [player.id]);
  }

  private findNearbyPlayers(ws: WebSocket, data: any) {
    const { playerId, location, range = 100 } = data;
    
    // Simulate nearby player discovery (in real implementation, would use actual location/network discovery)
    const nearbyPlayers = Array.from(this.players.values())
      .filter(p => p.id !== playerId && p.connectionType === 'wifi')
      .slice(0, 10); // Limit to 10 nearby players

    this.nearbyPlayers.set(playerId, nearbyPlayers);

    ws.send(JSON.stringify({
      type: 'nearby_players_found',
      data: { players: nearbyPlayers }
    }));
  }

  private createRoom(ws: WebSocket, data: any) {
    const room: GameRoom = {
      id: uuidv4(),
      name: data.name,
      gameMode: data.gameMode,
      biome: data.biome,
      players: [],
      maxPlayers: this.getMaxPlayersForMode(data.gameMode),
      isPrivate: data.isPrivate || false,
      password: data.password,
      status: 'waiting',
      createdAt: new Date(),
      tournamentId: data.tournamentId
    };

    this.rooms.set(room.id, room);

    ws.send(JSON.stringify({
      type: 'room_created',
      data: { room }
    }));

    // Broadcast new room to all players
    this.broadcast({
      type: 'room_list_updated',
      data: { rooms: Array.from(this.rooms.values()) }
    });
  }

  private joinRoom(ws: WebSocket, data: any) {
    const { roomId, playerId, password } = data;
    const room = this.rooms.get(roomId);
    const player = this.players.get(playerId);

    if (!room || !player) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Room or player not found'
      }));
      return;
    }

    // Check password for private rooms
    if (room.isPrivate && room.password !== password) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid room password'
      }));
      return;
    }

    // Check if room is full
    if (room.players.length >= room.maxPlayers) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Room is full'
      }));
      return;
    }

    // Add player to room
    room.players.push(player);

    ws.send(JSON.stringify({
      type: 'room_joined',
      data: { room }
    }));

    // Notify other players in the room
    this.broadcastToRoom(roomId, {
      type: 'player_joined_room',
      data: { player, room }
    }, [playerId]);
  }

  private startGame(ws: WebSocket, data: any) {
    const { roomId } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Room not found'
      }));
      return;
    }

    if (room.players.length < 2) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Not enough players to start game'
      }));
      return;
    }

    room.status = 'playing';
    room.gameState = this.initializeGameState(room.gameMode, room.biome);

    // Notify all players in room that game started
    this.broadcastToRoom(roomId, {
      type: 'game_started',
      data: { room }
    });
  }

  private handleGameMove(ws: WebSocket, data: any) {
    const { roomId, move, playerId } = data;
    const room = this.rooms.get(roomId);

    if (!room || room.status !== 'playing') {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid game state'
      }));
      return;
    }

    // Validate and apply move
    room.gameState.moves.push(move);
    room.gameState.currentPlayer = this.getNextPlayer(room.gameState.currentPlayer, room.gameMode);

    // Broadcast move to all players in room
    this.broadcastToRoom(roomId, {
      type: 'game_move',
      data: { move, gameState: room.gameState }
    });

    // Check for game end conditions
    this.checkGameEnd(room);
  }

  private createTournament(ws: WebSocket, data: any) {
    const tournament: Tournament = {
      id: uuidv4(),
      name: data.name,
      gameMode: data.gameMode,
      biome: data.biome,
      status: 'registration',
      participants: [],
      maxParticipants: data.maxParticipants || 16,
      rounds: [],
      currentRound: 0,
      createdAt: new Date()
    };

    this.tournaments.set(tournament.id, tournament);

    ws.send(JSON.stringify({
      type: 'tournament_created',
      data: { tournament }
    }));

    // Broadcast tournament to all players
    this.broadcast({
      type: 'tournament_list_updated',
      data: { tournaments: Array.from(this.tournaments.values()) }
    });
  }

  private joinTournament(ws: WebSocket, data: any) {
    const { tournamentId, playerId } = data;
    const tournament = this.tournaments.get(tournamentId);
    const player = this.players.get(playerId);

    if (!tournament || !player) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Tournament or player not found'
      }));
      return;
    }

    if (tournament.status !== 'registration') {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Tournament registration is closed'
      }));
      return;
    }

    if (tournament.participants.length >= tournament.maxParticipants) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Tournament is full'
      }));
      return;
    }

    tournament.participants.push(player);

    ws.send(JSON.stringify({
      type: 'tournament_joined',
      data: { tournament }
    }));

    // Check if tournament is ready to start
    if (tournament.participants.length >= 4) {
      this.startTournament(tournament);
    }
  }

  private startTournament(tournament: Tournament) {
    tournament.status = 'active';
    tournament.startTime = new Date();

    // Generate tournament bracket
    const rounds = this.generateTournamentBracket(tournament.participants, tournament.gameMode);
    tournament.rounds = rounds;

    // Create first round matches
    this.createTournamentMatches(tournament, 0);

    // Notify all participants
    tournament.participants.forEach(player => {
      const ws = this.playerConnections.get(player.id);
      if (ws) {
        ws.send(JSON.stringify({
          type: 'tournament_started',
          data: { tournament }
        }));
      }
    });
  }

  private handleMatchmaking(ws: WebSocket, data: any) {
    const { playerId, gameMode, biome, ratingRange = 200 } = data;
    const player = this.players.get(playerId);

    if (!player) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Player not found'
      }));
      return;
    }

    // Find suitable opponents
    const opponents = Array.from(this.players.values())
      .filter(p => 
        p.id !== playerId &&
        Math.abs(p.rating - player.rating) <= ratingRange &&
        this.playerConnections.has(p.id)
      )
      .sort((a, b) => Math.abs(a.rating - player.rating) - Math.abs(b.rating - player.rating))
      .slice(0, this.getMaxPlayersForMode(gameMode) - 1);

    if (opponents.length === 0) {
      ws.send(JSON.stringify({
        type: 'matchmaking_failed',
        message: 'No suitable opponents found'
      }));
      return;
    }

    // Create automatic room for matched players
    const room: GameRoom = {
      id: uuidv4(),
      name: `Auto Match - ${gameMode}`,
      gameMode,
      biome,
      players: [player, ...opponents],
      maxPlayers: this.getMaxPlayersForMode(gameMode),
      isPrivate: false,
      status: 'waiting',
      createdAt: new Date()
    };

    this.rooms.set(room.id, room);

    // Notify all matched players
    room.players.forEach(p => {
      const playerWs = this.playerConnections.get(p.id);
      if (playerWs) {
        playerWs.send(JSON.stringify({
          type: 'matchmaking_success',
          data: { room }
        }));
      }
    });
  }

  private getPlayerHistory(ws: WebSocket, data: any) {
    const { playerId } = data;
    const history = this.playerHistory.get(playerId);

    if (!history) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Player history not found'
      }));
      return;
    }

    ws.send(JSON.stringify({
      type: 'player_history',
      data: { history }
    }));
  }

  private getLeaderboard(ws: WebSocket, data: any) {
    const { category = 'rating', limit = 100 } = data;
    
    let leaderboard = Array.from(this.players.values());

    switch (category) {
      case 'rating':
        leaderboard.sort((a, b) => b.rating - a.rating);
        break;
      case 'games_won':
        leaderboard.sort((a, b) => b.gamesWon - a.gamesWon);
        break;
      case 'games_played':
        leaderboard.sort((a, b) => b.gamesPlayed - a.gamesPlayed);
        break;
    }

    leaderboard = leaderboard.slice(0, limit);

    ws.send(JSON.stringify({
      type: 'leaderboard',
      data: { leaderboard, category }
    }));
  }

  // Helper methods
  private getMaxPlayersForMode(gameMode: string): number {
    switch (gameMode) {
      case '2player': return 2;
      case '3player': return 3;
      case '4player': return 4;
      default: return 2;
    }
  }

  private initializeGameState(gameMode: string, biome: string) {
    return {
      gameMode,
      biome,
      currentPlayer: 'white',
      moves: [],
      board: this.createInitialBoard(gameMode),
      startTime: new Date()
    };
  }

  private createInitialBoard(gameMode: string) {
    // Implementation depends on game mode
    // Return appropriate board configuration
    return [];
  }

  private getNextPlayer(currentPlayer: string, gameMode: string): string {
    const playerOrder = gameMode === '4player' 
      ? ['white', 'black', 'red', 'blue']
      : gameMode === '3player'
      ? ['white', 'black', 'red']
      : ['white', 'black'];
    
    const currentIndex = playerOrder.indexOf(currentPlayer);
    return playerOrder[(currentIndex + 1) % playerOrder.length];
  }

  private checkGameEnd(room: GameRoom) {
    // Implement game end logic
    // Update player stats and history when game ends
  }

  private generateTournamentBracket(participants: Player[], gameMode: string): TournamentRound[] {
    const rounds: TournamentRound[] = [];
    let currentParticipants = [...participants];
    let roundNumber = 1;

    while (currentParticipants.length > 1) {
      const matches: GameRoom[] = [];
      const playersPerMatch = this.getMaxPlayersForMode(gameMode);
      
      for (let i = 0; i < currentParticipants.length; i += playersPerMatch) {
        const matchPlayers = currentParticipants.slice(i, i + playersPerMatch);
        if (matchPlayers.length >= 2) {
          matches.push({
            id: uuidv4(),
            name: `Round ${roundNumber} - Match ${matches.length + 1}`,
            gameMode,
            biome: 'forest', // Default biome for tournament
            players: matchPlayers,
            maxPlayers: playersPerMatch,
            isPrivate: false,
            status: 'waiting',
            createdAt: new Date()
          });
        }
      }

      rounds.push({
        roundNumber,
        matches,
        status: 'pending'
      });

      // Prepare for next round (winners advance)
      currentParticipants = matches.flatMap(match => match.players.slice(0, Math.ceil(match.players.length / 2)));
      roundNumber++;
    }

    return rounds;
  }

  private createTournamentMatches(tournament: Tournament, roundIndex: number) {
    const round = tournament.rounds[roundIndex];
    if (!round) return;

    round.status = 'active';
    
    round.matches.forEach(match => {
      this.rooms.set(match.id, match);
    });
  }

  private broadcast(message: any, excludePlayerIds: string[] = []) {
    this.playerConnections.forEach((ws, playerId) => {
      if (!excludePlayerIds.includes(playerId)) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  private broadcastToRoom(roomId: string, message: any, excludePlayerIds: string[] = []) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.players.forEach(player => {
      if (!excludePlayerIds.includes(player.id)) {
        const ws = this.playerConnections.get(player.id);
        if (ws) {
          ws.send(JSON.stringify(message));
        }
      }
    });
  }

  private handleDisconnection(ws: WebSocket) {
    // Find and remove player connection
    let disconnectedPlayerId: string | null = null;
    
    this.playerConnections.forEach((connection, playerId) => {
      if (connection === ws) {
        disconnectedPlayerId = playerId;
      }
    });

    if (disconnectedPlayerId) {
      this.playerConnections.delete(disconnectedPlayerId);
      
      // Update player's last seen time
      const player = this.players.get(disconnectedPlayerId);
      if (player) {
        player.lastSeen = new Date();
      }

      // Remove player from rooms
      this.rooms.forEach(room => {
        const playerIndex = room.players.findIndex(p => p.id === disconnectedPlayerId);
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);
          
          // Notify other players in room
          this.broadcastToRoom(room.id, {
            type: 'player_left_room',
            data: { playerId: disconnectedPlayerId, room }
          });
        }
      });

      console.log(`Player ${disconnectedPlayerId} disconnected`);
    }
  }

  private initializeAchievements() {
    // Define achievements that players can unlock
    const achievements = [
      {
        id: 'first_win',
        name: 'First Victory',
        description: 'Win your first game',
        icon: '🏆',
        rarity: 'common' as const
      },
      {
        id: 'chess_master',
        name: 'Chess Master',
        description: 'Win 100 games',
        icon: '👑',
        rarity: 'legendary' as const
      },
      {
        id: 'tournament_winner',
        name: 'Tournament Champion',
        description: 'Win a tournament',
        icon: '🥇',
        rarity: 'epic' as const
      },
      {
        id: 'multiplayer_enthusiast',
        name: 'Social Player',
        description: 'Play 50 multiplayer games',
        icon: '🤝',
        rarity: 'rare' as const
      }
    ];
    
    // Store achievements for later use
    (this as any).availableAchievements = achievements;
  }
}