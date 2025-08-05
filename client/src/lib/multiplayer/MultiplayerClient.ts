// Types duplicated from server to avoid direct server imports
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
  rounds: any[];
  currentRound: number;
  winner?: Player;
  createdAt: Date;
  startTime?: Date;
  endTime?: Date;
}

export interface PlayerHistory {
  playerId: string;
  games: any[];
  achievements: any[];
  totalGamesPlayed: number;
  totalGamesWon: number;
  rating: number;
  favoriteOpponents: string[];
}

export type ConnectionType = 'wifi' | 'bluetooth' | 'internet';
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface MultiplayerEvents {
  player_registered: (data: { player: Player; rooms: GameRoom[] }) => void;
  nearby_players_found: (data: { players: Player[] }) => void;
  room_created: (data: { room: GameRoom }) => void;
  room_joined: (data: { room: GameRoom }) => void;
  room_list_updated: (data: { rooms: GameRoom[] }) => void;
  player_joined_room: (data: { player: Player; room: GameRoom }) => void;
  game_started: (data: { room: GameRoom }) => void;
  game_move: (data: { move: any; gameState: any }) => void;
  tournament_created: (data: { tournament: Tournament }) => void;
  tournament_joined: (data: { tournament: Tournament }) => void;
  tournament_started: (data: { tournament: Tournament }) => void;
  matchmaking_success: (data: { room: GameRoom }) => void;
  matchmaking_failed: (data: { message: string }) => void;
  player_history: (data: { history: PlayerHistory }) => void;
  leaderboard: (data: { leaderboard: Player[]; category: string }) => void;
  error: (data: { message: string }) => void;
  connection_status: (status: ConnectionStatus) => void;
}

