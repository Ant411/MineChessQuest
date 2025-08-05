import * as THREE from 'three';

export interface BiomeConfig {
  name: string;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    fog: string;
  };
  lighting: {
    ambientColor: string;
    ambientIntensity: number;
    directionalColor: string;
    directionalIntensity: number;
    directionalPosition: [number, number, number];
    shadowIntensity: number;
  };
  particles: {
    type: 'snow' | 'rain' | 'leaves' | 'ash' | 'bubbles' | 'spores' | 'embers' | 'crystal';
    count: number;
    speed: number;
    size: number;
    color: string;
  };
  sounds: {
    ambient: string;
    footsteps: string;
    pieceMove: string;
    capture: string;
  };
  decorations: {
    boardEdge: string[];
    corners: string[];
    background: string[];
    foreground: string[];
  };
  texturePatterns: {
    lightSquares: string;
    darkSquares: string;
    border: string;
    background: string;
  };
}

export const BIOME_CONFIGS: Record<string, BiomeConfig> = {
  forest: {
    name: 'forest',
    displayName: 'Enchanted Forest',
    description: 'A magical woodland with towering oak trees, glowing mushrooms, and moss-covered stones',
    colors: {
      primary: '#2d5016',
      secondary: '#8bc34a',
      accent: '#4caf50',
      background: '#1b3d0a',
      fog: '#2d5016'
    },
    lighting: {
      ambientColor: '#4caf50',
      ambientIntensity: 0.3,
      directionalColor: '#8bc34a',
      directionalIntensity: 0.8,
      directionalPosition: [10, 15, 5],
      shadowIntensity: 0.6
    },
    particles: {
      type: 'leaves',
      count: 50,
      speed: 0.02,
      size: 0.1,
      color: '#4caf50'
    },
    sounds: {
      ambient: '/sounds/forest_ambient.mp3',
      footsteps: '/sounds/grass_step.mp3',
      pieceMove: '/sounds/wood_step.mp3',
      capture: '/sounds/wood_break.mp3'
    },
    decorations: {
      boardEdge: ['oak_log', 'birch_log', 'moss_stone', 'fern'],
      corners: ['oak_tree', 'birch_tree', 'mushroom_red', 'mushroom_brown'],
      background: ['forest_hills', 'oak_forest', 'birch_grove'],
      foreground: ['tall_grass', 'flowers', 'small_mushrooms', 'rocks']
    },
    texturePatterns: {
      lightSquares: 'repeating-linear-gradient(45deg, #8bc34a 0px, #8bc34a 8px, #7cb342 8px, #7cb342 16px)',
      darkSquares: 'repeating-linear-gradient(45deg, #2d5016 0px, #2d5016 8px, #1b3d0a 8px, #1b3d0a 16px)',
      border: 'repeating-linear-gradient(0deg, #4caf50 0px, #4caf50 4px, #2d5016 4px, #2d5016 8px)',
      background: 'radial-gradient(circle, #1b3d0a 0%, #0d1f05 100%)'
    }
  },

  desert: {
    name: 'desert',
    displayName: 'Ancient Desert',
    description: 'Vast sand dunes with ancient pyramids, cacti, and mysterious sandstone ruins',
    colors: {
      primary: '#d4af37',
      secondary: '#daa520',
      accent: '#ff8c00',
      background: '#8b4513',
      fog: '#d2b48c'
    },
    lighting: {
      ambientColor: '#ff8c00',
      ambientIntensity: 0.4,
      directionalColor: '#ffd700',
      directionalIntensity: 1.2,
      directionalPosition: [5, 20, 8],
      shadowIntensity: 0.8
    },
    particles: {
      type: 'ash',
      count: 30,
      speed: 0.01,
      size: 0.05,
      color: '#daa520'
    },
    sounds: {
      ambient: '/sounds/desert_wind.mp3',
      footsteps: '/sounds/sand_step.mp3',
      pieceMove: '/sounds/stone_step.mp3',
      capture: '/sounds/stone_break.mp3'
    },
    decorations: {
      boardEdge: ['sandstone', 'sand', 'cactus', 'dead_bush'],
      corners: ['pyramid_corner', 'large_cactus', 'sandstone_pillar', 'ancient_ruins'],
      background: ['sand_dunes', 'pyramid', 'oasis_distant'],
      foreground: ['small_cacti', 'bones', 'pottery_shards', 'scorpions']
    },
    texturePatterns: {
      lightSquares: 'repeating-linear-gradient(45deg, #daa520 0px, #daa520 8px, #d4af37 8px, #d4af37 16px)',
      darkSquares: 'repeating-linear-gradient(45deg, #8b4513 0px, #8b4513 8px, #654321 8px, #654321 16px)',
      border: 'repeating-linear-gradient(0deg, #ff8c00 0px, #ff8c00 4px, #8b4513 4px, #8b4513 8px)',
      background: 'radial-gradient(circle, #8b4513 0%, #5a2d0c 100%)'
    }
  },

  ocean: {
    name: 'ocean',
    displayName: 'Deep Ocean Depths',
    description: 'Underwater realm with coral reefs, kelp forests, and bioluminescent creatures',
    colors: {
      primary: '#006994',
      secondary: '#20b2aa',
      accent: '#00ced1',
      background: '#003366',
      fog: '#4682b4'
    },
    lighting: {
      ambientColor: '#20b2aa',
      ambientIntensity: 0.5,
      directionalColor: '#00ced1',
      directionalIntensity: 0.7,
      directionalPosition: [0, 25, 0],
      shadowIntensity: 0.4
    },
    particles: {
      type: 'bubbles',
      count: 80,
      speed: 0.03,
      size: 0.08,
      color: '#87ceeb'
    },
    sounds: {
      ambient: '/sounds/underwater_ambient.mp3',
      footsteps: '/sounds/water_step.mp3',
      pieceMove: '/sounds/water_move.mp3',
      capture: '/sounds/water_splash.mp3'
    },
    decorations: {
      boardEdge: ['prismarine', 'sea_lantern', 'coral_reef', 'kelp'],
      corners: ['ocean_monument', 'giant_kelp', 'coral_tower', 'shipwreck'],
      background: ['ocean_floor', 'underwater_caves', 'distant_monuments'],
      foreground: ['small_coral', 'sea_grass', 'tropical_fish', 'sea_anemones']
    },
    texturePatterns: {
      lightSquares: 'repeating-linear-gradient(45deg, #20b2aa 0px, #20b2aa 8px, #48d1cc 8px, #48d1cc 16px)',
      darkSquares: 'repeating-linear-gradient(45deg, #006994 0px, #006994 8px, #004d6b 8px, #004d6b 16px)',
      border: 'repeating-linear-gradient(0deg, #00ced1 0px, #00ced1 4px, #003366 4px, #003366 8px)',
      background: 'radial-gradient(circle, #003366 0%, #001122 100%)'
    }
  },

  nether: {
    name: 'nether',
    displayName: 'Nether Fortress',
    description: 'Fiery hellscape with lava lakes, nether brick fortresses, and glowing red mist',
    colors: {
      primary: '#8b0000',
      secondary: '#dc143c',
      accent: '#ff4500',
      background: '#2f0000',
      fog: '#800000'
    },
    lighting: {
      ambientColor: '#dc143c',
      ambientIntensity: 0.6,
      directionalColor: '#ff4500',
      directionalIntensity: 1.0,
      directionalPosition: [0, 10, 10],
      shadowIntensity: 0.9
    },
    particles: {
      type: 'embers',
      count: 100,
      speed: 0.04,
      size: 0.06,
      color: '#ff4500'
    },
    sounds: {
      ambient: '/sounds/nether_ambient.mp3',
      footsteps: '/sounds/nether_brick_step.mp3',
      pieceMove: '/sounds/fire_crackle.mp3',
      capture: '/sounds/lava_pop.mp3'
    },
    decorations: {
      boardEdge: ['nether_brick', 'magma_block', 'soul_sand', 'nether_wart'],
      corners: ['nether_fortress', 'lava_falls', 'ghast_tower', 'blaze_spawner'],
      background: ['lava_ocean', 'nether_cliffs', 'fortress_walls'],
      foreground: ['small_fires', 'magma_cubes', 'soul_fire', 'nether_crystals']
    },
    texturePatterns: {
      lightSquares: 'repeating-linear-gradient(45deg, #dc143c 0px, #dc143c 8px, #b22222 8px, #b22222 16px)',
      darkSquares: 'repeating-linear-gradient(45deg, #8b0000 0px, #8b0000 8px, #2f0000 8px, #2f0000 16px)',
      border: 'repeating-linear-gradient(0deg, #ff4500 0px, #ff4500 4px, #2f0000 4px, #2f0000 8px)',
      background: 'radial-gradient(circle, #2f0000 0%, #0f0000 100%)'
    }
  },

  end: {
    name: 'end',
    displayName: 'The End Dimension',
    description: 'Mysterious void realm with floating islands, chorus plants, and purple mist',
    colors: {
      primary: '#483d8b',
      secondary: '#9370db',
      accent: '#8a2be2',
      background: '#191970',
      fog: '#2e0854'
    },
    lighting: {
      ambientColor: '#9370db',
      ambientIntensity: 0.4,
      directionalColor: '#8a2be2',
      directionalIntensity: 0.6,
      directionalPosition: [0, 30, 0],
      shadowIntensity: 0.7
    },
    particles: {
      type: 'crystal',
      count: 60,
      speed: 0.015,
      size: 0.12,
      color: '#9370db'
    },
    sounds: {
      ambient: '/sounds/end_ambient.mp3',
      footsteps: '/sounds/end_stone_step.mp3',
      pieceMove: '/sounds/teleport.mp3',
      capture: '/sounds/chorus_break.mp3'
    },
    decorations: {
      boardEdge: ['end_stone', 'purpur_block', 'chorus_plant', 'end_rod'],
      corners: ['end_crystal', 'chorus_tree', 'end_gateway', 'shulker_box'],
      background: ['void_islands', 'end_city', 'dragon_perch'],
      foreground: ['small_crystals', 'enderlings', 'void_mist', 'portal_particles']
    },
    texturePatterns: {
      lightSquares: 'repeating-linear-gradient(45deg, #9370db 0px, #9370db 8px, #8a2be2 8px, #8a2be2 16px)',
      darkSquares: 'repeating-linear-gradient(45deg, #483d8b 0px, #483d8b 8px, #191970 8px, #191970 16px)',
      border: 'repeating-linear-gradient(0deg, #8a2be2 0px, #8a2be2 4px, #191970 4px, #191970 8px)',
      background: 'radial-gradient(circle, #191970 0%, #0a0a2e 100%)'
    }
  },

  mushroom: {
    name: 'mushroom',
    displayName: 'Mushroom Island',
    description: 'Surreal fungal landscape with giant mushrooms, mycelium ground, and glowing spores',
    colors: {
      primary: '#8b4682',
      secondary: '#da70d6',
      accent: '#ff69b4',
      background: '#4b0082',
      fog: '#9370db'
    },
    lighting: {
      ambientColor: '#da70d6',
      ambientIntensity: 0.5,
      directionalColor: '#ff69b4',
      directionalIntensity: 0.8,
      directionalPosition: [8, 12, 6],
      shadowIntensity: 0.5
    },
    particles: {
      type: 'spores',
      count: 70,
      speed: 0.025,
      size: 0.04,
      color: '#da70d6'
    },
    sounds: {
      ambient: '/sounds/mushroom_ambient.mp3',
      footsteps: '/sounds/mycelium_step.mp3',
      pieceMove: '/sounds/mushroom_squish.mp3',
      capture: '/sounds/spore_pop.mp3'
    },
    decorations: {
      boardEdge: ['mycelium', 'mushroom_stem', 'red_mushroom', 'brown_mushroom'],
      corners: ['giant_mushroom_red', 'giant_mushroom_brown', 'mushroom_tree', 'spore_cloud'],
      background: ['mushroom_fields', 'giant_fungi', 'mycelium_hills'],
      foreground: ['tiny_mushrooms', 'glowing_fungi', 'spore_particles', 'mooshrooms']
    },
    texturePatterns: {
      lightSquares: 'repeating-linear-gradient(45deg, #da70d6 0px, #da70d6 8px, #c966c7 8px, #c966c7 16px)',
      darkSquares: 'repeating-linear-gradient(45deg, #8b4682 0px, #8b4682 8px, #4b0082 8px, #4b0082 16px)',
      border: 'repeating-linear-gradient(0deg, #ff69b4 0px, #ff69b4 4px, #4b0082 4px, #4b0082 8px)',
      background: 'radial-gradient(circle, #4b0082 0%, #2f1b69 100%)'
    }
  },

  ice: {
    name: 'ice',
    displayName: 'Frozen Tundra',
    description: 'Icy wasteland with snow-covered peaks, frozen lakes, and aurora lights',
    colors: {
      primary: '#4682b4',
      secondary: '#87ceeb',
      accent: '#00ffff',
      background: '#191970',
      fog: '#b0c4de'
    },
    lighting: {
      ambientColor: '#87ceeb',
      ambientIntensity: 0.6,
      directionalColor: '#00ffff',
      directionalIntensity: 0.9,
      directionalPosition: [15, 20, 10],
      shadowIntensity: 0.3
    },
    particles: {
      type: 'snow',
      count: 90,
      speed: 0.02,
      size: 0.07,
      color: '#ffffff'
    },
    sounds: {
      ambient: '/sounds/ice_ambient.mp3',
      footsteps: '/sounds/snow_step.mp3',
      pieceMove: '/sounds/ice_slide.mp3',
      capture: '/sounds/ice_break.mp3'
    },
    decorations: {
      boardEdge: ['ice', 'packed_ice', 'snow_block', 'frosted_ice'],
      corners: ['ice_spikes', 'igloo', 'frozen_waterfall', 'aurora_pillar'],
      background: ['snowy_mountains', 'frozen_ocean', 'aurora_sky'],
      foreground: ['snow_drifts', 'ice_crystals', 'polar_bears', 'frozen_plants']
    },
    texturePatterns: {
      lightSquares: 'repeating-linear-gradient(45deg, #87ceeb 0px, #87ceeb 8px, #b0c4de 8px, #b0c4de 16px)',
      darkSquares: 'repeating-linear-gradient(45deg, #4682b4 0px, #4682b4 8px, #191970 8px, #191970 16px)',
      border: 'repeating-linear-gradient(0deg, #00ffff 0px, #00ffff 4px, #191970 4px, #191970 8px)',
      background: 'radial-gradient(circle, #191970 0%, #0f0f2a 100%)'
    }
  },

  jungle: {
    name: 'jungle',
    displayName: 'Dense Jungle',
    description: 'Lush tropical rainforest with ancient temples, vines, and exotic wildlife',
    colors: {
      primary: '#228b22',
      secondary: '#32cd32',
      accent: '#adff2f',
      background: '#006400',
      fog: '#2e8b57'
    },
    lighting: {
      ambientColor: '#32cd32',
      ambientIntensity: 0.4,
      directionalColor: '#adff2f',
      directionalIntensity: 0.7,
      directionalPosition: [5, 25, 8],
      shadowIntensity: 0.8
    },
    particles: {
      type: 'leaves',
      count: 60,
      speed: 0.03,
      size: 0.09,
      color: '#32cd32'
    },
    sounds: {
      ambient: '/sounds/jungle_ambient.mp3',
      footsteps: '/sounds/leaves_step.mp3',
      pieceMove: '/sounds/vine_swing.mp3',
      capture: '/sounds/jungle_roar.mp3'
    },
    decorations: {
      boardEdge: ['jungle_log', 'vines', 'cocoa_pods', 'jungle_leaves'],
      corners: ['jungle_temple', 'large_jungle_tree', 'waterfall', 'parrot_perch'],
      background: ['jungle_canopy', 'temple_ruins', 'misty_valleys'],
      foreground: ['ferns', 'jungle_flowers', 'butterflies', 'monkey_vines']
    },
    texturePatterns: {
      lightSquares: 'repeating-linear-gradient(45deg, #32cd32 0px, #32cd32 8px, #3cb371 8px, #3cb371 16px)',
      darkSquares: 'repeating-linear-gradient(45deg, #228b22 0px, #228b22 8px, #006400 8px, #006400 16px)',
      border: 'repeating-linear-gradient(0deg, #adff2f 0px, #adff2f 4px, #006400 4px, #006400 8px)',
      background: 'radial-gradient(circle, #006400 0%, #004225 100%)'
    }
  }
};

