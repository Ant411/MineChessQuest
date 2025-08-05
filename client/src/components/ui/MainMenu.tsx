import { useState } from 'react';
import { MinecraftButton } from './MinecraftButton';
import { useChessGame } from '../../lib/stores/useChessGame';
import { useTheme } from '../../lib/stores/useTheme';
import { useMultiplayer } from '../../lib/stores/useMultiplayer';

export function MainMenu() {
  const { setGameState, setGameMode } = useChessGame();
  const { currentTheme } = useTheme();
  const { setShowMultiplayerMenu } = useMultiplayer();
  const [selectedMode, setSelectedMode] = useState<string>('');

  const startGame = (mode: '2player' | '1player' | '3player' | '4player') => {
    setGameMode(mode);
    setGameState('player_setup');
  };

  const menuItems = [
    {
      id: '1player',
      title: 'Single Player',
      description: 'Play against the computer',
      icon: '🤖'
    },
    {
      id: '2player',
      title: 'Two Players',
      description: 'Classic chess for 2 players',
      icon: '👥'
    },
    {
      id: '3player',
      title: 'Three Players',
      description: 'Triangular board chess',
      icon: '🔺'
    },
    {
      id: '4player',
      title: 'Four Players',
      description: 'Team-based chess battle',
      icon: '⬜'
    }
  ];

  return (
    <div className={`minecraft-menu ${currentTheme}`}>
      <div className="minecraft-container">
        {/* Title */}
        <div className="minecraft-title">
          <h1>MINECRAFT CHESS</h1>
          <div className="minecraft-subtitle">
            Choose your adventure
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="minecraft-game-modes">
          {menuItems.map((item) => (
            <MinecraftButton
              key={item.id}
              onClick={() => startGame(item.id as any)}
              variant={selectedMode === item.id ? 'selected' : 'primary'}
              size="large"
              className="minecraft-mode-button"
              onMouseEnter={() => setSelectedMode(item.id)}
              onMouseLeave={() => setSelectedMode('')}
            >
              <div className="minecraft-mode-content">
                <div className="minecraft-mode-icon">{item.icon}</div>
                <div className="minecraft-mode-text">
                  <div className="minecraft-mode-title">{item.title}</div>
                  <div className="minecraft-mode-description">{item.description}</div>
                </div>
              </div>
            </MinecraftButton>
          ))}
        </div>

        {/* Multiplayer Section */}
        <div className="minecraft-multiplayer-section">
          <MinecraftButton
            onClick={() => setShowMultiplayerMenu(true)}
            variant="primary"
            size="large"
            className="minecraft-multiplayer-button"
          >
            🌐 Online Multiplayer
          </MinecraftButton>
          <div className="minecraft-multiplayer-description">
            Play with friends via WiFi, Bluetooth, or Internet
          </div>
        </div>

        {/* Secondary Menu */}
        <div className="minecraft-secondary-menu">
          <MinecraftButton
            onClick={() => setGameState('help')}
            variant="secondary"
            size="medium"
          >
            📚 Help & Rules
          </MinecraftButton>
          
          <MinecraftButton
            onClick={() => setGameState('scoreboard')}
            variant="secondary"
            size="medium"
          >
            🏆 Scores & Badges
          </MinecraftButton>
        </div>

        {/* Footer */}
        <div className="minecraft-footer">
          <div className="minecraft-version">Minecraft Chess v1.0</div>
          <div className="minecraft-credits">
            Crafted with ⚡ by the Minecraft Chess Team
          </div>
        </div>
      </div>
    </div>
  );
}
