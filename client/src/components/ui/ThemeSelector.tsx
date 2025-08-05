import { useState } from 'react';
import { MinecraftButton } from './MinecraftButton';
import { useTheme } from '../../lib/stores/useTheme';

export function ThemeSelector() {
  const { currentTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="minecraft-theme-selector">
      <MinecraftButton
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        size="small"
        className="minecraft-theme-toggle"
      >
        {currentTheme === 'dark' ? '🌙' : '☀️'}
      </MinecraftButton>
      
      {isOpen && (
        <div className="minecraft-theme-menu">
          <div className="minecraft-theme-header">Theme</div>
          
          <MinecraftButton
            onClick={() => {
              if (currentTheme !== 'light') toggleTheme();
              setIsOpen(false);
            }}
            variant={currentTheme === 'light' ? 'selected' : 'secondary'}
            size="small"
            className="minecraft-theme-option"
          >
            ☀️ Light Mode
          </MinecraftButton>
          
          <MinecraftButton
            onClick={() => {
              if (currentTheme !== 'dark') toggleTheme();
              setIsOpen(false);
            }}
            variant={currentTheme === 'dark' ? 'selected' : 'secondary'}
            size="small"
            className="minecraft-theme-option"
          >
            🌙 Dark Mode
          </MinecraftButton>
        </div>
      )}
    </div>
  );
}
