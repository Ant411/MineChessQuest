import { useState } from 'react';
import { MinecraftButton } from './MinecraftButton';
import { GameModeSelector } from './GameModeSelector';
import { useChessGame } from '../../lib/stores/useChessGame';
import { usePlayer } from '../../lib/stores/usePlayer';

export function PlayerSetup() {
  const { gameMode, setGameState } = useChessGame();
  const { setPlayerName, setPlayerCount, players } = usePlayer();
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);

  const getPlayerCount = () => {
    switch (gameMode) {
      case '1player':
        return 1;
      case '2player':
        return 2;
      case '3player':
        return 3;
      case '4player':
        return 4;
      default:
        return 2;
    }
  };

  const playerCount = getPlayerCount();

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const startGame = () => {
    // Set player names
    for (let i = 0; i < playerCount; i++) {
      setPlayerName(i, playerNames[i] || `Player ${i + 1}`);
    }
    setPlayerCount(playerCount);
    setGameState('playing');
  };

  const canStart = () => {
    // Check if all required names are filled
    for (let i = 0; i < playerCount; i++) {
      if (!playerNames[i]?.trim()) {
        return false;
      }
    }
    return true;
  };

  const getPlayerColors = () => {
    switch (gameMode) {
      case '3player':
        return ['White', 'Black', 'Red'];
      case '4player':
        return ['White', 'Black', 'Red', 'Blue'];
      default:
        return ['White', 'Black'];
    }
  };

  const colors = getPlayerColors();

  return (
    <div className="minecraft-player-setup">
      <div className="minecraft-setup-container">
        <div className="minecraft-setup-header">
          <h2>Player Setup</h2>
          <div className="minecraft-game-mode-display">
            Mode: {gameMode} ({playerCount} player{playerCount > 1 ? 's' : ''})
          </div>
        </div>

        <div className="minecraft-setup-content">
          {/* Game Configuration */}
          <div className="minecraft-setup-section">
            <GameModeSelector />
          </div>

          {/* Player Names */}
          <div className="minecraft-setup-section">
            <h3>Enter Player Names</h3>
            <div className="minecraft-player-inputs">
              {Array.from({ length: playerCount }, (_, index) => (
                <div key={index} className="minecraft-player-input-group">
                  <label className="minecraft-input-label">
                    {colors[index]} Player {gameMode === '1player' && index === 0 ? '(You)' : ''}:
                  </label>
                  <input
                    type="text"
                    className="minecraft-input"
                    placeholder={
                      gameMode === '1player' && index === 0 
                        ? 'Your name...' 
                        : `Player ${index + 1} name...`
                    }
                    value={playerNames[index]}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    maxLength={20}
                  />
                  {gameMode === '1player' && index === 0 && (
                    <div className="minecraft-input-note">
                      Playing against AI
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Team Information (for 4 player) */}
          {gameMode === '4player' && (
            <div className="minecraft-setup-section">
              <h3>Team Configuration</h3>
              <div className="minecraft-teams-info">
                <div className="minecraft-team">
                  <h4>Team 1</h4>
                  <div className="minecraft-team-players">
                    <div className="minecraft-team-player white">
                      {playerNames[0] || 'Player 1'} (White)
                    </div>
                    <div className="minecraft-team-player black">
                      {playerNames[1] || 'Player 2'} (Black)
                    </div>
                  </div>
                </div>
                <div className="minecraft-vs">VS</div>
                <div className="minecraft-team">
                  <h4>Team 2</h4>
                  <div className="minecraft-team-players">
                    <div className="minecraft-team-player red">
                      {playerNames[2] || 'Player 3'} (Red)
                    </div>
                    <div className="minecraft-team-player blue">
                      {playerNames[3] || 'Player 4'} (Blue)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Special Rules Summary */}
          <div className="minecraft-setup-section">
            <h3>Special Rules for {gameMode}</h3>
            <div className="minecraft-rules-summary">
              {gameMode === '1player' && (
                <ul>
                  <li>Play against AI with selected difficulty</li>
                  <li>AI uses character special abilities</li>
                  <li>Score tracked for leaderboards</li>
                </ul>
              )}
              {gameMode === '2player' && (
                <ul>
                  <li>Standard chess rules apply</li>
                  <li>Character special moves available</li>
                  <li>Animated battle sequences for captures</li>
                </ul>
              )}
              {gameMode === '3player' && (
                <ul>
                  <li>Triangular board with modified movement</li>
                  <li>Attack any adjacent opponent</li>
                  <li>Last player standing wins</li>
                  <li>Alliance system available</li>
                </ul>
              )}
              {gameMode === '4player' && (
                <ul>
                  <li>Team-based gameplay</li>
                  <li>Coordinate with your teammate</li>
                  <li>Cannot capture teammate pieces</li>
                  <li>Win by capturing both enemy kings</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="minecraft-setup-actions">
          <MinecraftButton
            onClick={() => setGameState('menu')}
            variant="secondary"
            size="medium"
          >
            ← Back to Menu
          </MinecraftButton>
          
          <MinecraftButton
            onClick={startGame}
            variant="primary"
            size="large"
            disabled={!canStart()}
          >
            Start Game! ⚔️
          </MinecraftButton>
        </div>
      </div>
    </div>
  );
}
