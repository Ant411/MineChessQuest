import * as THREE from 'three';

export interface AnimationData {
  type: 'move' | 'capture' | 'special_move' | 'game_over' | 'spawn' | 'teleport';
  from?: [number, number, number];
  to?: [number, number, number];
  piece?: any;
  capturedPiece?: any;
  duration?: number;
  characterType?: string;
  biome?: string;
}

export class Animations {
  private static particleSystems: Map<string, THREE.Points> = new Map();
  private static animationQueue: AnimationData[] = [];
  private static isPlaying = false;

  // Main animation controller
  static playMoveAnimation(data: AnimationData): void {
    console.log('Playing move animation:', data);
    
    if (data.characterType && data.biome) {
      this.playCharacterSpecificMove(data);
    } else {
      this.playBasicMove(data);
    }
  }

  static playCaptureAnimation(data: AnimationData): void {
    console.log('Playing capture animation:', data);
    
    if (data.piece && data.capturedPiece) {
      this.playBattleSequence(data);
    } else {
      this.playBasicCapture(data);
    }
  }

  static playSpecialMoveAnimation(data: AnimationData): void {
    console.log('Playing special move animation:', data);
    
    switch (data.piece?.type) {
      case 'pawn':
        this.playZombieHordeAnimation(data);
        break;
      case 'knight':
        this.playTeleportAnimation(data);
        break;
      case 'bishop':
        this.playPotionAnimation(data);
        break;
      case 'rook':
        this.playCastleWallAnimation(data);
        break;
      case 'queen':
        this.playRoyalCommandAnimation(data);
        break;
      case 'king':
        this.playRoyalDecreeAnimation(data);
        break;
      default:
        this.playGenericSpecialAnimation(data);
    }
  }

  static playGameOverAnimation(data: AnimationData): void {
    console.log('Playing game over animation:', data);
    this.playVictoryAnimation(data);
  }

  // Character-specific move animations
  private static playCharacterSpecificMove(data: AnimationData): void {
    const { characterType, biome, from, to } = data;
    
    if (!from || !to) return;

    // Create movement trail based on character and biome
    this.createMovementTrail(from, to, characterType!, biome!);
    
    // Play character sound effects would go here
    this.playCharacterSounds(characterType!, 'move', biome!);
  }

  private static playBasicMove(data: AnimationData): void {
    if (!data.from || !data.to) return;
    
    // Simple particle trail
    this.createBasicTrail(data.from, data.to);
  }

  // Battle sequence animations
  private static playBattleSequence(data: AnimationData): void {
    const { piece, capturedPiece, to } = data;
    
    if (!to) return;
    
    // Determine battle style
    const battleStyle = this.getBattleStyle(piece, capturedPiece);
    
    switch (battleStyle) {
      case 'epic_boss_battle':
        this.playEpicBossBattle(to);
        break;
      case 'magic_vs_mundane':
        this.playMagicBattle(to);
        break;
      case 'protector_vs_undead':
        this.playProtectorBattle(to);
        break;
      case 'cross_biome_battle':
        this.playCrossBiomeBattle(to);
        break;
      default:
        this.playStandardBattle(to);
    }
  }

  private static playBasicCapture(data: AnimationData): void {
    if (!data.to) return;
    this.createExplosionEffect(data.to);
  }

  // Special ability animations
  private static playZombieHordeAnimation(data: AnimationData): void {
    if (!data.to) return;
    
    // Create multiple zombie particles moving together
    this.createHordeEffect(data.to);
    this.playCharacterSounds('zombie', 'special', data.biome || 'forest');
  }

  private static playTeleportAnimation(data: AnimationData): void {
    if (!data.from || !data.to) return;
    
    // Create teleport portal effects
    this.createTeleportPortals(data.from, data.to);
    this.playCharacterSounds('enderman', 'special', data.biome || 'forest');
  }

  private static playPotionAnimation(data: AnimationData): void {
    if (!data.to) return;
    
    // Create potion splash effect
    this.createPotionSplash(data.to);
    this.playCharacterSounds('witch', 'special', data.biome || 'forest');
  }

  private static playCastleWallAnimation(data: AnimationData): void {
    if (!data.to) return;
    
    // Create wall building effect
    this.createWallEffect(data.to);
    this.playCharacterSounds('iron_golem', 'special', data.biome || 'forest');
  }

