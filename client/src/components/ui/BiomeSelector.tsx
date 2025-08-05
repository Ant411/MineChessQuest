import React, { useState } from 'react';
import { MinecraftButton } from './MinecraftButton';
import { useChessGame } from '../../lib/stores/useChessGame';
import { useTheme } from '../../lib/stores/useTheme';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { BIOME_CONFIGS } from '../../lib/minecraft/BiomeEnvironments';

interface BiomeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BiomeSelector({ isOpen, onClose }: BiomeSelectorProps) {
  const { currentBiome, setCurrentBiome } = useChessGame();
  const { currentTheme } = useTheme();
  const isMobile = useIsMobile();
  const [selectedBiome, setSelectedBiome] = useState(currentBiome);

  if (!isOpen) return null;

  const handleBiomeSelect = (biome: string) => {
    setSelectedBiome(biome);
    setCurrentBiome(biome);
  };

  const handleConfirm = () => {
    onClose();
  };

  const biomeEntries = Object.entries(BIOME_CONFIGS);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`bg-slate-900 rounded-lg border-4 border-amber-600 ${
        isMobile ? 'w-full h-full' : 'w-full max-w-4xl max-h-[90vh]'
      } overflow-hidden`}>
        
        {/* Header */}
        <div className="p-4 border-b-2 border-amber-600 flex items-center justify-between">
          <h2 className="font-minecraft text-2xl text-amber-400">Choose Your Biome</h2>
          <button
            onClick={onClose}
            className="minecraft-button minecraft-button-danger"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 150px)' }}>
          <div className={`${isMobile ? 'mobile-biome-grid' : 'grid grid-cols-2 md:grid-cols-4 gap-4'}`}>
            {biomeEntries.map(([key, config]) => (
              <div
                key={key}
                className={`biome-card p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedBiome === key 
                    ? 'border-amber-400 bg-amber-900 bg-opacity-30' 
                    : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                }`}
                onClick={() => handleBiomeSelect(key)}
                style={{
                  background: selectedBiome === key 
                    ? `linear-gradient(135deg, ${config.colors.primary}20, ${config.colors.secondary}20)`
                    : undefined
                }}
              >
                <div className="biome-preview mb-3">
                  <div 
                    className="w-full h-24 rounded border-2 border-slate-600"
                    style={{
                      background: config.texturePatterns.background
                    }}
                  />
                </div>
                
                <div className="biome-info">
                  <h3 className="font-minecraft text-lg text-amber-400 mb-1">
                    {config.displayName}
                  </h3>
                  <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                    {config.description}
                  </p>
                  
                  <div className="biome-features text-xs text-slate-400">
                    <div className="flex items-center gap-2 mb-1">
                      <span>🎨</span>
                      <span>Particles: {config.particles.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🎵</span>
                      <span>Unique audio</span>
                    </div>
                  </div>
                </div>
                
                {selectedBiome === key && (
                  <div className="biome-selected mt-3 text-center">
                    <span className="text-amber-400 font-minecraft text-sm">✓ Selected</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-amber-600 flex justify-between items-center">
          <div className="text-sm text-slate-400">
            Current: <span className="text-amber-400 font-minecraft">
              {BIOME_CONFIGS[selectedBiome]?.displayName || selectedBiome}
            </span>
          </div>
          <div className="flex gap-2">
            <MinecraftButton
              onClick={onClose}
              variant="secondary"
            >
              Cancel
            </MinecraftButton>
            <MinecraftButton
              onClick={handleConfirm}
              variant="primary"
            >
              Confirm Selection
            </MinecraftButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick biome selector for in-game use
export function QuickBiomeSelector() {
  const { currentBiome, setCurrentBiome } = useChessGame();
  const [isExpanded, setIsExpanded] = useState(false);

  const currentConfig = BIOME_CONFIGS[currentBiome];
  const biomeEntries = Object.entries(BIOME_CONFIGS);

  return (
    <div className="quick-biome-selector fixed top-4 left-4 z-40">
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="minecraft-button minecraft-button-small flex items-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${currentConfig.colors.primary}40, ${currentConfig.colors.secondary}40)`
          }}
        >
          <div 
            className="w-4 h-4 rounded border"
            style={{ background: currentConfig.colors.accent }}
          />
          <span className="font-minecraft text-xs">{currentConfig.displayName}</span>
          <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {isExpanded && (
          <div className="absolute top-full left-0 mt-1 bg-slate-900 rounded border-2 border-amber-600 min-w-48 max-h-64 overflow-y-auto">
            {biomeEntries.map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setCurrentBiome(key);
                  setIsExpanded(false);
                }}
                className={`w-full p-2 text-left hover:bg-slate-800 flex items-center gap-2 border-b border-slate-700 last:border-b-0 ${
                  currentBiome === key ? 'bg-amber-900 bg-opacity-30' : ''
                }`}
              >
                <div 
                  className="w-3 h-3 rounded border"
                  style={{ background: config.colors.accent }}
                />
                <span className="font-minecraft text-xs text-slate-200">
                  {config.displayName}
                </span>
                {currentBiome === key && (
                  <span className="text-amber-400 ml-auto">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}