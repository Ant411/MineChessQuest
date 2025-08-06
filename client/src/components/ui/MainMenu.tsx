import { useState } from 'react';
import { MinecraftButton } from './MinecraftButton';
import { useChessGame } from '../../lib/stores/useChessGame';
import { useTheme } from '../../lib/stores/useTheme';
import { useMultiplayer } from '../../lib/stores/useMultiplayer';
import { useIsMobile } from '../../hooks/use-is-mobile';

export function MainMenu() {
  const { setGameState, setGameMode } = useChessGame();
  const { currentTheme } = useTheme();
  const { setShowMultiplayerMenu } = useMultiplayer();
  const isMobile = useIsMobile();
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState(false);

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
    <div className={`minecraft-menu ${currentTheme} ${isMobile ? 'mobile-menu' : 'desktop-menu'}`}>
      <div className="minecraft-container scrollable-container">
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

        {/* Game Instructions */}
        {isMobile && (
          <div className="minecraft-mobile-instructions">
            <MinecraftButton
              onClick={() => setShowInstructions(!showInstructions)}
              variant="secondary"
              size="medium"
              className="w-full"
            >
              📱 Touch Controls Guide
            </MinecraftButton>
            
            {showInstructions && (
              <div className="minecraft-instructions-panel">
                <h3 className="minecraft-section-title">Mobile Controls</h3>
                <div className="instruction-grid">
                  <div className="instruction-item">
                    <span className="instruction-icon">👆</span>
                    <span className="instruction-text">Tap piece to select</span>
                  </div>
                  <div className="instruction-item">
                    <span className="instruction-icon">✋</span>
                    <span className="instruction-text">Tap destination to move</span>
                  </div>
                  <div className="instruction-item">
                    <span className="instruction-icon">🔄</span>
                    <span className="instruction-text">Pinch to zoom camera</span>
                  </div>
                  <div className="instruction-item">
                    <span className="instruction-icon">📱</span>
                    <span className="instruction-text">Rotate for landscape</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
