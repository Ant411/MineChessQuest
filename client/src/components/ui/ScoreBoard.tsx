import { useState, useEffect } from 'react';
import { MinecraftButton } from './MinecraftButton';
import { useChessGame } from '../../lib/stores/useChessGame';
import { usePlayer } from '../../lib/stores/usePlayer';
import { getLocalStorage, setLocalStorage } from '../../lib/utils';

interface GameRecord {
  id: string;
  date: string;
  gameMode: string;
  players: string[];
  winner: string;
  duration: number;
  biome: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  dateEarned?: string;
}

export function ScoreBoard() {
  const { setGameState } = useChessGame();
  const { players } = usePlayer();
  const [activeTab, setActiveTab] = useState('scores');
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    // Load game history and badges from localStorage
    const history = getLocalStorage('gameHistory') || [];
    const earnedBadges = getLocalStorage('badges') || [];
    
    setGameHistory(history);
    setBadges(initializeBadges(earnedBadges));
  }, []);

  const initializeBadges = (earnedBadges: any[]): Badge[] => {
    const allBadges: Badge[] = [
      {
        id: 'first_win',
        name: 'Victory Royale',
        description: 'Win your first game',
        icon: '🏆',
        earned: false
      },
      {
        id: 'master_strategist',
        name: 'Master Strategist',
        description: 'Win 10 games',
        icon: '🧠',
        earned: false
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Win a game in under 5 minutes',
        icon: '⚡',
        earned: false
      },
      {
        id: 'biome_explorer',
        name: 'Biome Explorer',
        description: 'Play in all 4 biomes',
        icon: '🗺️',
        earned: false
      },
      {
        id: 'ai_crusher',
        name: 'AI Crusher',
        description: 'Defeat AI on extreme difficulty',
        icon: '🤖',
        earned: false
      },
      {
        id: 'multiplayer_champion',
        name: 'Multiplayer Champion',
        description: 'Win a 4-player game',
        icon: '👑',
        earned: false
      },
      {
        id: 'special_moves_master',
        name: 'Special Moves Master',
        description: 'Use 50 special moves',
        icon: '✨',
        earned: false
      },
      {
        id: 'endurance_player',
        name: 'Endurance Player',
        description: 'Play for 2 hours straight',
        icon: '⏰',
        earned: false
      },
      {
        id: 'triangle_master',
        name: 'Triangle Master',
        description: 'Win 5 three-player games',
        icon: '🔺',
        earned: false
      },
      {
        id: 'nether_conqueror',
        name: 'Nether Conqueror',
        description: 'Win 10 games in Nether biome',
        icon: '🔥',
        earned: false
      }
    ];

    // Mark earned badges
    return allBadges.map(badge => {
      const earned = earnedBadges.find(e => e.id === badge.id);
      return {
        ...badge,
        earned: !!earned,
        dateEarned: earned?.dateEarned
      };
    });
  };

  const getPlayerStats = () => {
    const stats: Record<string, any> = {};
    
    gameHistory.forEach(game => {
      game.players.forEach(player => {
        if (!stats[player]) {
          stats[player] = {
            gamesPlayed: 0,
            gamesWon: 0,
            totalDuration: 0,
            biomes: new Set(),
            gameModes: new Set()
          };
        }
        
        stats[player].gamesPlayed++;
        stats[player].totalDuration += game.duration;
        stats[player].biomes.add(game.biome);
        stats[player].gameModes.add(game.gameMode);
        
        if (game.winner === player) {
          stats[player].gamesWon++;
        }
      });
    });

    // Convert sets to arrays for display
    Object.keys(stats).forEach(player => {
      stats[player].biomes = Array.from(stats[player].biomes);
      stats[player].gameModes = Array.from(stats[player].gameModes);
      stats[player].winRate = stats[player].gamesPlayed > 0 
        ? ((stats[player].gamesWon / stats[player].gamesPlayed) * 100).toFixed(1)
        : '0.0';
    });

    return stats;
  };

  const renderScores = () => {
    const stats = getPlayerStats();
    const sortedPlayers = Object.entries(stats).sort(
      ([, a]: [string, any], [, b]: [string, any]) => b.gamesWon - a.gamesWon
    );

    return (
      <div className="minecraft-scores-content">
        <h3>Player Statistics</h3>
        
        {sortedPlayers.length === 0 ? (
          <div className="minecraft-no-data">
            <div className="minecraft-no-data-icon">📊</div>
            <div className="minecraft-no-data-text">
              No games played yet! Start playing to see your statistics.
            </div>
          </div>
        ) : (
          <div className="minecraft-player-stats">
            {sortedPlayers.map(([playerName, playerStats], index) => (
              <div key={playerName} className="minecraft-player-stat-card">
                <div className="minecraft-player-rank">#{index + 1}</div>
                <div className="minecraft-player-info">
                  <h4 className="minecraft-player-name">{playerName}</h4>
                  <div className="minecraft-stat-grid">
                    <div className="minecraft-stat">
                      <span className="minecraft-stat-label">Games Won:</span>
                      <span className="minecraft-stat-value">{playerStats.gamesWon}</span>
                    </div>
                    <div className="minecraft-stat">
                      <span className="minecraft-stat-label">Games Played:</span>
                      <span className="minecraft-stat-value">{playerStats.gamesPlayed}</span>
                    </div>
                    <div className="minecraft-stat">
                      <span className="minecraft-stat-label">Win Rate:</span>
                      <span className="minecraft-stat-value">{playerStats.winRate}%</span>
                    </div>
                    <div className="minecraft-stat">
                      <span className="minecraft-stat-label">Total Playtime:</span>
                      <span className="minecraft-stat-value">
                        {Math.floor(playerStats.totalDuration / 60)}m {playerStats.totalDuration % 60}s
                      </span>
                    </div>
                  </div>
                  <div className="minecraft-player-details">
                    <div className="minecraft-detail">
                      <strong>Biomes Played:</strong> {playerStats.biomes.join(', ')}
                    </div>
                    <div className="minecraft-detail">
                      <strong>Game Modes:</strong> {playerStats.gameModes.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderBadges = () => (
    <div className="minecraft-badges-content">
      <h3>Achievement Badges</h3>
      
      <div className="minecraft-badges-grid">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`minecraft-badge-card ${badge.earned ? 'earned' : 'locked'}`}
          >
            <div className="minecraft-badge-icon">{badge.icon}</div>
            <div className="minecraft-badge-info">
              <h4 className="minecraft-badge-name">{badge.name}</h4>
              <p className="minecraft-badge-description">{badge.description}</p>
              {badge.earned && badge.dateEarned && (
                <div className="minecraft-badge-date">
                  Earned: {new Date(badge.dateEarned).toLocaleDateString()}
                </div>
              )}
            </div>
            {!badge.earned && (
              <div className="minecraft-badge-locked">🔒</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="minecraft-badge-progress">
        <h4>Progress</h4>
        <div className="minecraft-progress-bar">
          <div 
            className="minecraft-progress-fill"
            style={{ 
              width: `${(badges.filter(b => b.earned).length / badges.length) * 100}%` 
            }}
          />
        </div>
        <div className="minecraft-progress-text">
          {badges.filter(b => b.earned).length} / {badges.length} badges earned
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="minecraft-history-content">
      <h3>Game History</h3>
      
      {gameHistory.length === 0 ? (
        <div className="minecraft-no-data">
          <div className="minecraft-no-data-icon">📜</div>
          <div className="minecraft-no-data-text">
            No games in history yet! Play some games to see them here.
          </div>
        </div>
      ) : (
        <div className="minecraft-history-list">
          {gameHistory.slice(0, 20).map((game) => (
            <div key={game.id} className="minecraft-history-item">
              <div className="minecraft-history-header">
                <div className="minecraft-history-mode">{game.gameMode}</div>
                <div className="minecraft-history-date">
                  {new Date(game.date).toLocaleDateString()}
                </div>
              </div>
              <div className="minecraft-history-details">
                <div className="minecraft-history-players">
                  Players: {game.players.join(', ')}
                </div>
                <div className="minecraft-history-winner">
                  Winner: <strong>{game.winner}</strong>
                </div>
                <div className="minecraft-history-info">
                  <span className="minecraft-history-biome">🌍 {game.biome}</span>
                  <span className="minecraft-history-duration">
                    ⏱️ {Math.floor(game.duration / 60)}m {game.duration % 60}s
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'scores', title: 'Scores', icon: '🏆' },
    { id: 'badges', title: 'Badges', icon: '🎖️' },
    { id: 'history', title: 'History', icon: '📜' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scores':
        return renderScores();
      case 'badges':
        return renderBadges();
      case 'history':
        return renderHistory();
      default:
        return renderScores();
    }
  };

  return (
    <div className="minecraft-scoreboard">
      <div className="minecraft-scoreboard-header">
        <h2>Scores & Achievements</h2>
        <MinecraftButton
          onClick={() => setGameState('menu')}
          variant="secondary"
          size="small"
        >
          ← Back to Menu
        </MinecraftButton>
      </div>

      <div className="minecraft-scoreboard-tabs">
        {tabs.map((tab) => (
          <MinecraftButton
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'selected' : 'secondary'}
            className="minecraft-scoreboard-tab"
          >
            {tab.icon} {tab.title}
          </MinecraftButton>
        ))}
      </div>

      <div className="minecraft-scoreboard-content">
        {renderTabContent()}
      </div>
    </div>
  );
}