export class BiomeEnvironment {
  private config: BiomeConfig;
  private particles: THREE.Points | null = null;
  private decorations: THREE.Group[] = [];
  private ambientLight: THREE.AmbientLight | null = null;
  private directionalLight: THREE.DirectionalLight | null = null;

  constructor(biomeName: string) {
    this.config = BIOME_CONFIGS[biomeName] || BIOME_CONFIGS.forest;
  }

  createEnvironment(scene: THREE.Scene): void {
    this.setupLighting(scene);
    this.createParticleSystem(scene);
    this.createDecorations(scene);
    this.setupFog(scene);
  }

  private setupLighting(scene: THREE.Scene): void {
    // Remove existing lights
    if (this.ambientLight) scene.remove(this.ambientLight);
    if (this.directionalLight) scene.remove(this.directionalLight);

    // Create ambient light
    this.ambientLight = new THREE.AmbientLight(
      this.config.lighting.ambientColor,
      this.config.lighting.ambientIntensity
    );
    scene.add(this.ambientLight);

    // Create directional light
    this.directionalLight = new THREE.DirectionalLight(
      this.config.lighting.directionalColor,
      this.config.lighting.directionalIntensity
    );
    
    const [x, y, z] = this.config.lighting.directionalPosition;
    this.directionalLight.position.set(x, y, z);
    this.directionalLight.castShadow = true;
    
    // Configure shadow properties
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 100;
    this.directionalLight.shadow.camera.left = -50;
    this.directionalLight.shadow.camera.right = 50;
    this.directionalLight.shadow.camera.top = 50;
    this.directionalLight.shadow.camera.bottom = -50;
    this.directionalLight.shadow.intensity = this.config.lighting.shadowIntensity;
    
    scene.add(this.directionalLight);
  }

