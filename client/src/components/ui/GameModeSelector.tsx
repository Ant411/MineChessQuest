import { useState } from 'react';
import { MinecraftButton } from './MinecraftButton';
import { useChessGame } from '../../lib/stores/useChessGame';

export function GameModeSelector() {
  const { gameMode, setGameMode, setBiome, currentBiome } = useChessGame();
  const [selectedBiome, setSelectedBiome] = useState(currentBiome);

  const biomes = [
    { id: 'forest', name: 'Forest', icon: '🌲', color: '#228B22' },
    { id: 'desert', name: 'Desert', icon: '🏜️', color: '#F4A460' },
    { id: 'ocean', name: 'Ocean', icon: '🌊', color: '#006994' },
    { id: 'nether', name: 'Nether', icon: '🔥', color: '#8B0000' }
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', description: 'Beginner friendly' },
    { id: 'medium', name: 'Medium', description: 'Balanced challenge' },
    { id: 'hard', name: 'Hard', description: 'Expert level' },
    { id: 'extreme', name: 'Extreme', description: 'Master challenge' }
  ];

  return (
    <div className="minecraft-game-mode-selector">
      <div className="minecraft-panel">
        <h2 className="minecraft-panel-title">Game Configuration</h2>
        
        {/* Biome Selection */}
        <div className="minecraft-section">
          <h3 className="minecraft-section-title">Choose Your Biome</h3>
          <div className="minecraft-biome-grid">
            {biomes.map((biome) => (
              <MinecraftButton
                key={biome.id}
                onClick={() => {
                  setSelectedBiome(biome.id as any);
                  setBiome(biome.id as any);
                }}
                variant={selectedBiome === biome.id ? 'selected' : 'secondary'}
                className="minecraft-biome-button"
                style={{ borderColor: biome.color }}
              >
                <div className="minecraft-biome-content">
                  <div className="minecraft-biome-icon">{biome.icon}</div>
                  <div className="minecraft-biome-name">{biome.name}</div>
                </div>
              </MinecraftButton>
            ))}
          </div>
        </div>

        {/* Difficulty Selection (for single player) */}
        {gameMode === '1player' && (
          <div className="minecraft-section">
            <h3 className="minecraft-section-title">Difficulty Level</h3>
            <div className="minecraft-difficulty-list">
              {difficulties.map((difficulty) => (
                <MinecraftButton
                  key={difficulty.id}
                  onClick={() => {
                    // Set difficulty logic here
                    console.log('Selected difficulty:', difficulty.id);
                  }}
                  variant="secondary"
                  className="minecraft-difficulty-button"
                >
                  <div className="minecraft-difficulty-content">
                    <div className="minecraft-difficulty-name">{difficulty.name}</div>
                    <div className="minecraft-difficulty-description">{difficulty.description}</div>
                  </div>
                </MinecraftButton>
              ))}
            </div>
          </div>
        )}

        {/* Game Mode Info */}
        <div className="minecraft-section">
          <h3 className="minecraft-section-title">Game Mode: {gameMode}</h3>
          <div className="minecraft-mode-info">
            {gameMode === '2player' && (
              <p>Classic chess rules with Minecraft characters on an 8x8 board.</p>
            )}
            {gameMode === '1player' && (
              <p>Challenge our AI opponents with varying difficulty levels.</p>
            )}
            {gameMode === '3player' && (
              <p>Triangular board with modified rules for three-way battles.</p>
            )}
            {gameMode === '4player' && (
              <p>Team-based chess on an expanded board with alliance mechanics.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
