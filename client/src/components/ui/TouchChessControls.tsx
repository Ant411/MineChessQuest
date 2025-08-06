import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useChessGame } from '../../lib/stores/useChessGame';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { PieceType, PieceColor } from '../../lib/chess/ChessLogic';

interface TouchControlsProps {
  onPieceSelect: (row: number, col: number) => void;
  onPieceMove: (from: {row: number, col: number}, to: {row: number, col: number}) => void;
}

export function TouchChessControls({ onPieceSelect, onPieceMove }: TouchControlsProps) {
  const isMobile = useIsMobile();
  const { 
    board, 
    selectedSquare, 
    validMoves, 
    currentPlayer,
    gameMode 
  } = useChessGame();
  
  const [dragStart, setDragStart] = useState<{row: number, col: number} | null>(null);
  const [dragEnd, setDragEnd] = useState<{row: number, col: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [touchPosition, setTouchPosition] = useState<{x: number, y: number} | null>(null);
  
  const boardRef = useRef<HTMLDivElement>(null);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    const touch = e.touches[0];
    
    setDragStart({ row, col });
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
    
    // Select the piece
    onPieceSelect(row, col);
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Light haptic feedback
    }
  }, [onPieceSelect]);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !dragStart) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    
    // Determine which square we're over
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const boardSize = Math.min(rect.width, rect.height);
      const squareSize = boardSize / 8;
      
      const relativeX = touch.clientX - rect.left;
      const relativeY = touch.clientY - rect.top;
      
      const col = Math.floor(relativeX / squareSize);
      const row = Math.floor(relativeY / squareSize);
      
      if (row >= 0 && row < 8 && col >= 0 && col < 8) {
        setDragEnd({ row, col });
      }
    }
  }, [isDragging, dragStart]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (dragStart && dragEnd && isDragging) {
      // Check if it's a valid move
      const isValidMove = validMoves.some(move => 
        move.from.row === dragStart.row && 
        move.from.col === dragStart.col &&
        move.to.row === dragEnd.row && 
        move.to.col === dragEnd.col
      );
      
      if (isValidMove) {
        onPieceMove(dragStart, dragEnd);
        // Strong haptic feedback for successful move
        if ('vibrate' in navigator) {
          navigator.vibrate([20, 10, 20]);
        }
      } else {
        // Light haptic feedback for invalid move
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    }
    
    // Reset drag state
    setDragStart(null);
    setDragEnd(null);
    setIsDragging(false);
    setTouchPosition(null);
  }, [dragStart, dragEnd, isDragging, validMoves, onPieceMove]);

  // Prevent context menu on long press
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  if (!isMobile || !board) return null;

  const getPieceIcon = (type: PieceType, color: PieceColor): string => {
    const icons = {
      white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
      black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
      red: { king: '🤴', queen: '👸', rook: '🏰', bishop: '🧙', knight: '🐴', pawn: '🛡️' },
      blue: { king: '👑', queen: '🔮', rook: '⚡', bishop: '🌟', knight: '🦄', pawn: '❄️' }
    };

    return icons[color]?.[type] || '?';
  };

  return (
    <div className="touch-chess-controls">
      {/* Touch-enabled chess board */}
      <div 
        ref={boardRef}
        className="touch-chess-board"
        onContextMenu={handleContextMenu}
      >
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((piece, colIndex) => {
              const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
              const isValidMove = validMoves.some(move => 
                move.to.row === rowIndex && move.to.col === colIndex
              );
              const isDragTarget = dragEnd?.row === rowIndex && dragEnd?.col === colIndex;
              const isLightSquare = (rowIndex + colIndex) % 2 === 0;
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    touch-square
                    ${isLightSquare ? 'light-square' : 'dark-square'}
                    ${isSelected ? 'selected-square' : ''}
                    ${isValidMove ? 'valid-move-square' : ''}
                    ${isDragTarget ? 'drag-target' : ''}
                  `}
                  onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Square coordinate */}
                  <div className="square-coordinate">
                    {String.fromCharCode(97 + colIndex)}{rowIndex + 1}
                  </div>
                  
                  {/* Piece */}
                  {piece && (
                    <div className={`
                      touch-piece 
                      ${piece.color}-piece
                      ${isDragging && dragStart?.row === rowIndex && dragStart?.col === colIndex ? 'dragging' : ''}
                    `}>
                      <div className="piece-icon">
                        {getPieceIcon(piece.type, piece.color)}
                      </div>
                      <div className="piece-name">
                        {piece.type}
                      </div>
                    </div>
                  )}
                  
                  {/* Valid move indicator */}
                  {isValidMove && (
                    <div className="valid-move-indicator">
                      {piece ? '⚔️' : '●'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Drag preview */}
      {isDragging && touchPosition && dragStart && (
        <div
          className="drag-preview"
          style={{
            position: 'fixed',
            left: touchPosition.x - 30,
            top: touchPosition.y - 30,
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          <div className="preview-piece">
            {board[dragStart.row]?.[dragStart.col] && (
              <div className="piece-icon">
                {getPieceIcon(
                  board[dragStart.row][dragStart.col].type,
                  board[dragStart.row][dragStart.col].color
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Touch controls UI */}
      <div className="touch-controls-ui">
        <div className="game-status">
          <div className="current-player-indicator">
            <span className={`player-dot ${currentPlayer}-dot`}></span>
            <span className="player-text">
              {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn
            </span>
          </div>
          
          {selectedSquare && (
            <div className="selected-info">
              <span className="selected-text">
                Selected: {String.fromCharCode(97 + selectedSquare.col)}{selectedSquare.row + 1}
              </span>
              <span className="valid-moves-count">
                {validMoves.length} moves available
              </span>
            </div>
          )}
        </div>

        {/* Touch instructions */}
        <div className="touch-instructions">
          <div className="instruction-item">
            <span className="instruction-icon">👆</span>
            <span className="instruction-text">Tap and drag to move pieces</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">✨</span>
            <span className="instruction-text">Valid moves are highlighted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing touch chess state  
export function useTouchChess() {
  const { makeMove, selectSquare, board, selectedSquare, validMoves } = useChessGame();
  const [lastTap, setLastTap] = useState<number>(0);
  
  const handlePieceSelect = useCallback((row: number, col: number) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap;
    
    // Double tap detection
    if (timeSinceLastTap < 300 && timeSinceLastTap > 50) {
      // Double tap - try to make a smart move
      const piece = board[row]?.[col];
      if (piece && selectedSquare) {
        // Auto-move to best available square
        if (validMoves.length === 1) {
          makeMove(selectedSquare, validMoves[0].to);
          return;
        }
      }
    }
    
    setLastTap(now);
    selectSquare(row, col);
  }, [makeMove, selectSquare, board, selectedSquare, lastTap]);

  const handlePieceMove = useCallback((from: {row: number, col: number}, to: {row: number, col: number}) => {
    makeMove(from, to);
  }, [makeMove]);

  return {
    handlePieceSelect,
    handlePieceMove
  };
}