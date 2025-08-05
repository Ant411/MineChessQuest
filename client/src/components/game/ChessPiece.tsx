import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

import { useChessGame } from '../../lib/stores/useChessGame';
import { useAudio } from '../../lib/stores/useAudio';
import { CharacterMapping } from '../../lib/minecraft/CharacterMapping';

interface ChessPieceProps {
  piece: {
    type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
    color: 'white' | 'black' | 'red' | 'blue';
  };
  position: [number, number, number];
  gameMode: '2player' | '1player' | '3player' | '4player';
}

export function ChessPiece({ piece, position, gameMode }: ChessPieceProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetPosition, setTargetPosition] = useState<[number, number, number]>(position);
  const [isHovered, setIsHovered] = useState(false);
  
  const { selectPiece, selectedPiece, currentBiome } = useChessGame();
  const { playHit } = useAudio();

  const characterData = CharacterMapping.getCharacter(piece.type, piece.color, currentBiome);
  const isSelected = selectedPiece?.type === piece.type && selectedPiece?.color === piece.color;

  // Animation for piece movement
  useFrame((state, delta) => {
    if (meshRef.current && isAnimating) {
      const current = meshRef.current.position;
      const target = new THREE.Vector3(...targetPosition);
      
      current.lerp(target, delta * 5);
      
      if (current.distanceTo(target) < 0.01) {
        setIsAnimating(false);
      }
    }

    // Floating animation for selected pieces
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.2;
    } else if (meshRef.current && !isAnimating) {
      meshRef.current.position.y = position[1];
    }

    // Hover animation
    if (meshRef.current && isHovered && !isSelected) {
      meshRef.current.position.y = position[1] + 0.1;
    }
  });

  // Update position when prop changes
  useEffect(() => {
    setTargetPosition(position);
    setIsAnimating(true);
  }, [position]);

  const handleClick = () => {
    selectPiece(piece);
    playHit();
  };

  const getCharacterModel = () => {
    const scale = isSelected ? 1.2 : 1;
    const color = characterData.color;

    switch (piece.type) {
      case 'pawn':
        return (
          <Cylinder args={[0.15, 0.25, 0.8]} scale={[scale, scale, scale]}>
            <meshStandardMaterial color={color} />
          </Cylinder>
        );
      
      case 'rook':
        return (
          <Box args={[0.4, 0.8, 0.4]} scale={[scale, scale, scale]}>
            <meshStandardMaterial color={color} />
          </Box>
        );
      
      case 'knight':
        return (
          <group scale={[scale, scale, scale]}>
            <Box args={[0.3, 0.6, 0.5]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.15, 0.3, 0.3]} position={[0, 0.3, 0.3]}>
              <meshStandardMaterial color={color} />
            </Box>
          </group>
        );
      
      case 'bishop':
        return (
          <group scale={[scale, scale, scale]}>
            <Cylinder args={[0.2, 0.3, 0.8]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            <Sphere args={[0.15]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color={color} />
            </Sphere>
          </group>
        );
      
      case 'queen':
        return (
          <group scale={[scale, scale, scale]}>
            <Cylinder args={[0.25, 0.35, 1.0]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            <Sphere args={[0.2]} position={[0, 0.6, 0]}>
              <meshStandardMaterial color={color} />
            </Sphere>
            {/* Crown spikes */}
            {[0, 1, 2, 3, 4].map(i => (
              <Box 
                key={i}
                args={[0.05, 0.2, 0.05]} 
                position={[
                  Math.cos((i * Math.PI * 2) / 5) * 0.25,
                  0.8,
                  Math.sin((i * Math.PI * 2) / 5) * 0.25
                ]}
              >
                <meshStandardMaterial color={color} />
              </Box>
            ))}
          </group>
        );
      
      case 'king':
        return (
          <group scale={[scale, scale, scale]}>
            <Cylinder args={[0.3, 0.4, 1.2]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            <Box args={[0.1, 0.3, 0.05]} position={[0, 0.8, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.05, 0.1, 0.3]} position={[0, 0.8, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
          </group>
        );
      
      default:
        return (
          <Box args={[0.3, 0.6, 0.3]} scale={[scale, scale, scale]}>
            <meshStandardMaterial color={color} />
          </Box>
        );
    }
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      castShadow
      receiveShadow
    >
      {getCharacterModel()}
      
      {/* Character nameplate */}
      <group position={[0, 1, 0]}>
        <Box args={[1, 0.1, 0.02]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
        </Box>
      </group>
      
      {/* Glowing effect for selected piece */}
      {isSelected && (
        <Sphere args={[0.6]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#ffff00" transparent opacity={0.2} />
        </Sphere>
      )}
    </group>
  );
}
