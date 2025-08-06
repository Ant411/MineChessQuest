import React, { useState, useEffect } from 'react';
import { useChessGame } from '../../lib/stores/useChessGame';
import { useTheme } from '../../lib/stores/useTheme';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { MinecraftButton } from './MinecraftButton';
import { PieceType } from '../../lib/chess/ChessLogic';
import { TouchChessControls, useTouchChess } from './TouchChessControls';

export function MobileGameUI() {
  const isMobile = useIsMobile();
  const { 
    gameState, 
    setGameState, 
    currentPlayer, 
    selectedSquare, 
    validMoves,
    gameMode,
    currentBiome,
    board,
    makeMove,
    getValidMoves
  } = useChessGame();
  const { currentTheme } = useTheme();
  const { handlePieceSelect, handlePieceMove } = useTouchChess();
  
  const [showControls, setShowControls] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Detect screen orientation
  useEffect(() => {
    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    checkOrientation();
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);

    return () => {
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  if (!isMobile) return null;

  const handlePieceTouch = (row: number, col: number) => {
    const piece = board[row]?.[col];
    if (!piece) return;

    if (selectedPiece) {
      // Try to make a move
      const isValidMove = validMoves.some(move => 
        move.to && move.to.row === row && move.to.col === col
      );

      if (isValidMove) {
        makeMove(selectedPiece, {row, col});
        setSelectedPiece(null);
      } else {
        // Select new piece
        setSelectedPiece({row, col});
      }
    } else {
      // Select piece
      setSelectedPiece({row, col});
    }
  };

  const renderGameControls = () => (
    <div className="mobile-game-controls">
      <div className="control-buttons">
        <button 
          className="minecraft-button minecraft-button-small"
          onClick={() => setShowControls(!showControls)}
        >
          {showControls ? '▼' : '▲'} Controls
        </button>
        
        <button 
          className="minecraft-button minecraft-button-small minecraft-button-secondary"
          onClick={() => setGameState('menu')}
        >
          Menu
        </button>
        
        <button 
          className="minecraft-button minecraft-button-small minecraft-button-secondary"
          onClick={() => {
            if (window.screen?.orientation?.lock) {
              window.screen.orientation.lock('landscape').catch(() => {});
            }
          }}
        >
          🔄 Rotate
        </button>
      </div>

      {showControls && (
        <div className="mobile-instructions">
          <h4 className="minecraft-section-title">Touch Controls</h4>
          <div className="instruction-list">
            <div className="instruction-item">
              <span className="instruction-icon">👆</span>
              <span className="instruction-text">Tap a piece to select it</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">✋</span>
              <span className="instruction-text">Tap destination to move</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">🔄</span>
              <span className="instruction-text">Pinch to zoom, drag to rotate camera</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">📱</span>
              <span className="instruction-text">Rotate device for better view</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderGameInfo = () => (
    <div className="mobile-game-info">
      <div className="game-status">
        <div className="current-player">
          Player: <span className="player-name">{currentPlayer}</span>
        </div>
        <div className="game-mode">
          Mode: {gameMode} • Biome: {currentBiome}
        </div>
      </div>
      
      {selectedPiece && (
        <div className="selected-piece-info">
          <div className="selected-title">Selected Piece</div>
          <div className="piece-details">
            Position: {String.fromCharCode(97 + selectedPiece.col)}{selectedPiece.row + 1}
          </div>
          <div className="valid-moves">
            Valid moves: {getValidMoves(selectedPiece).length}
          </div>
        </div>
      )}
    </div>
  );

  const renderChessBoard = () => {
    if (!board || board.length === 0) return null;

    return (
      <div className="mobile-chess-board">
        <div className="board-container">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((piece, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`board-square ${
                    (rowIndex + colIndex) % 2 === 0 ? 'light-square' : 'dark-square'
                  } ${
                    selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex 
                      ? 'selected-square' : ''
                  } ${
                    validMoves.some(move => 
                      move.to.row === rowIndex && move.to.col === colIndex
                    ) ? 'valid-move-square' : ''
                  }`}
                  onClick={() => handlePieceTouch(rowIndex, colIndex)}
                >
                  {piece && (
                    <div className="piece-icon">
                      {getPieceIcon(piece.type, piece.color)}
                    </div>
                  )}
                  <div className="square-coordinate">
                    {String.fromCharCode(97 + colIndex)}{rowIndex + 1}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (orientation === 'landscape') {
    return (
      <div className="mobile-game-layout landscape">
        <div className="game-board-section">
          <TouchChessControls 
            onPieceSelect={handlePieceSelect}
            onPieceMove={handlePieceMove}
          />
        </div>
        <div className="game-ui-section">
          {renderGameInfo()}
          {renderGameControls()}
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-game-layout portrait">
      {renderGameInfo()}
      <div className="mobile-chess-board">
        <TouchChessControls 
          onPieceSelect={handlePieceSelect}
          onPieceMove={handlePieceMove}
        />
      </div>
      {renderGameControls()}
    </div>
  );
}

// Helper function to get piece icons
function getPieceIcon(type: PieceType, color: string): string {
  const icons = {
    white: {
      king: '♔', queen: '♕', rook: '♖', 
      bishop: '♗', knight: '♘', pawn: '♙'
    },
    black: {
      king: '♚', queen: '♛', rook: '♜', 
      bishop: '♝', knight: '♞', pawn: '♟'
    },
    red: {
      king: '🤴', queen: '👸', rook: '🏰', 
      bishop: '🧙', knight: '🐴', pawn: '🛡️'
    },
    blue: {
      king: '👑', queen: '🔮', rook: '⚡', 
      bishop: '🌟', knight: '🦄', pawn: '❄️'
    }
  };

  return icons[color as keyof typeof icons]?.[type] || '?';
}