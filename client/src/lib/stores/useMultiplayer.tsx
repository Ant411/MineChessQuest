import { create } from 'zustand';
import { multiplayerClient, ConnectionStatus, ConnectionType } from '../multiplayer/MultiplayerClient';
import type { Player, GameRoom, Tournament, PlayerHistory } from '../multiplayer/MultiplayerClient';

interface MultiplayerState {
  // Connection state
  connectionStatus: ConnectionStatus;
  connectionType: ConnectionType;
  currentPlayer: Player | null;
  
  // Discovery and matchmaking
  nearbyPlayers: Player[];
  availableRooms: GameRoom[];
  currentRoom: GameRoom | null;
  isMatchmaking: boolean;
  
  // Tournament system
  availableTournaments: Tournament[];
  currentTournament: Tournament | null;
  
  // Player data
  playerHistory: PlayerHistory | null;
  leaderboard: Player[];
  favoriteOpponents: Player[];
  
  // UI state
  showMultiplayerMenu: boolean;
  showTournamentBracket: boolean;
  showPlayerHistory: boolean;
  activeTab: 'rooms' | 'tournaments' | 'nearby' | 'history';
  
  // Actions
  connect: (connectionType?: ConnectionType) => Promise<void>;
  disconnect: () => void;
  registerPlayer: (playerData: { name: string; avatar?: string }) => Promise<void>;
  
  // Room actions
  createRoom: (roomData: any) => Promise<void>;
  joinRoom: (roomId: string, password?: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  startGame: (roomId: string) => Promise<void>;
  
  // Tournament actions
  createTournament: (tournamentData: any) => Promise<void>;
  joinTournament: (tournamentId: string) => Promise<void>;
  
  // Discovery and matchmaking
  findNearbyPlayers: () => Promise<void>;
  requestMatchmaking: (options: any) => Promise<void>;
  
  // Data actions
  getPlayerHistory: (playerId?: string) => Promise<void>;
  getLeaderboard: (category?: string) => Promise<void>;
  
  // UI actions
  setActiveTab: (tab: 'rooms' | 'tournaments' | 'nearby' | 'history') => void;
  setShowMultiplayerMenu: (show: boolean) => void;
  setShowTournamentBracket: (show: boolean) => void;
  setShowPlayerHistory: (show: boolean) => void;
}

export const useMultiplayer = create<MultiplayerState>((set, get) => {
  // Initialize event listeners
  multiplayerClient.on('connection_status', (status) => {
    set({ connectionStatus: status });
  });

  multiplayerClient.on('player_registered', (data) => {
    set({ 
      currentPlayer: data.player,
      availableRooms: data.rooms 
    });
  });

  multiplayerClient.on('nearby_players_found', (data) => {
    set({ nearbyPlayers: data.players });
  });

  multiplayerClient.on('room_created', (data) => {
    set(state => ({
      availableRooms: [...state.availableRooms, data.room],
      currentRoom: data.room
    }));
  });

  multiplayerClient.on('room_joined', (data) => {
    set({ currentRoom: data.room });
  });

  multiplayerClient.on('room_list_updated', (data) => {
    set({ availableRooms: data.rooms });
  });

  multiplayerClient.on('tournament_created', (data) => {
    set(state => ({
      availableTournaments: [...state.availableTournaments, data.tournament],
      currentTournament: data.tournament
    }));
  });

  multiplayerClient.on('tournament_joined', (data) => {
    set({ currentTournament: data.tournament });
  });

  multiplayerClient.on('tournament_started', (data) => {
    set({ 
      currentTournament: data.tournament,
      showTournamentBracket: true 
    });
  });

  multiplayerClient.on('matchmaking_success', (data) => {
    set({ 
      currentRoom: data.room,
      isMatchmaking: false 
    });
  });

  multiplayerClient.on('matchmaking_failed', (data) => {
    set({ isMatchmaking: false });
    console.log('Matchmaking failed:', data.message);
  });

  multiplayerClient.on('player_history', (data) => {
    set({ playerHistory: data.history });
  });

  multiplayerClient.on('leaderboard', (data) => {
    set({ leaderboard: data.leaderboard });
  });

  multiplayerClient.on('error', (data) => {
    console.error('Multiplayer error:', data.message);
  });

  return {
    // Initial state
    connectionStatus: 'disconnected',
    connectionType: 'internet',
    currentPlayer: null,
    nearbyPlayers: [],
    availableRooms: [],
    currentRoom: null,
    isMatchmaking: false,
    availableTournaments: [],
    currentTournament: null,
    playerHistory: null,
    leaderboard: [],
    favoriteOpponents: [],
    showMultiplayerMenu: false,
    showTournamentBracket: false,
    showPlayerHistory: false,
    activeTab: 'rooms',

    // Connection actions
    connect: async (connectionType = 'internet') => {
      set({ connectionType });
      await multiplayerClient.connect(connectionType);
    },

    disconnect: () => {
      multiplayerClient.disconnect();
      set({ 
        connectionStatus: 'disconnected',
        currentPlayer: null,
        currentRoom: null,
        currentTournament: null 
      });
    },

    registerPlayer: async (playerData) => {
      await multiplayerClient.registerPlayer(playerData);
    },

    // Room actions
    createRoom: async (roomData) => {
      await multiplayerClient.createRoom(roomData);
    },

    joinRoom: async (roomId, password) => {
      await multiplayerClient.joinRoom(roomId, password);
    },

    leaveRoom: async (roomId) => {
      await multiplayerClient.leaveRoom(roomId);
      set({ currentRoom: null });
    },

    startGame: async (roomId) => {
      await multiplayerClient.startGame(roomId);
    },

    // Tournament actions
    createTournament: async (tournamentData) => {
      await multiplayerClient.createTournament(tournamentData);
    },

    joinTournament: async (tournamentId) => {
      await multiplayerClient.joinTournament(tournamentId);
    },

    // Discovery and matchmaking
    findNearbyPlayers: async () => {
      await multiplayerClient.findNearbyPlayers();
    },

    requestMatchmaking: async (options) => {
      set({ isMatchmaking: true });
      await multiplayerClient.requestMatchmaking(options);
    },

    // Data actions
    getPlayerHistory: async (playerId) => {
      await multiplayerClient.getPlayerHistory(playerId);
    },

    getLeaderboard: async (category) => {
      await multiplayerClient.getLeaderboard(category as any);
    },

    // UI actions
    setActiveTab: (tab) => {
      set({ activeTab: tab });
    },

    setShowMultiplayerMenu: (show) => {
      set({ showMultiplayerMenu: show });
    },

    setShowTournamentBracket: (show) => {
      set({ showTournamentBracket: show });
    },

    setShowPlayerHistory: (show) => {
      set({ showPlayerHistory: show });
    },
  };
});

// Hook for easier access to multiplayer functions
export const useMultiplayerActions = () => {
  const actions = useMultiplayer((state) => ({
    connect: state.connect,
    disconnect: state.disconnect,
    registerPlayer: state.registerPlayer,
    createRoom: state.createRoom,
    joinRoom: state.joinRoom,
    leaveRoom: state.leaveRoom,
    startGame: state.startGame,
    createTournament: state.createTournament,
    joinTournament: state.joinTournament,
    findNearbyPlayers: state.findNearbyPlayers,
    requestMatchmaking: state.requestMatchmaking,
    getPlayerHistory: state.getPlayerHistory,
    getLeaderboard: state.getLeaderboard,
  }));

  return actions;
};