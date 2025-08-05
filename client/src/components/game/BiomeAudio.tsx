import { useEffect, useRef } from 'react';
import { useAudio } from '../../lib/stores/useAudio';
import { useChessGame } from '../../lib/stores/useChessGame';
import { BIOME_CONFIGS } from '../../lib/minecraft/BiomeEnvironments';

export function BiomeAudio() {
  const { isEnabled } = useAudio();
  const { currentBiome } = useChessGame();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isEnabled) return;

    const biomeConfig = BIOME_CONFIGS[currentBiome];
    if (!biomeConfig?.sounds?.ambient) return;

    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create new ambient audio
    const audio = new Audio(biomeConfig.sounds.ambient);
    audio.loop = true;
    audio.volume = 0.3;
    
    // Fade in the audio
    audio.addEventListener('canplay', () => {
      audio.play().catch(console.warn);
      fadeIn(audio);
    });

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        fadeOut(audioRef.current);
      }
    };
  }, [currentBiome, isEnabled]);

  // Fade in audio
  const fadeIn = (audio: HTMLAudioElement) => {
    audio.volume = 0;
    const fadeDuration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const step = 0.3 / (fadeDuration / interval);
    
    const fadeInterval = setInterval(() => {
      if (audio.volume < 0.3) {
        audio.volume = Math.min(audio.volume + step, 0.3);
      } else {
        clearInterval(fadeInterval);
      }
    }, interval);
  };

  // Fade out audio
  const fadeOut = (audio: HTMLAudioElement) => {
    const fadeDuration = 1000; // 1 second
    const interval = 50;
    const step = audio.volume / (fadeDuration / interval);
    
    const fadeInterval = setInterval(() => {
      if (audio.volume > 0) {
        audio.volume = Math.max(audio.volume - step, 0);
      } else {
        audio.pause();
        clearInterval(fadeInterval);
      }
    }, interval);
  };

  return null; // This component doesn't render anything visual
}