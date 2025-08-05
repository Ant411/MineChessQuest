import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { PieceType, PieceColor } from '../chess/ChessLogic';

interface DetailedPieceProps {
  type: PieceType;
  color: PieceColor;
  biome: string;
  position: [number, number, number];
  isSelected?: boolean;
  isValidMove?: boolean;
  onClick?: () => void;
  scale?: number;
}

// Detailed character mapping for each biome
const BIOME_CHARACTERS = {
  forest: {
    pawn: { white: 'Villager', black: 'Zombie', red: 'Witch', blue: 'Illusioner' },
    rook: { white: 'Iron Golem', black: 'Ravager', red: 'Evoker', blue: 'Vindicator' },
    knight: { white: 'Horse', black: 'Skeleton Horse', red: 'Spider Jockey', blue: 'Strider' },
    bishop: { white: 'Cleric', black: 'Necromancer', red: 'Witch', blue: 'Evoker' },
    queen: { white: 'Ender Dragon', black: 'Wither', red: 'Elder Guardian', blue: 'Warden' },
    king: { white: 'Player (Steve)', black: 'Herobrine', red: 'Notch', blue: 'Alex' }
  },
  desert: {
    pawn: { white: 'Desert Villager', black: 'Husk', red: 'Stray', blue: 'Pillager' },
    rook: { white: 'Guardian', black: 'Elder Guardian', red: 'Golem', blue: 'Ravager' },
    knight: { white: 'Camel', black: 'Spider', red: 'Cave Spider', blue: 'Silverfish' },
    bishop: { white: 'Desert Priest', black: 'Evoker', red: 'Witch', blue: 'Illusioner' },
    queen: { white: 'Warden', black: 'Wither', red: 'Ender Dragon', blue: 'Elder Guardian' },
    king: { white: 'Desert Steve', black: 'Desert Herobrine', red: 'Pharaoh', blue: 'Desert Alex' }
  },
  ocean: {
    pawn: { white: 'Drowned', black: 'Guardian', red: 'Tropical Fish', blue: 'Squid' },
    rook: { white: 'Elder Guardian', black: 'Guardian', red: 'Conduit', blue: 'Prismarine Golem' },
    knight: { white: 'Dolphin', black: 'Shark', red: 'Turtle', blue: 'Axolotl' },
    bishop: { white: 'Sea Witch', black: 'Drowned Mage', red: 'Coral Mage', blue: 'Ocean Priest' },
    queen: { white: 'Kraken', black: 'Leviathan', red: 'Sea Serpent', blue: 'Ocean Dragon' },
    king: { white: 'Aqua Steve', black: 'Deep One', red: 'Poseidon', blue: 'Aqua Alex' }
  },
  nether: {
    pawn: { white: 'Zombified Piglin', black: 'Piglin', red: 'Magma Cube', blue: 'Strider' },
    rook: { white: 'Wither Skeleton', black: 'Blaze', red: 'Ghast', blue: 'Hoglin' },
    knight: { white: 'Strider', black: 'Hoglin', red: 'Zoglin', blue: 'Piglin Beast' },
    bishop: { white: 'Piglin Brute', black: 'Wither Mage', red: 'Blaze Wizard', blue: 'Nether Priest' },
    queen: { white: 'Wither', black: 'Nether Dragon', red: 'Ghast Queen', blue: 'Blaze Emperor' },
    king: { white: 'Nether Steve', black: 'Nether King', red: 'Piglin Chief', blue: 'Nether Alex' }
  },
  end: {
    pawn: { white: 'Enderman', black: 'Shulker', red: 'Chorus Fruit', blue: 'End Crystal' },
    rook: { white: 'Shulker', black: 'End Golem', red: 'Purpur Golem', blue: 'Crystal Golem' },
    knight: { white: 'Endermite', black: 'End Spider', red: 'Chorus Beast', blue: 'Void Walker' },
    bishop: { white: 'End Mage', black: 'Void Priest', red: 'Chorus Sage', blue: 'Crystal Mage' },
    queen: { white: 'Ender Dragon', black: 'Void Dragon', red: 'Chaos Dragon', blue: 'Crystal Dragon' },
    king: { white: 'End Steve', black: 'End Lord', red: 'Void King', blue: 'End Alex' }
  },
  mushroom: {
    pawn: { white: 'Mooshroom', black: 'Red Mushroom', red: 'Brown Mushroom', blue: 'Shroomlight' },
    rook: { white: 'Mushroom Golem', black: 'Fungal Golem', red: 'Spore Golem', blue: 'Mycelium Golem' },
    knight: { white: 'Mooshroom', black: 'Giant Mushroom', red: 'Fungal Beast', blue: 'Spore Walker' },
    bishop: { white: 'Mushroom Sage', black: 'Fungal Priest', red: 'Spore Mage', blue: 'Mycelium Sage' },
    queen: { white: 'Mushroom Queen', black: 'Fungal Empress', red: 'Spore Mother', blue: 'Mycelium Queen' },
    king: { white: 'Mushroom Steve', black: 'Fungal King', red: 'Spore Lord', blue: 'Mycelium Alex' }
  },
  ice: {
    pawn: { white: 'Polar Bear', black: 'Ice Zombie', red: 'Stray', blue: 'Snow Golem' },
    rook: { white: 'Ice Golem', black: 'Frost Giant', red: 'Ice Elemental', blue: 'Snow Titan' },
    knight: { white: 'Polar Bear', black: 'Ice Spider', red: 'Frost Wolf', blue: 'Ice Steed' },
    bishop: { white: 'Ice Mage', black: 'Frost Priest', red: 'Snow Sage', blue: 'Winter Witch' },
    queen: { white: 'Ice Queen', black: 'Frost Dragon', red: 'Winter Empress', blue: 'Ice Phoenix' },
    king: { white: 'Ice Steve', black: 'Frost King', red: 'Winter Lord', blue: 'Ice Alex' }
  },
  jungle: {
    pawn: { white: 'Ocelot', black: 'Parrot', red: 'Cocoa Bean', blue: 'Jungle Villager' },
    rook: { white: 'Jungle Golem', black: 'Vine Golem', red: 'Tree Golem', blue: 'Leaf Golem' },
    knight: { white: 'Ocelot', black: 'Jungle Spider', red: 'Tree Cat', blue: 'Vine Swinger' },
    bishop: { white: 'Jungle Priest', black: 'Vine Mage', red: 'Tree Sage', blue: 'Jungle Witch' },
    queen: { white: 'Jungle Queen', black: 'Vine Empress', red: 'Tree Mother', blue: 'Jungle Dragon' },
    king: { white: 'Jungle Steve', black: 'Vine King', red: 'Tree Lord', blue: 'Jungle Alex' }
  }
};

