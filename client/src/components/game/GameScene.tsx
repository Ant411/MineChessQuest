import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

import { ChessBoard } from './ChessBoard';
import { BiomeEnvironment } from './BiomeEnvironment';
import { AnimationController } from './AnimationController';
import { useChessGame } from '../../lib/stores/useChessGame';
import { useTheme } from '../../lib/stores/useTheme';
import { BiomeEnvironment as BiomeEnvClass } from '../../lib/minecraft/BiomeEnvironments';
import { useIsMobile } from '../../hooks/use-is-mobile';

export function GameScene() {
  const { currentBiome, gameMode, gameState } = useChessGame();
  const { currentTheme } = useTheme();
  const isMobile = useIsMobile();
  const controlsRef = useRef<any>();
  const biomeEnvRef = useRef<BiomeEnvClass | null>(null);

  // Lighting setup based on biome and theme
  const getLighting = () => {
    const isNight = currentTheme === 'dark';
    
    switch (currentBiome) {
      case 'nether':
        return {
          ambient: '#ff4444',
          directional: '#ff6666',
          intensity: isNight ? 0.4 : 0.6
        };
      case 'ocean':
        return {
          ambient: '#4444ff',
          directional: '#6666ff',
          intensity: isNight ? 0.3 : 0.5
        };
      case 'desert':
        return {
          ambient: '#ffff44',
          directional: '#ffff66',
          intensity: isNight ? 0.2 : 0.8
        };
      default: // forest
        return {
          ambient: '#44ff44',
          directional: '#66ff66',
          intensity: isNight ? 0.3 : 0.7
        };
    }
  };

  const lighting = getLighting();

  useEffect(() => {
    if (controlsRef.current) {
      // Set appropriate camera controls based on game mode
      const distance = gameMode === '4player' ? 16 : gameMode === '3player' ? 14 : 12;
      controlsRef.current.setPosition(0, 8, distance);
    }
  }, [gameMode]);

  // Initialize biome environment
  useEffect(() => {
    if (!biomeEnvRef.current) {
      biomeEnvRef.current = new BiomeEnvClass(currentBiome);
    }
  }, [currentBiome]);

  // Update particles each frame
  useFrame(() => {
    if (biomeEnvRef.current) {
      biomeEnvRef.current.updateParticles();
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight color={lighting.ambient} intensity={lighting.intensity * 0.4} />
      <directionalLight
        color={lighting.directional}
        intensity={lighting.intensity}
        position={[10, 10, 10]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Point lights for dramatic effect */}
      {currentBiome === 'nether' && (
        <>
          <pointLight position={[-8, 4, -8]} color="#ff4444" intensity={0.5} />
          <pointLight position={[ 8, 4,  8]} color="#ff4444" intensity={0.5} />
        </>
      )}

      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={25}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        target={[0, 0, 0]}
      />

      {/* Environment */}
      <BiomeEnvironment biome={currentBiome} />
      
      {/* Chess Board */}
      <ChessBoard gameMode={gameMode} />
      
      {/* Animation Controller */}
      <AnimationController />
      
      {/* Fog for atmosphere */}
      <fog attach="fog" args={[
        currentTheme === 'dark' ? '#0f0f23' : '#87ceeb',
        20,
        50
      ]} />
    </>
  );
}