export class MultiplayerClient {
  private ws: WebSocket | null = null;
  private eventListeners: Map<keyof MultiplayerEvents, Set<Function>> = new Map();
  private connectionStatus: ConnectionStatus = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number | null = null;
  private currentPlayer: Player | null = null;
  private discoveredPlayers: Player[] = [];
  private connectionType: ConnectionType = 'internet';

  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    Object.keys({} as MultiplayerEvents).forEach(event => {
      this.eventListeners.set(event as keyof MultiplayerEvents, new Set());
    });
  }

  // Connection Management
  async connect(connectionType: ConnectionType = 'internet'): Promise<void> {
    this.connectionType = connectionType;
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    this.setConnectionStatus('connecting');

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/multiplayer`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('Connected to multiplayer server');
        this.setConnectionStatus('connected');
        this.reconnectAttempts = 0;
        
        // Clear any pending reconnection
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('Disconnected from multiplayer server');
        this.setConnectionStatus('disconnected');
        this.attemptReconnection();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.setConnectionStatus('error');
      };

    } catch (error) {
      console.error('Failed to connect to multiplayer server:', error);
      this.setConnectionStatus('error');
      throw error;
    }
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.setConnectionStatus('disconnected');
  }

  private attemptReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff, max 30s

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect(this.connectionType);
    }, delay);
  }

  private setConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.emit('connection_status', status);
  }

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // Player Management
  async registerPlayer(playerData: {
    name: string;
    avatar?: string;
    deviceType?: 'mobile' | 'desktop';
  }): Promise<void> {
    const playerId = localStorage.getItem('minecraft_chess_player_id') || this.generatePlayerId();
    localStorage.setItem('minecraft_chess_player_id', playerId);

    const savedPlayerData = this.loadPlayerData(playerId);
    
    this.sendMessage({
      type: 'register_player',
      data: {
        playerId,
        name: playerData.name,
        avatar: playerData.avatar,
        deviceType: playerData.deviceType || (this.isMobile() ? 'mobile' : 'desktop'),
        connectionType: this.connectionType,
        ...savedPlayerData
      }
    });
  }

  // Room Management
  async createRoom(roomData: {
    name: string;
    gameMode: '2player' | '3player' | '4player';
    biome: string;
    isPrivate?: boolean;
    password?: string;
  }): Promise<void> {
    this.sendMessage({
      type: 'create_room',
      data: roomData
    });
  }

  async joinRoom(roomId: string, password?: string): Promise<void> {
    if (!this.currentPlayer) {
      throw new Error('Player not registered');
    }

    this.sendMessage({
      type: 'join_room',
      data: {
        roomId,
        playerId: this.currentPlayer.id,
        password
      }
    });
  }

  async leaveRoom(roomId: string): Promise<void> {
    if (!this.currentPlayer) {
      throw new Error('Player not registered');
    }

    this.sendMessage({
      type: 'leave_room',
      data: {
        roomId,
        playerId: this.currentPlayer.id
      }
    });
  }

  async startGame(roomId: string): Promise<void> {
    this.sendMessage({
      type: 'start_game',
      data: { roomId }
    });
  }

  // Game Actions
  async sendGameMove(roomId: string, move: any): Promise<void> {
    if (!this.currentPlayer) {
      throw new Error('Player not registered');
    }

    this.sendMessage({
      type: 'game_move',
      data: {
        roomId,
        playerId: this.currentPlayer.id,
        move
      }
    });
  }

  // Tournament Management
  async createTournament(tournamentData: {
    name: string;
    gameMode: '2player' | '3player' | '4player';
    biome: string;
    maxParticipants?: number;
  }): Promise<void> {
    this.sendMessage({
      type: 'create_tournament',
      data: tournamentData
    });
  }

  async joinTournament(tournamentId: string): Promise<void> {
    if (!this.currentPlayer) {
      throw new Error('Player not registered');
    }

    this.sendMessage({
      type: 'join_tournament',
      data: {
        tournamentId,
        playerId: this.currentPlayer.id
      }
    });
  }

  // Discovery and Matchmaking
  async findNearbyPlayers(location?: { lat: number; lng: number }): Promise<void> {
    if (!this.currentPlayer) {
      throw new Error('Player not registered');
    }

    this.sendMessage({
      type: 'find_nearby_players',
      data: {
        playerId: this.currentPlayer.id,
        location,
        connectionType: this.connectionType
      }
    });
  }

  async requestMatchmaking(options: {
    gameMode: '2player' | '3player' | '4player';
    biome: string;
    ratingRange?: number;
  }): Promise<void> {
    if (!this.currentPlayer) {
      throw new Error('Player not registered');
    }

    this.sendMessage({
      type: 'matchmaking_request',
      data: {
        playerId: this.currentPlayer.id,
        ...options
      }
    });
  }

  // Player History and Stats
  async getPlayerHistory(playerId?: string): Promise<void> {
    const targetPlayerId = playerId || this.currentPlayer?.id;
    if (!targetPlayerId) {
      throw new Error('Player ID required');
    }

    this.sendMessage({
      type: 'get_player_history',
      data: { playerId: targetPlayerId }
    });
  }

  async getLeaderboard(category: 'rating' | 'games_won' | 'games_played' = 'rating', limit = 100): Promise<void> {
    this.sendMessage({
      type: 'get_leaderboard',
      data: { category, limit }
    });
  }

  // Invitations
  async invitePlayer(playerId: string, roomId: string): Promise<void> {
    if (!this.currentPlayer) {
      throw new Error('Player not registered');
    }

    this.sendMessage({
      type: 'invite_player',
      data: {
        fromPlayerId: this.currentPlayer.id,
        toPlayerId: playerId,
        roomId
      }
    });
  }

  // Event System
  on<K extends keyof MultiplayerEvents>(event: K, callback: MultiplayerEvents[K]): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off<K extends keyof MultiplayerEvents>(event: K, callback: MultiplayerEvents[K]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit<K extends keyof MultiplayerEvents>(event: K, ...args: Parameters<MultiplayerEvents[K]>): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          (callback as any)(...args);
        } catch (error) {
          console.error(`Error in event callback for ${event}:`, error);
        }
      });
    }
  }

  // Message Handling
  private handleMessage(message: any): void {
    console.log('Received multiplayer message:', message.type);

    switch (message.type) {
      case 'player_registered':
        this.currentPlayer = message.data.player;
        this.savePlayerData(this.currentPlayer);
        this.emit('player_registered', message.data);
        break;
        
      case 'nearby_players_found':
        this.discoveredPlayers = message.data.players;
        this.emit('nearby_players_found', message.data);
        break;
        
      default:
        // Emit the event with its data
        this.emit(message.type as keyof MultiplayerEvents, message.data);
        break;
    }
  }

  private sendMessage(message: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, message not sent:', message);
      return;
    }

    this.ws.send(JSON.stringify(message));
  }

  // Utility Methods
  private generatePlayerId(): string {
    return 'player_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  private loadPlayerData(playerId: string): Partial<Player> {
    try {
      const data = localStorage.getItem(`minecraft_chess_player_${playerId}`);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading player data:', error);
      return {};
    }
  }

  private savePlayerData(player: Player): void {
    try {
      localStorage.setItem(`minecraft_chess_player_${player.id}`, JSON.stringify({
        rating: player.rating,
        gamesPlayed: player.gamesPlayed,
        gamesWon: player.gamesWon,
        lastSeen: player.lastSeen
      }));
    } catch (error) {
      console.error('Error saving player data:', error);
    }
  }

  // Getters
  getCurrentPlayer(): Player | null {
    return this.currentPlayer;
  }

  getDiscoveredPlayers(): Player[] {
    return this.discoveredPlayers;
  }

  getConnectionType(): ConnectionType {
    return this.connectionType;
  }
}

// Singleton instance
export const multiplayerClient = new MultiplayerClient();