  private static playRoyalCommandAnimation(data: AnimationData): void {
    if (!data.to) return;
    
    // Create royal aura effect
    this.createRoyalAura(data.to);
    this.playCharacterSounds('ender_dragon', 'special', data.biome || 'forest');
  }

  private static playRoyalDecreeAnimation(data: AnimationData): void {
    if (!data.to) return;
    
    // Create decree announcement effect
    this.createDecreeEffect(data.to);
    this.playCharacterSounds('villager', 'special', data.biome || 'forest');
  }

  private static playGenericSpecialAnimation(data: AnimationData): void {
    if (!data.to) return;
    this.createSparkleEffect(data.to);
  }

  // Victory animation
  private static playVictoryAnimation(data: AnimationData): void {
    // Create celebration fireworks
    this.createFireworks();
    
    // Play victory sounds
    this.playVictorySound(data.piece?.type || 'generic');
  }

  // Particle effect creators
  private static createMovementTrail(
    from: [number, number, number], 
    to: [number, number, number],
    characterType: string,
    biome: string
  ): void {
    const trailColors = this.getTrailColors(characterType, biome);
    
    // Create trail geometry
    const points = this.generateTrailPoints(from, to);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Create trail material based on character
    const material = new THREE.PointsMaterial({
      color: trailColors.primary,
      size: 0.1,
      transparent: true,
      opacity: 0.8
    });
    
    const trail = new THREE.Points(geometry, material);
    
    // Store for cleanup
    this.particleSystems.set(`trail_${Date.now()}`, trail);
    
    // Animate trail fade
    setTimeout(() => {
      material.opacity = 0;
      setTimeout(() => {
        this.particleSystems.delete(`trail_${Date.now()}`);
      }, 1000);
    }, 2000);
  }

  private static createBasicTrail(from: [number, number, number], to: [number, number, number]): void {
    const points = this.generateTrailPoints(from, to);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    
    const trail = new THREE.Points(geometry, material);
    this.particleSystems.set(`basic_trail_${Date.now()}`, trail);
  }

