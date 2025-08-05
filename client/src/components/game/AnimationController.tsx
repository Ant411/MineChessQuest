import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useChessGame } from '../../lib/stores/useChessGame';
import { useAudio } from '../../lib/stores/useAudio';
import { Animations } from '../../lib/minecraft/Animations';

export function AnimationController() {
  const { currentAnimation, clearAnimation } = useChessGame();
  const { playHit, playSuccess } = useAudio();
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (currentAnimation) {
      console.log('Playing animation:', currentAnimation.type);
      
      switch (currentAnimation.type) {
        case 'move':
          playHit();
          Animations.playMoveAnimation(currentAnimation.data);
          break;
          
        case 'capture':
          playHit();
          Animations.playCaptureAnimation(currentAnimation.data);
          break;
          
        case 'special_move':
          playSuccess();
          Animations.playSpecialMoveAnimation(currentAnimation.data);
          break;
          
        case 'game_over':
          playSuccess();
          Animations.playGameOverAnimation(currentAnimation.data);
          break;
      }

      // Clear animation after playing
      const timer = setTimeout(() => {
        clearAnimation();
      }, currentAnimation.duration || 2000);

      return () => clearTimeout(timer);
    }
  }, [currentAnimation, playHit, playSuccess, clearAnimation]);

  // Particle system for effects
  const particles = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (particles.current && currentAnimation) {
      // Update particle system based on animation type
      Animations.updateParticles(particles.current, currentAnimation, delta);
    }
  });

  return (
    <group ref={animationRef}>
      {/* Particle system for effects */}
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(300)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#ffff00"
          transparent
          opacity={0.6}
        />
      </points>
      
      {/* Battle animation effects */}
      {currentAnimation?.type === 'capture' && (
        <BattleEffects animation={currentAnimation} />
      )}
    </group>
  );
}

interface BattleEffectsProps {
  animation: any;
}

function BattleEffects({ animation }: BattleEffectsProps) {
  const explosionRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (explosionRef.current) {
      explosionRef.current.rotation.y += delta * 2;
      explosionRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 10) * 0.1);
    }
  });

  return (
    <group ref={explosionRef} position={animation.position || [0, 1, 0]}>
      {/* Explosion effect */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} position={[
          Math.cos((i * Math.PI * 2) / 5) * 0.5,
          0,
          Math.sin((i * Math.PI * 2) / 5) * 0.5
        ]}>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshBasicMaterial color="#ff4500" transparent opacity={0.8} />
        </mesh>
      ))}
      
      {/* Sparks */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <mesh key={`spark-${i}`} position={[
          Math.cos((i * Math.PI) / 4) * 1,
          Math.random() * 0.5,
          Math.sin((i * Math.PI) / 4) * 1
        ]}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      ))}
    </group>
  );
}
