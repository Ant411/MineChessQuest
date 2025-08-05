import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeState {
  currentTheme: Theme;
  
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeState>()(
  subscribeWithSelector((set, get) => ({
    currentTheme: "light",
    
    toggleTheme: () => {
      const { currentTheme } = get();
      const newTheme = currentTheme === "light" ? "dark" : "light";
      set({ currentTheme: newTheme });
      
      // Update CSS variables
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Store preference
      localStorage.setItem('minecraft-chess-theme', newTheme);
    },
    
    setTheme: (theme) => {
      set({ currentTheme: theme });
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('minecraft-chess-theme', theme);
    }
  }))
);

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('minecraft-chess-theme') as Theme;
if (savedTheme) {
  useTheme.getState().setTheme(savedTheme);
}
