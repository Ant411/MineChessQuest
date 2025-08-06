import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

import { ChessPiece } from './ChessPiece';
import { useChessGame } from '../../lib/stores/useChessGame';
import { useTheme } from '../../lib/stores/useTheme';

interface ChessBoardProps {
  gameMode: '2player' | '1player' | '3player' | '4player';
}

export function ChessBoard({ gameMode }: ChessBoardProps) {
  const { board, selectedSquare, validMoves, currentBiome } = useChessGame();
  const { currentTheme } = useTheme();
  const boardRef = useRef<THREE.Group>(null);

  // Use procedural materials instead of loading textures that may not exist
  const getBoardMaterial = () => {
    const biome = currentBiome as string;
    switch (biome) {
      case 'desert':
        return new THREE.MeshLambertMaterial({ color: '#daa520' });
      case 'forest':
        return new THREE.MeshLambertMaterial({ color: '#228b22' });
      case 'ocean':
        return new THREE.MeshLambertMaterial({ color: '#4682b4' });
      case 'nether':
        return new THREE.MeshLambertMaterial({ color: '#8b0000' });
      case 'end':
        return new THREE.MeshLambertMaterial({ color: '#483d8b' });
      case 'mushroom':
        return new THREE.MeshLambertMaterial({ color: '#8b4682' });
      case 'ice':
        return new THREE.MeshLambertMaterial({ color: '#87ceeb' });
      case 'jungle':
        return new THREE.MeshLambertMaterial({ color: '#32cd32' });
      default:
        return new THREE.MeshLambertMaterial({ color: '#8b4513' });
    }
  };

  const boardMaterial = useMemo(() => getBoardMaterial(), [currentBiome]);

  // Generate board layout based on game mode
  const getBoardLayout = () => {
    switch (gameMode) {
      case '3player':
        return generateTriangularBoard();
      case '4player':
        return generateFourPlayerBoard();
      default:
        return generateStandardBoard();
    }
  };

  const generateStandardBoard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        squares.push({
          position: [col - 3.5, 0, row - 3.5] as [number, number, number],
          isLight,
          key: `${row}-${col}`,
          row,
          col
        });
      }
    }
    return squares;
  };

  const generateTriangularBoard = () => {
    const squares = [];
    const size = 9;
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= row; col++) {
        const x = col - row / 2;
        const z = row - size / 2;
        const isLight = (row + col) % 2 === 0;
        
        squares.push({
          position: [x, 0, z] as [number, number, number],
          isLight,
          key: `tri-${row}-${col}`,
          row,
          col
        });
      }
    }
    return squares;
  };

  const generateFourPlayerBoard = () => {
    const squares = [];
    const size = 10;
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const isLight = (row + col) % 2 === 0;
        squares.push({
          position: [col - size/2 + 0.5, 0, row - size/2 + 0.5] as [number, number, number],
          isLight,
          key: `4p-${row}-${col}`,
          row,
          col
        });
      }
    }
    return squares;
  };

  const squares = getBoardLayout();

  const getSquareColor = (isLight: boolean) => {
    const base = currentTheme === 'dark' ? 0.3 : 0.8;
    return isLight ? 
      new THREE.Color(base, base, base) : 
      new THREE.Color(base * 0.4, base * 0.4, base * 0.4);
  };

  return (
    <group ref={boardRef}>
      {/* Board Base */}
      <Plane
        args={[gameMode === '4player' ? 12 : 10, gameMode === '4player' ? 12 : 10]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <meshStandardMaterial map={boardTexture} />
      </Plane>

      {/* Board Squares */}
      {squares.map((square) => (
        <group key={square.key}>
          <Box
            args={[0.95, 0.05, 0.95]}
            position={square.position}
            onClick={() => {
              // Handle square selection
              console.log('Square clicked:', square.row, square.col);
            }}
          >
            <meshStandardMaterial
              color={getSquareColor(square.isLight)}
              transparent
              opacity={selectedSquare?.row === square.row && selectedSquare?.col === square.col ? 0.7 : 1}
            />
          </Box>
          
          {/* Highlight valid moves */}
          {validMoves?.some(move => move.row === square.row && move.col === square.col) && (
            <Box
              args={[0.9, 0.1, 0.9]}
              position={[square.position[0], square.position[1] + 0.1, square.position[2]]}
            >
              <meshStandardMaterial
                color="#00ff00"
                transparent
                opacity={0.5}
              />
            </Box>
          )}
        </group>
      ))}

      {/* Chess Pieces */}
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => 
          piece && (
            <ChessPiece
              key={`${rowIndex}-${colIndex}-${piece.type}-${piece.color}`}
              piece={piece}
              position={[colIndex - 3.5, 0.5, rowIndex - 3.5]}
              gameMode={gameMode}
            />
          )
        )
      )}
    </group>
  );
}
