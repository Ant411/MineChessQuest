import { useState } from 'react';
import { MinecraftButton } from './MinecraftButton';
import { useChessGame } from '../../lib/stores/useChessGame';
import { CharacterMapping } from '../../lib/minecraft/CharacterMapping';

export function HelpSection() {
  const { setGameState } = useChessGame();
  const [activeTab, setActiveTab] = useState('characters');

  const tabs = [
    { id: 'characters', title: 'Characters', icon: '👥' },
    { id: 'rules', title: 'Chess Rules', icon: '📋' },
    { id: 'modes', title: 'Game Modes', icon: '🎮' },
    { id: 'controls', title: 'Controls', icon: '⌨️' }
  ];

  const renderCharacters = () => (
    <div className="minecraft-help-content">
      <h3>Minecraft Character Chess Pieces</h3>
      <div className="minecraft-character-grid">
        {Object.entries(CharacterMapping.pieces).map(([pieceType, data]) => (
          <div key={pieceType} className="minecraft-character-card">
            <div className="minecraft-character-header">
              <h4>{data.name}</h4>
              <div className="minecraft-character-type">{pieceType}</div>
            </div>
            <div className="minecraft-character-description">
              {data.description}
            </div>
            <div className="minecraft-character-biomes">
              <strong>Biome Variants:</strong>
              <div className="minecraft-biome-variants">
                {Object.entries(data.biomes).map(([biome, character]) => (
                  <div key={biome} className="minecraft-biome-variant">
                    <span className="minecraft-biome-name">{biome}:</span>
                    <span className="minecraft-character-name">{character.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="minecraft-special-moves">
              <strong>Special Abilities:</strong>
              <ul>
                {data.specialMoves.map((move, index) => (
                  <li key={index}>{move}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRules = () => (
    <div className="minecraft-help-content">
      <h3>Chess Rules</h3>
      
      <div className="minecraft-rules-section">
        <h4>Basic Chess Rules</h4>
        <ul className="minecraft-rules-list">
          <li><strong>Objective:</strong> Capture the opponent's King (Villager/Pillager)</li>
          <li><strong>Turn-based:</strong> Players alternate moves</li>
          <li><strong>Piece Movement:</strong> Each character has unique movement patterns</li>
          <li><strong>Capture:</strong> Land on an opponent's square to capture their piece</li>
          <li><strong>Check:</strong> When the King is under attack</li>
          <li><strong>Checkmate:</strong> When the King cannot escape capture</li>
        </ul>
      </div>

      <div className="minecraft-rules-section">
        <h4>Special Rules</h4>
        <ul className="minecraft-rules-list">
          <li><strong>Castling:</strong> Special King and Rook move (once per game)</li>
          <li><strong>En Passant:</strong> Special pawn capture rule</li>
          <li><strong>Pawn Promotion:</strong> Pawns reaching the end become Queens</li>
          <li><strong>Stalemate:</strong> Game ends in draw if no legal moves available</li>
        </ul>
      </div>

      <div className="minecraft-rules-section">
        <h4>Minecraft Special Moves</h4>
        <ul className="minecraft-rules-list">
          <li><strong>Creeper Explosion:</strong> When captured, damages adjacent pieces</li>
          <li><strong>Enderman Teleport:</strong> Can move to any empty square once per game</li>
          <li><strong>Zombie Horde:</strong> Can move multiple pawns in one turn</li>
          <li><strong>Witch Potion:</strong> Can heal damaged pieces or poison enemies</li>
        </ul>
      </div>
    </div>
  );

  const renderModes = () => (
    <div className="minecraft-help-content">
      <h3>Game Modes</h3>
      
      <div className="minecraft-mode-section">
        <h4>🤖 Single Player</h4>
        <p>Challenge AI opponents with 4 difficulty levels:</p>
        <ul>
          <li><strong>Easy:</strong> Basic moves, occasional mistakes</li>
          <li><strong>Medium:</strong> Strategic play, some advanced tactics</li>
          <li><strong>Hard:</strong> Strong tactical awareness, difficult to beat</li>
          <li><strong>Extreme:</strong> Master-level play, uses all special abilities</li>
        </ul>
      </div>

      <div className="minecraft-mode-section">
        <h4>👥 Two Player</h4>
        <p>Classic chess on an 8x8 board with Minecraft characters. Standard rules apply with added special moves for each character type.</p>
      </div>

      <div className="minecraft-mode-section">
        <h4>🔺 Three Player</h4>
        <p>Triangular board with modified rules:</p>
        <ul>
          <li>Each player controls one side of the triangle</li>
          <li>Pieces can attack adjacent players</li>
          <li>Victory achieved by capturing both opponent Kings</li>
          <li>Alliance system allows temporary truces</li>
          <li>Special corner squares provide movement bonuses</li>
        </ul>
      </div>

      <div className="minecraft-mode-section">
        <h4>⬜ Four Player</h4>
        <p>Team-based chess on a 10x10 board:</p>
        <ul>
          <li>Players form teams of 2 (opposite corners)</li>
          <li>Teammates cannot capture each other</li>
          <li>Victory requires capturing both enemy Kings</li>
          <li>Team coordination is crucial</li>
          <li>Special team abilities available</li>
        </ul>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="minecraft-help-content">
      <h3>Game Controls</h3>
      
      <div className="minecraft-controls-section">
        <h4>Mouse Controls</h4>
        <ul className="minecraft-controls-list">
          <li><strong>Left Click:</strong> Select piece or move to square</li>
          <li><strong>Right Click:</strong> Deselect piece</li>
          <li><strong>Mouse Wheel:</strong> Zoom camera in/out</li>
          <li><strong>Click + Drag:</strong> Rotate camera around board</li>
        </ul>
      </div>

      <div className="minecraft-controls-section">
        <h4>Keyboard Shortcuts</h4>
        <ul className="minecraft-controls-list">
          <li><strong>WASD / Arrow Keys:</strong> Move camera</li>
          <li><strong>Space / Enter:</strong> Confirm selection</li>
          <li><strong>Escape:</strong> Cancel action / Return to menu</li>
          <li><strong>H:</strong> Toggle help overlay</li>
          <li><strong>T:</strong> Switch theme (Light/Dark)</li>
          <li><strong>M:</strong> Toggle sound mute</li>
          <li><strong>R:</strong> Reset camera position</li>
        </ul>
      </div>

      <div className="minecraft-controls-section">
        <h4>Game Interface</h4>
        <ul className="minecraft-controls-list">
          <li><strong>Current Player:</strong> Shown in top-left corner</li>
          <li><strong>Move History:</strong> Right panel shows all moves</li>
          <li><strong>Captured Pieces:</strong> Displayed on side panels</li>
          <li><strong>Timer:</strong> Game clock for timed matches</li>
          <li><strong>Special Abilities:</strong> Available abilities shown per piece</li>
        </ul>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'characters':
        return renderCharacters();
      case 'rules':
        return renderRules();
      case 'modes':
        return renderModes();
      case 'controls':
        return renderControls();
      default:
        return renderCharacters();
    }
  };

  return (
    <div className="minecraft-help-section">
      <div className="minecraft-help-header">
        <h2>Minecraft Chess Guide</h2>
        <MinecraftButton
          onClick={() => setGameState('menu')}
          variant="secondary"
          size="small"
        >
          ← Back to Menu
        </MinecraftButton>
      </div>

      <div className="minecraft-help-tabs">
        {tabs.map((tab) => (
          <MinecraftButton
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'selected' : 'secondary'}
            className="minecraft-help-tab"
          >
            {tab.icon} {tab.title}
          </MinecraftButton>
        ))}
      </div>

      <div className="minecraft-help-panel">
        {renderTabContent()}
      </div>
    </div>
  );
}