  private createParticleSystem(scene: THREE.Scene): void {
    if (this.particles) {
      scene.remove(this.particles);
    }

    const particleCount = this.config.particles.count;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Initialize particle positions and velocities
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a box around the chess board
      positions[i3] = (Math.random() - 0.5) * 40;     // x
      positions[i3 + 1] = Math.random() * 20 + 5;     // y
      positions[i3 + 2] = (Math.random() - 0.5) * 40; // z
      
      // Particle-specific velocities
      velocities[i3] = (Math.random() - 0.5) * this.config.particles.speed;
      velocities[i3 + 1] = -Math.random() * this.config.particles.speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * this.config.particles.speed;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // Create material based on particle type
    const material = this.createParticleMaterial();
    
    this.particles = new THREE.Points(geometry, material);
    scene.add(this.particles);
  }

  private createParticleMaterial(): THREE.PointsMaterial {
    const material = new THREE.PointsMaterial({
      size: this.config.particles.size,
      color: this.config.particles.color,
      transparent: true,
      opacity: 0.7,
      alphaTest: 0.1
    });

    // Add texture based on particle type
    switch (this.config.particles.type) {
      case 'snow':
        material.opacity = 0.8;
        break;
      case 'rain':
        material.opacity = 0.6;
        break;
      case 'bubbles':
        material.opacity = 0.4;
        break;
      case 'embers':
        material.opacity = 0.9;
        break;
      default:
        material.opacity = 0.7;
    }

    return material;
  }

