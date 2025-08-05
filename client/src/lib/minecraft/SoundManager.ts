import { useEffect, useRef } from 'react';
import { useAudio } from '../stores/useAudio';

export function SoundManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound, isMuted } = useAudio();
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const hitSoundRef = useRef<HTMLAudioElement | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load background music
    const backgroundMusic = new Audio('/sounds/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    backgroundMusicRef.current = backgroundMusic;
    setBackgroundMusic(backgroundMusic);

    // Load hit sound
    const hitSound = new Audio('/sounds/hit.mp3');
    hitSound.volume = 0.5;
    hitSoundRef.current = hitSound;
    setHitSound(hitSound);

    // Load success sound
    const successSound = new Audio('/sounds/success.mp3');
    successSound.volume = 0.6;
    successSoundRef.current = successSound;
    setSuccessSound(successSound);

    // Start background music if not muted
    if (!isMuted) {
      backgroundMusic.play().catch(error => {
        console.log('Background music play prevented:', error);
      });
    }

    return () => {
      // Cleanup on unmount
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
      if (hitSoundRef.current) {
        hitSoundRef.current.pause();
        hitSoundRef.current = null;
      }
      if (successSoundRef.current) {
        successSoundRef.current.pause();
        successSoundRef.current = null;
      }
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Handle mute/unmute
  useEffect(() => {
    if (backgroundMusicRef.current) {
      if (isMuted) {
        backgroundMusicRef.current.pause();
      } else {
        backgroundMusicRef.current.play().catch(error => {
          console.log('Background music play prevented:', error);
        });
      }
    }
  }, [isMuted]);

  return null; // This component doesn't render anything
}

// Additional sound utility functions
export class MinecraftSounds {
  private static soundCache: Map<string, HTMLAudioElement> = new Map();
  
  // Character-specific sounds based on biome and action
  static characterSounds: Record<string, Record<string, Record<string, string>>> = {
    pawn: {
      forest: {
        move: '/sounds/villager_ambient.mp3',
        capture: '/sounds/villager_hurt.mp3',
        special: '/sounds/villager_yes.mp3'
      },
      desert: {
        move: '/sounds/husk_ambient.mp3',
        capture: '/sounds/husk_hurt.mp3',
        special: '/sounds/husk_death.mp3'
      },
      ocean: {
        move: '/sounds/drowned_ambient.mp3',
        capture: '/sounds/drowned_hurt.mp3',
        special: '/sounds/drowned_shoot.mp3'
      },
      nether: {
        move: '/sounds/zombified_piglin_ambient.mp3',
        capture: '/sounds/zombified_piglin_hurt.mp3',
        special: '/sounds/zombified_piglin_angry.mp3'
      }
    },
    rook: {
      forest: {
        move: '/sounds/iron_golem_step.mp3',
        capture: '/sounds/iron_golem_attack.mp3',
        special: '/sounds/iron_golem_repair.mp3'
      },
      desert: {
        move: '/sounds/guardian_ambient.mp3',
        capture: '/sounds/guardian_attack.mp3',
        special: '/sounds/guardian_beam.mp3'
      },
      ocean: {
        move: '/sounds/elder_guardian_ambient.mp3',
        capture: '/sounds/elder_guardian_curse.mp3',
        special: '/sounds/elder_guardian_death.mp3'
      },
      nether: {
        move: '/sounds/wither_skeleton_ambient.mp3',
        capture: '/sounds/wither_skeleton_hurt.mp3',
        special: '/sounds/wither_skeleton_death.mp3'
      }
    },
    knight: {
      forest: {
        move: '/sounds/horse_gallop.mp3',
        capture: '/sounds/horse_angry.mp3',
        special: '/sounds/horse_jump.mp3'
      },
      desert: {
        move: '/sounds/spider_ambient.mp3',
        capture: '/sounds/spider_hurt.mp3',
        special: '/sounds/spider_death.mp3'
      },
      ocean: {
        move: '/sounds/dolphin_ambient.mp3',
        capture: '/sounds/dolphin_hurt.mp3',
        special: '/sounds/dolphin_play.mp3'
      },
      nether: {
        move: '/sounds/strider_step_lava.mp3',
        capture: '/sounds/strider_hurt.mp3',
        special: '/sounds/strider_retreat.mp3'
      }
    },
    bishop: {
      forest: {
        move: '/sounds/witch_ambient.mp3',
        capture: '/sounds/witch_hurt.mp3',
        special: '/sounds/witch_throw.mp3'
      },
      desert: {
        move: '/sounds/evoker_ambient.mp3',
        capture: '/sounds/evoker_hurt.mp3',
        special: '/sounds/evoker_cast_spell.mp3'
      },
      ocean: {
        move: '/sounds/squid_ambient.mp3',
        capture: '/sounds/squid_hurt.mp3',
        special: '/sounds/squid_squirt.mp3'
      },
      nether: {
        move: '/sounds/blaze_ambient.mp3',
        capture: '/sounds/blaze_hurt.mp3',
        special: '/sounds/blaze_shoot.mp3'
      }
    },
    queen: {
      forest: {
        move: '/sounds/ender_dragon_ambient.mp3',
        capture: '/sounds/ender_dragon_hurt.mp3',
        special: '/sounds/ender_dragon_shoot.mp3'
      },
      desert: {
        move: '/sounds/warden_step.mp3',
        capture: '/sounds/warden_hurt.mp3',
        special: '/sounds/warden_sonic_boom.mp3'
      },
      ocean: {
        move: '/sounds/guardian_ambient_land.mp3',
        capture: '/sounds/elder_guardian_hurt.mp3',
        special: '/sounds/elder_guardian_curse.mp3'
      },
      nether: {
        move: '/sounds/wither_ambient.mp3',
        capture: '/sounds/wither_hurt.mp3',
        special: '/sounds/wither_shoot.mp3'
      }
    },
    king: {
      forest: {
        move: '/sounds/villager_ambient.mp3',
        capture: '/sounds/villager_hurt.mp3',
        special: '/sounds/villager_celebrate.mp3'
      },
      desert: {
        move: '/sounds/husk_ambient.mp3',
        capture: '/sounds/husk_converted_to_zombie.mp3',
        special: '/sounds/zombie_ambient.mp3'
      },
      ocean: {
        move: '/sounds/trident_throw.mp3',
        capture: '/sounds/trident_hit.mp3',
        special: '/sounds/trident_thunder.mp3'
      },
      nether: {
        move: '/sounds/ghast_ambient.mp3',
        capture: '/sounds/ghast_hurt.mp3',
        special: '/sounds/ghast_shoot.mp3'
      }
    }
  };

  // Biome ambient sounds
  static biomeAmbientSounds: Record<string, string> = {
    forest: '/sounds/forest_ambient.mp3',
    desert: '/sounds/desert_ambient.mp3', 
    ocean: '/sounds/ocean_ambient.mp3',
    nether: '/sounds/nether_ambient.mp3'
  };

  // Game event sounds
  static gameEventSounds: Record<string, string> = {
    checkmate: '/sounds/victory_fanfare.mp3',
    check: '/sounds/warning_bell.mp3',
    castle: '/sounds/castle_move.mp3',
    promotion: '/sounds/level_up.mp3',
    illegal_move: '/sounds/error_buzz.mp3',
    game_start: '/sounds/game_start_horn.mp3',
    turn_change: '/sounds/turn_chime.mp3'
  };

  static async loadSound(soundPath: string): Promise<HTMLAudioElement> {
    if (this.soundCache.has(soundPath)) {
      return this.soundCache.get(soundPath)!;
    }

    const audio = new Audio(soundPath);
    audio.preload = 'auto';
    
    return new Promise((resolve, reject) => {
      audio.addEventListener('canplaythrough', () => {
        this.soundCache.set(soundPath, audio);
        resolve(audio);
      });
      
      audio.addEventListener('error', reject);
      
      // Fallback to default sound path if specific sound not found
      audio.addEventListener('error', () => {
        const fallbackPath = '/sounds/hit.mp3'; // Use existing hit sound as fallback
        const fallbackAudio = new Audio(fallbackPath);
        this.soundCache.set(soundPath, fallbackAudio);
        resolve(fallbackAudio);
      });
    });
  }

  static async playCharacterSound(
    pieceType: string, 
    biome: string, 
    action: 'move' | 'capture' | 'special',
    volume: number = 0.5
  ): Promise<void> {
    try {
      const soundPath = this.characterSounds[pieceType]?.[biome]?.[action];
      if (!soundPath) {
        // Fallback to generic sound
        const fallbackSound = action === 'move' ? '/sounds/hit.mp3' : '/sounds/success.mp3';
        const audio = await this.loadSound(fallbackSound);
        audio.volume = volume;
        audio.currentTime = 0;
        await audio.play();
        return;
      }

      const audio = await this.loadSound(soundPath);
      audio.volume = volume;
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.log(`Could not play character sound: ${error}`);
      // Fallback to basic sound
      try {
        const fallbackAudio = new Audio('/sounds/hit.mp3');
        fallbackAudio.volume = volume * 0.5;
        await fallbackAudio.play();
      } catch (fallbackError) {
        console.log('Could not play fallback sound:', fallbackError);
      }
    }
  }

  static async playGameEventSound(event: string, volume: number = 0.6): Promise<void> {
    try {
      const soundPath = this.gameEventSounds[event];
      if (!soundPath) return;

      const audio = await this.loadSound(soundPath);
      audio.volume = volume;
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.log(`Could not play game event sound: ${error}`);
    }
  }

  static async playBiomeAmbient(biome: string, volume: number = 0.2): Promise<HTMLAudioElement | null> {
    try {
      const soundPath = this.biomeAmbientSounds[biome];
      if (!soundPath) return null;

      const audio = await this.loadSound(soundPath);
      audio.volume = volume;
      audio.loop = true;
      await audio.play();
      return audio;
    } catch (error) {
      console.log(`Could not play biome ambient sound: ${error}`);
      return null;
    }
  }

  static stopAllSounds(): void {
    this.soundCache.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  static clearCache(): void {
    this.stopAllSounds();
    this.soundCache.clear();
  }

  // Volume control for all sounds
  static setMasterVolume(volume: number): void {
    this.soundCache.forEach(audio => {
      audio.volume = Math.min(1, Math.max(0, volume));
    });
  }

  // Create spatial audio effect (basic implementation)
  static createSpatialAudio(
    soundPath: string, 
    position: [number, number, number], 
    listenerPosition: [number, number, number] = [0, 0, 0]
  ): Promise<void> {
    return new Promise(async (resolve) => {
      try {
        const audio = await this.loadSound(soundPath);
        
        // Calculate distance for volume falloff
        const distance = Math.sqrt(
          Math.pow(position[0] - listenerPosition[0], 2) +
          Math.pow(position[1] - listenerPosition[1], 2) +
          Math.pow(position[2] - listenerPosition[2], 2)
        );
        
        // Volume falloff based on distance
        const maxDistance = 10;
        const volume = Math.max(0, 1 - (distance / maxDistance));
        
        audio.volume = volume * 0.5;
        audio.currentTime = 0;
        await audio.play();
        resolve();
      } catch (error) {
        console.log('Spatial audio error:', error);
        resolve();
      }
    });
  }
}
