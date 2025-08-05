import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface Player {
  id: number;
  name: string;
  color: 'white' | 'black' | 'red' | 'blue';
  score: number;
  gamesWon: number;
  gamesPlayed: number;
  badges: string[];
}

interface PlayerState {
  players: Player[];
  currentPlayerIndex: number;
  playerCount: number;
  
  // Actions
  setPlayerName: (index: number, name: string) => void;
  setPlayerCount: (count: number) => void;
  addScore: (index: number, points: number) => void;
  addBadge: (index: number, badgeId: string) => void;
  recordWin: (index: number) => void;
  recordGame: (playerIndex: number) => void;
  resetPlayers: () => void;
}

const createDefaultPlayer = (index: number): Player => ({
  id: index,
  name: `Player ${index + 1}`,
  color: ['white', 'black', 'red', 'blue'][index] as Player['color'],
  score: 0,
  gamesWon: 0,
  gamesPlayed: 0,
  badges: []
});

export const usePlayer = create<PlayerState>()(
  subscribeWithSelector((set, get) => ({
    players: [createDefaultPlayer(0), createDefaultPlayer(1)],
    currentPlayerIndex: 0,
    playerCount: 2,
    
    setPlayerName: (index, name) => {
      const { players } = get();
      const newPlayers = [...players];
      if (newPlayers[index]) {
        newPlayers[index].name = name;
      }
      set({ players: newPlayers });
    },
    
    setPlayerCount: (count) => {
      const { players } = get();
      const newPlayers = [...players];
      
      // Add or remove players as needed
      while (newPlayers.length < count) {
        newPlayers.push(createDefaultPlayer(newPlayers.length));
      }
      
      if (newPlayers.length > count) {
        newPlayers.splice(count);
      }
      
      set({ players: newPlayers, playerCount: count });
    },
    
    addScore: (index, points) => {
      const { players } = get();
      const newPlayers = [...players];
      if (newPlayers[index]) {
        newPlayers[index].score += points;
      }
      set({ players: newPlayers });
    },
    
    addBadge: (index, badgeId) => {
      const { players } = get();
      const newPlayers = [...players];
      if (newPlayers[index] && !newPlayers[index].badges.includes(badgeId)) {
        newPlayers[index].badges.push(badgeId);
      }
      set({ players: newPlayers });
    },
    
    recordWin: (index) => {
      const { players } = get();
      const newPlayers = [...players];
      if (newPlayers[index]) {
        newPlayers[index].gamesWon++;
        newPlayers[index].score += 100; // Win bonus
      }
      set({ players: newPlayers });
    },
    
    recordGame: (playerIndex) => {
      const { players } = get();
      const newPlayers = [...players];
      newPlayers.forEach(player => {
        player.gamesPlayed++;
      });
      set({ players: newPlayers });
    },
    
    resetPlayers: () => {
      set({
        players: [createDefaultPlayer(0), createDefaultPlayer(1)],
        currentPlayerIndex: 0,
        playerCount: 2
      });
    }
  }))
);