  private static generateTrailPoints(
    from: [number, number, number], 
    to: [number, number, number]
  ): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = from[0] + (to[0] - from[0]) * t;
      const y = from[1] + (to[1] - from[1]) * t + Math.sin(t * Math.PI) * 0.5;
      const z = from[2] + (to[2] - from[2]) * t;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    return points;
  }

  // Battle effect creators
  private static playEpicBossBattle(position: [number, number, number]): void {
    // Create massive explosion with multiple colors
    this.createExplosionEffect(position, 2.0, 0xff4500);
    
    setTimeout(() => {
      this.createExplosionEffect(position, 1.5, 0x8b00ff);
    }, 500);
    
    setTimeout(() => {
      this.createExplosionEffect(position, 1.0, 0xffd700);
    }, 1000);
  }

  private static playMagicBattle(position: [number, number, number]): void {
    // Create magical sparkles and potion effects
    this.createSparkleEffect(position);
    
    setTimeout(() => {
      this.createPotionSplash(position);
    }, 300);
  }

  private static playProtectorBattle(position: [number, number, number]): void {
    // Create shield clash and hammer strike effects
    this.createShieldClash(position);
    
    setTimeout(() => {
      this.createHammerStrike(position);
    }, 400);
  }

  private static playCrossBiomeBattle(position: [number, number, number]): void {
    // Create elemental clash effects
    this.createElementalClash(position);
  }

  private static playStandardBattle(position: [number, number, number]): void {
    this.createExplosionEffect(position);
  }

  // Specific effect implementations
  private static createExplosionEffect(
    position: [number, number, number], 
    scale: number = 1.0, 
    color: number = 0xff4500
  ): void {
    const particleCount = Math.floor(50 * scale);
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(1 - 2 * Math.random());
      const radius = Math.random() * scale;
      
      positions[i3] = position[0] + radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = position[1] + radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = position[2] + radius * Math.cos(phi);
      
      velocities[i3] = (Math.random() - 0.5) * scale;
      velocities[i3 + 1] = Math.random() * scale;
      velocities[i3 + 2] = (Math.random() - 0.5) * scale;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color,
      size: 0.1 * scale,
      transparent: true,
      opacity: 1
    });
    
    const explosion = new THREE.Points(geometry, material);
    this.particleSystems.set(`explosion_${Date.now()}`, explosion);
    
    // Animate explosion
    let time = 0;
    const animateExplosion = () => {
      time += 0.016;
      
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3] * 0.1;
        positions[i3 + 1] += velocities[i3 + 1] * 0.1 - 0.01; // Gravity
        positions[i3 + 2] += velocities[i3 + 2] * 0.1;
      }
      
      geometry.attributes.position.needsUpdate = true;
      material.opacity = Math.max(0, 1 - time * 2);
      
      if (time < 2) {
        requestAnimationFrame(animateExplosion);
      } else {
        this.particleSystems.delete(`explosion_${Date.now()}`);
      }
    };
    
    animateExplosion();
  }

  private static createHordeEffect(position: [number, number, number]): void {
    // Create multiple small explosions in sequence
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const offset: [number, number, number] = [
          position[0] + (Math.random() - 0.5) * 2,
          position[1],
          position[2] + (Math.random() - 0.5) * 2
        ];
        this.createExplosionEffect(offset, 0.5, 0x8b4513);
      }, i * 200);
    }
  }

  private static createTeleportPortals(from: [number, number, number], to: [number, number, number]): void {
    // Create portal at origin
    this.createPortalEffect(from, 0x8b00ff);
    
    // Create portal at destination after delay
    setTimeout(() => {
      this.createPortalEffect(to, 0x8b00ff);
    }, 500);
  }

  private static createPortalEffect(position: [number, number, number], color: number): void {
    const particleCount = 30;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.3;
      
      positions[i3] = position[0] + Math.cos(angle) * radius;
      positions[i3 + 1] = position[1] + Math.random() * 2;
      positions[i3 + 2] = position[2] + Math.sin(angle) * radius;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color,
      size: 0.15,
      transparent: true,
      opacity: 0.8
    });
    
    const portal = new THREE.Points(geometry, material);
    this.particleSystems.set(`portal_${Date.now()}`, portal);
  }

  private static createPotionSplash(position: [number, number, number]): void {
    this.createExplosionEffect(position, 0.8, 0x9932cc);
    
    // Add bubbles
    setTimeout(() => {
      this.createBubbleEffect(position);
    }, 200);
  }

  private static createBubbleEffect(position: [number, number, number]): void {
    const bubbleCount = 20;
    const positions = new Float32Array(bubbleCount * 3);
    
    for (let i = 0; i < bubbleCount; i++) {
      const i3 = i * 3;
      positions[i3] = position[0] + (Math.random() - 0.5) * 1;
      positions[i3 + 1] = position[1] + Math.random() * 0.5;
      positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 1;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x87ceeb,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    
    const bubbles = new THREE.Points(geometry, material);
    this.particleSystems.set(`bubbles_${Date.now()}`, bubbles);
  }

  private static createWallEffect(position: [number, number, number]): void {
    // Create rising block particles
    const blockCount = 15;
    const positions = new Float32Array(blockCount * 3);
    
    for (let i = 0; i < blockCount; i++) {
      const i3 = i * 3;
      positions[i3] = position[0] + (Math.random() - 0.5) * 3;
      positions[i3 + 1] = position[1];
      positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.5;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x808080,
      size: 0.2,
      transparent: true,
      opacity: 0.8
    });
    
    const wall = new THREE.Points(geometry, material);
    this.particleSystems.set(`wall_${Date.now()}`, wall);
  }

  private static createRoyalAura(position: [number, number, number]): void {
    // Create golden expanding ring
    this.createRingEffect(position, 0xffd700, 2.0);
  }

  private static createDecreeEffect(position: [number, number, number]): void {
    // Create announcement burst
    this.createExplosionEffect(position, 1.5, 0xffffff);
    
    setTimeout(() => {
      this.createRingEffect(position, 0xffd700, 3.0);
    }, 300);
  }

  private static createSparkleEffect(position: [number, number, number]): void {
    const sparkleCount = 25;
    const positions = new Float32Array(sparkleCount * 3);
    
    for (let i = 0; i < sparkleCount; i++) {
      const i3 = i * 3;
      positions[i3] = position[0] + (Math.random() - 0.5) * 2;
      positions[i3 + 1] = position[1] + Math.random() * 2;
      positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 2;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0xffff00,
      size: 0.08,
      transparent: true,
      opacity: 1
    });
    
    const sparkles = new THREE.Points(geometry, material);
    this.particleSystems.set(`sparkles_${Date.now()}`, sparkles);
  }

  private static createRingEffect(position: [number, number, number], color: number, maxRadius: number): void {
    const ringParticles = 40;
    const positions = new Float32Array(ringParticles * 3);
    
    for (let i = 0; i < ringParticles; i++) {
      const i3 = i * 3;
      const angle = (i / ringParticles) * Math.PI * 2;
      const radius = 0.5;
      
      positions[i3] = position[0] + Math.cos(angle) * radius;
      positions[i3 + 1] = position[1];
      positions[i3 + 2] = position[2] + Math.sin(angle) * radius;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color,
      size: 0.1,
      transparent: true,
      opacity: 0.8
    });
    
    const ring = new THREE.Points(geometry, material);
    this.particleSystems.set(`ring_${Date.now()}`, ring);
  }

  private static createShieldClash(position: [number, number, number]): void {
    this.createExplosionEffect(position, 1.0, 0xc0c0c0);
  }

  private static createHammerStrike(position: [number, number, number]): void {
    this.createExplosionEffect(position, 1.2, 0x8b4513);
  }

  private static createElementalClash(position: [number, number, number]): void {
    // Multi-colored explosion representing different biomes
    this.createExplosionEffect(position, 1.0, 0x228b22); // Forest green
    
    setTimeout(() => {
      this.createExplosionEffect(position, 0.8, 0xdeb887); // Desert sand
    }, 200);
    
    setTimeout(() => {
      this.createExplosionEffect(position, 0.6, 0x4682b4); // Ocean blue
    }, 400);
    
    setTimeout(() => {
      this.createExplosionEffect(position, 0.4, 0x8b0000); // Nether red
    }, 600);
  }

  private static createFireworks(): void {
    // Create celebration fireworks at random positions
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const position: [number, number, number] = [
          (Math.random() - 0.5) * 20,
          5 + Math.random() * 5,
          (Math.random() - 0.5) * 20
        ];
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        this.createExplosionEffect(position, 2.0, color);
      }, i * 500);
    }
  }

  // Helper methods
  private static getBattleStyle(attacker: any, defender: any): string {
    if (!attacker || !defender) return 'standard_battle';
    
    // Determine battle style based on piece types and characteristics
    if (attacker.type === 'queen' && defender.type === 'queen') {
      return 'epic_boss_battle';
    } else if (attacker.type === 'bishop' || defender.type === 'bishop') {
      return 'magic_vs_mundane';
    } else if (attacker.type === 'rook' && defender.type === 'pawn') {
      return 'protector_vs_undead';
    } else {
      return 'cross_biome_battle';
    }
  }

  private static getTrailColors(characterType: string, biome: string): { primary: number; secondary: number } {
    const colorMap = {
      forest: { primary: 0x228b22, secondary: 0x32cd32 },
      desert: { primary: 0xdeb887, secondary: 0xf4a460 },
      ocean: { primary: 0x4682b4, secondary: 0x87ceeb },
      nether: { primary: 0x8b0000, secondary: 0xff4500 }
    };
    
    return colorMap[biome as keyof typeof colorMap] || colorMap.forest;
  }

  private static playCharacterSounds(character: string, action: string, biome: string): void {
    // This would play actual Minecraft sounds using the existing audio system
    console.log(`Playing ${character} ${action} sound for ${biome} biome`);
  }

  private static playVictorySound(pieceType: string): void {
    console.log(`Playing victory sound for ${pieceType}`);
  }

  // Particle system update method
  static updateParticles(particleSystem: THREE.Points, animation: AnimationData, delta: number): void {
    if (!particleSystem || !animation) return;
    
    // Update particle positions and properties based on animation type
    const material = particleSystem.material as THREE.PointsMaterial;
    
    if (material.opacity > 0) {
      material.opacity -= delta * 0.5;
    }
    
    // Rotate particle system for dynamic effect
    particleSystem.rotation.y += delta;
  }

  // Cleanup method
  static cleanup(): void {
    this.particleSystems.clear();
    this.animationQueue.length = 0;
    this.isPlaying = false;
  }
}