  private createDecorations(scene: THREE.Scene): void {
    // Clear existing decorations
    this.decorations.forEach(decoration => scene.remove(decoration));
    this.decorations = [];

    // Create board edge decorations
    this.createBoardEdgeDecorations(scene);
    
    // Create corner decorations
    this.createCornerDecorations(scene);
    
    // Create background decorations
    this.createBackgroundDecorations(scene);
  }

  private createBoardEdgeDecorations(scene: THREE.Scene): void {
    const boardSize = 8;
    const squareSize = 1;
    
    this.config.decorations.boardEdge.forEach((decorationType, index) => {
      // Create decorations around the board perimeter
      for (let i = 0; i < boardSize; i++) {
        // Top edge
        this.createDecoration(scene, decorationType, 
          i * squareSize - boardSize/2 + 0.5, 0.1, -boardSize/2 - 0.5);
        
        // Bottom edge
        this.createDecoration(scene, decorationType, 
          i * squareSize - boardSize/2 + 0.5, 0.1, boardSize/2 + 0.5);
        
        // Left edge
        this.createDecoration(scene, decorationType, 
          -boardSize/2 - 0.5, 0.1, i * squareSize - boardSize/2 + 0.5);
        
        // Right edge
        this.createDecoration(scene, decorationType, 
          boardSize/2 + 0.5, 0.1, i * squareSize - boardSize/2 + 0.5);
      }
    });
  }