// Color schemes for each piece color
const PIECE_COLOR_SCHEMES = {
  white: { primary: '#FFFFFF', secondary: '#E0E0E0', accent: '#4CAF50', glow: '#90EE90' },
  black: { primary: '#2C2C2C', secondary: '#1C1C1C', accent: '#F44336', glow: '#FF6B6B' },
  red: { primary: '#C62828', secondary: '#8E0000', accent: '#FF5722', glow: '#FF8A65' },
  blue: { primary: '#1565C0', secondary: '#0D47A1', accent: '#2196F3', glow: '#64B5F6' }
};

export function DetailedChessPiece({
  type,
  color,
  biome,
  position,
  isSelected = false,
  isValidMove = false,
  onClick,
  scale = 1
}: DetailedPieceProps) {
  const colorScheme = PIECE_COLOR_SCHEMES[color];
  const characterName = BIOME_CHARACTERS[biome as keyof typeof BIOME_CHARACTERS]?.[type]?.[color] || 'Unknown';

  // Create detailed piece geometry based on type
  const pieceGeometry = useMemo(() => {
    switch (type) {
      case 'pawn':
        return createPawnGeometry();
      case 'rook':
        return createRookGeometry();
      case 'knight':
        return createKnightGeometry();
      case 'bishop':
        return createBishopGeometry();
      case 'queen':
        return createQueenGeometry();
      case 'king':
        return createKingGeometry();
      default:
        return createPawnGeometry();
    }
  }, [type]);

  // Materials with biome-specific textures
  const materials = useMemo(() => {
    const primaryMaterial = new THREE.MeshLambertMaterial({
      color: colorScheme.primary,
      transparent: true,
      opacity: 0.9
    });

    const accentMaterial = new THREE.MeshLambertMaterial({
      color: colorScheme.accent,
      transparent: true,
      opacity: 0.8
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: colorScheme.glow,
      transparent: true,
      opacity: isSelected ? 0.3 : 0.0
    });

    return { primary: primaryMaterial, accent: accentMaterial, glow: glowMaterial };
  }, [colorScheme, isSelected]);

  // Animation state
  const [hovered, setHovered] = React.useState(false);

  return (
    <group 
      position={position}
      scale={scale * (isSelected ? 1.1 : 1.0)}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main piece body */}
      <mesh geometry={pieceGeometry} material={materials.primary} castShadow receiveShadow>
        {/* Add biome-specific details */}
        {renderBiomeDetails(biome, type, materials.accent)}
      </mesh>

      {/* Selection glow */}
      {isSelected && (
        <mesh geometry={pieceGeometry} material={materials.glow} scale={1.05} />
      )}

      {/* Valid move indicator */}
      {isValidMove && (
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.05, 16]} />
          <meshBasicMaterial color="#00FF00" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Hover effect */}
      {hovered && (
        <mesh position={[0, 1.5, 0]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
          {/* Character name label - would need text rendering */}
        </mesh>
      )}

      {/* Piece type indicator */}
      <mesh position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color={colorScheme.accent} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// Geometry creation functions for different piece types
function createPawnGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.15, 0.25, 0.8, 12);
  const topGeometry = new THREE.SphereGeometry(0.2, 12, 8);
  
  // Merge geometries
  const mergedGeometry = new THREE.BufferGeometry();
  
  // This is a simplified version - in a real implementation, you'd use BufferGeometryUtils.mergeGeometries
  return geometry;
}

function createRookGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.3, 0.35, 1.0, 8);
  
  // Add castle-like top
  const topGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.6);
  
  return geometry;
}

function createKnightGeometry(): THREE.BufferGeometry {
  // Create horse-like shape
  const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.6, 12);
  const headGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.6);
  
  return bodyGeometry;
}

function createBishopGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.15, 0.3, 1.2, 12);
  
  // Add pointed top
  const topGeometry = new THREE.ConeGeometry(0.2, 0.4, 12);
  
  return geometry;
}

function createQueenGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.2, 0.35, 1.4, 12);
  
  // Add crown-like top
  const crownGeometry = new THREE.CylinderGeometry(0.3, 0.25, 0.3, 8);
  
  return geometry;
}

function createKingGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.25, 0.4, 1.6, 12);
  
  // Add cross on top
  const crossGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.05);
  
  return geometry;
}

// Render biome-specific details on pieces
function renderBiomeDetails(biome: string, type: PieceType, accentMaterial: THREE.Material) {
  switch (biome) {
    case 'forest':
      return renderForestDetails(type, accentMaterial);
    case 'desert':
      return renderDesertDetails(type, accentMaterial);
    case 'ocean':
      return renderOceanDetails(type, accentMaterial);
    case 'nether':
      return renderNetherDetails(type, accentMaterial);
    case 'end':
      return renderEndDetails(type, accentMaterial);
    case 'mushroom':
      return renderMushroomDetails(type, accentMaterial);
    case 'ice':
      return renderIceDetails(type, accentMaterial);
    case 'jungle':
      return renderJungleDetails(type, accentMaterial);
    default:
      return null;
  }
}

function renderForestDetails(type: PieceType, accentMaterial: THREE.Material) {
  switch (type) {
    case 'pawn':
      return (
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
      );
    case 'rook':
      return (
        <>
          <mesh position={[0.2, 0.4, 0]}>
            <boxGeometry args={[0.05, 0.2, 0.05]} />
            <primitive object={accentMaterial} attach="material" />
          </mesh>
          <mesh position={[-0.2, 0.4, 0]}>
            <boxGeometry args={[0.05, 0.2, 0.05]} />
            <primitive object={accentMaterial} attach="material" />
          </mesh>
        </>
      );
    default:
      return null;
  }
}

function renderDesertDetails(type: PieceType, accentMaterial: THREE.Material) {
  return (
    <mesh position={[0, 0.1, 0]}>
      <boxGeometry args={[0.1, 0.05, 0.1]} />
      <primitive object={accentMaterial} attach="material" />
    </mesh>
  );
}

function renderOceanDetails(type: PieceType, accentMaterial: THREE.Material) {
  return (
    <mesh position={[0, 0, 0.3]}>
      <sphereGeometry args={[0.05, 8, 6]} />
      <primitive object={accentMaterial} attach="material" />
    </mesh>
  );
}

function renderNetherDetails(type: PieceType, accentMaterial: THREE.Material) {
  return (
    <mesh position={[0, 0.5, 0]}>
      <coneGeometry args={[0.1, 0.2, 6]} />
      <primitive object={accentMaterial} attach="material" />
    </mesh>
  );
}

function renderEndDetails(type: PieceType, accentMaterial: THREE.Material) {
  return (
    <mesh position={[0, 0.6, 0]}>
      <octahedronGeometry args={[0.1]} />
      <primitive object={accentMaterial} attach="material" />
    </mesh>
  );
}

function renderMushroomDetails(type: PieceType, accentMaterial: THREE.Material) {
  return (
    <mesh position={[0, 0.4, 0]}>
      <sphereGeometry args={[0.1, 8, 6]} />
      <primitive object={accentMaterial} attach="material" />
    </mesh>
  );
}

function renderIceDetails(type: PieceType, accentMaterial: THREE.Material) {
  return (
    <>
      <mesh position={[0.1, 0.3, 0.1]}>
        <coneGeometry args={[0.03, 0.15, 6]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>
      <mesh position={[-0.1, 0.3, -0.1]}>
        <coneGeometry args={[0.03, 0.15, 6]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>
    </>
  );
}

function renderJungleDetails(type: PieceType, accentMaterial: THREE.Material) {
  return (
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
      <primitive object={accentMaterial} attach="material" />
    </mesh>
  );
}