  private createCornerDecorations(scene: THREE.Scene): void {
    const boardSize = 8;
    const distance = 6;
    
    this.config.decorations.corners.forEach((decorationType, index) => {
      const positions = [
        [-distance, 0, -distance], // Top-left
        [distance, 0, -distance],  // Top-right
        [-distance, 0, distance],  // Bottom-left
        [distance, 0, distance]    // Bottom-right
      ];
      
      if (positions[index]) {
        const [x, y, z] = positions[index];
        this.createDecoration(scene, decorationType, x, y, z, 2); // Larger scale for corners
      }
    });
  }

  private createBackgroundDecorations(scene: THREE.Scene): void {
    this.config.decorations.background.forEach((decorationType, index) => {
      // Create distant background elements
      const angle = (index / this.config.decorations.background.length) * Math.PI * 2;
      const distance = 15 + Math.random() * 10;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      
      this.createDecoration(scene, decorationType, x, 0, z, 3); // Even larger for background
    });
  }

  private createDecoration(scene: THREE.Scene, type: string, x: number, y: number, z: number, scale = 1): void {
    const decoration = new THREE.Group();
    
    // Create different decoration types
    switch (type) {
      case 'oak_tree':
      case 'birch_tree':
      case 'jungle_tree':
        this.createTree(decoration, type, scale);
        break;
      case 'cactus':
      case 'large_cactus':
        this.createCactus(decoration, scale);
        break;
      case 'mushroom_red':
      case 'mushroom_brown':
        this.createMushroom(decoration, type, scale);
        break;
      case 'pyramid':
      case 'pyramid_corner':
        this.createPyramid(decoration, scale);
        break;
      case 'ocean_monument':
        this.createMonument(decoration, scale);
        break;
      case 'nether_fortress':
        this.createFortress(decoration, scale);
        break;
      case 'ice_spikes':
        this.createIceSpikes(decoration, scale);
        break;
      default:
        this.createGenericDecoration(decoration, type, scale);
    }
    
    decoration.position.set(x, y, z);
    scene.add(decoration);
    this.decorations.push(decoration);
  }

  private createTree(group: THREE.Group, type: string, scale: number): void {
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.1 * scale, 0.15 * scale, 2 * scale, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = scale;
    group.add(trunk);

    // Leaves
    const leavesGeometry = new THREE.SphereGeometry(0.8 * scale, 8, 6);
    const leavesColor = type === 'birch_tree' ? 0x90EE90 : 0x228B22;
    const leavesMaterial = new THREE.MeshLambertMaterial({ color: leavesColor });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 2.2 * scale;
    group.add(leaves);
  }

  private createCactus(group: THREE.Group, scale: number): void {
    const segments = Math.floor(2 + Math.random() * 3);
    
    for (let i = 0; i < segments; i++) {
      const geometry = new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 0.8 * scale, 6);
      const material = new THREE.MeshLambertMaterial({ color: 0x228B22 });
      const segment = new THREE.Mesh(geometry, material);
      segment.position.y = (i * 0.8 + 0.4) * scale;
      group.add(segment);
    }
  }

  private createMushroom(group: THREE.Group, type: string, scale: number): void {
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.1 * scale, 0.1 * scale, 0.6 * scale, 8);
    const stemMaterial = new THREE.MeshLambertMaterial({ color: 0xF5DEB3 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.3 * scale;
    group.add(stem);

    // Cap
    const capGeometry = new THREE.SphereGeometry(0.4 * scale, 12, 8);
    const capColor = type === 'mushroom_red' ? 0xFF0000 : 0x8B4513;
    const capMaterial = new THREE.MeshLambertMaterial({ color: capColor });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 0.8 * scale;
    cap.scale.y = 0.6;
    group.add(cap);
  }

  private createPyramid(group: THREE.Group, scale: number): void {
    const geometry = new THREE.ConeGeometry(2 * scale, 3 * scale, 4);
    const material = new THREE.MeshLambertMaterial({ color: 0xDAA520 });
    const pyramid = new THREE.Mesh(geometry, material);
    pyramid.position.y = 1.5 * scale;
    pyramid.rotation.y = Math.PI / 4;
    group.add(pyramid);
  }

  private createMonument(group: THREE.Group, scale: number): void {
    const geometry = new THREE.BoxGeometry(2 * scale, 3 * scale, 2 * scale);
    const material = new THREE.MeshLambertMaterial({ color: 0x4682B4 });
    const monument = new THREE.Mesh(geometry, material);
    monument.position.y = 1.5 * scale;
    group.add(monument);
  }

  private createFortress(group: THREE.Group, scale: number): void {
    const geometry = new THREE.BoxGeometry(3 * scale, 2 * scale, 1 * scale);
    const material = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
    const fortress = new THREE.Mesh(geometry, material);
    fortress.position.y = scale;
    group.add(fortress);
  }

  private createIceSpikes(group: THREE.Group, scale: number): void {
    for (let i = 0; i < 3; i++) {
      const height = (1 + Math.random() * 2) * scale;
      const geometry = new THREE.ConeGeometry(0.2 * scale, height, 6);
      const material = new THREE.MeshLambertMaterial({ color: 0x87CEEB });
      const spike = new THREE.Mesh(geometry, material);
      spike.position.set(
        (Math.random() - 0.5) * scale,
        height / 2,
        (Math.random() - 0.5) * scale
      );
      group.add(spike);
    }
  }

  private createGenericDecoration(group: THREE.Group, type: string, scale: number): void {
    // Fallback decoration - simple colored box
    const geometry = new THREE.BoxGeometry(0.5 * scale, 0.5 * scale, 0.5 * scale);
    const material = new THREE.MeshLambertMaterial({ color: this.config.colors.accent });
    const decoration = new THREE.Mesh(geometry, material);
    decoration.position.y = 0.25 * scale;
    group.add(decoration);
  }

  private setupFog(scene: THREE.Scene): void {
    scene.fog = new THREE.Fog(this.config.colors.fog, 20, 80);
  }

  updateParticles(): void {
    if (!this.particles) return;

    const positions = this.particles.geometry.attributes.position.array as Float32Array;
    const velocities = this.particles.geometry.attributes.velocity.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      // Update positions based on velocities
      positions[i] += velocities[i];     // x
      positions[i + 1] += velocities[i + 1]; // y
      positions[i + 2] += velocities[i + 2]; // z

      // Reset particles that fall below ground or move too far
      if (positions[i + 1] < 0 || Math.abs(positions[i]) > 20 || Math.abs(positions[i + 2]) > 20) {
        positions[i] = (Math.random() - 0.5) * 40;
        positions[i + 1] = 20 + Math.random() * 10;
        positions[i + 2] = (Math.random() - 0.5) * 40;
      }
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  getConfig(): BiomeConfig {
    return this.config;
  }

  dispose(): void {
    // Clean up resources
    this.decorations.forEach(decoration => {
      decoration.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });
    
    if (this.particles) {
      this.particles.geometry.dispose();
      if (this.particles.material instanceof THREE.Material) {
        this.particles.material.dispose();
      }
    }
  }
}