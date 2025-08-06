import React, { useState } from 'react';
import { MinecraftButton } from './MinecraftButton';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { useTheme } from '../../lib/stores/useTheme';

interface CharacterShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

// Character data with thumbnails and descriptions
const CHARACTERS = {
  forest: {
    name: 'Forest Realm',
    background: '#2d5016',
    pieces: {
      pawn: { 
        name: 'Village Defender', 
        thumbnail: '🛡️', 
        description: 'Brave villagers protecting their territory',
        abilities: ['Zombie Horde: Can move multiple pawns in formation', 'Village Rally: Gain strength when near other pawns'],
        variants: { white: 'Villager', black: 'Zombie', red: 'Witch', blue: 'Illusioner' }
      },
      rook: { 
        name: 'Fortress Guardian', 
        thumbnail: '🏰', 
        description: 'Powerful defensive structures and their guardians',
        abilities: ['Castle Wall: Create temporary barriers', 'Siege Engine: Enhanced attack range', 'Fortification: Boost defense of nearby pieces'],
        variants: { white: 'Iron Golem', black: 'Ravager', red: 'Evoker', blue: 'Vindicator' }
      },
      knight: { 
        name: 'Swift Scout', 
        thumbnail: '🐴', 
        description: 'Fast-moving creatures with unique movement patterns',
        abilities: ['Teleport Jump: Can leap to any empty square once per game', 'Scout Rush: Attack from unexpected angles', 'Surprise Attack: Attack from unexpected angles'],
        variants: { white: 'Horse', black: 'Skeleton Horse', red: 'Spider Jockey', blue: 'Strider' }
      },
      bishop: { 
        name: 'Mystic Caster', 
        thumbnail: '🧙', 
        description: 'Magic users and potion masters with diagonal powers',
        abilities: ['Potion Brew: Heal or poison pieces at distance', 'Magic Barrier: Block enemy pieces temporarily', 'Enchantment: Enhance other pieces temporarily'],
        variants: { white: 'Cleric', black: 'Necromancer', red: 'Witch', blue: 'Evoker' }
      },
      queen: { 
        name: 'Apex Predator', 
        thumbnail: '🐉', 
        description: 'Ultimate creatures with devastating power',
        abilities: ['Dragon Breath: Attack multiple pieces in a line', 'Flight: Ignore piece blocking', 'Territorial Dominance: Control large areas'],
        variants: { white: 'Ender Dragon', black: 'Wither', red: 'Elder Guardian', blue: 'Warden' }
      },
      king: { 
        name: 'Realm Master', 
        thumbnail: '👑', 
        description: 'Leaders of their respective realms',
        abilities: ['Royal Command: Move other pieces once per turn', 'Last Stand: Increased defense when in danger', 'Legacy: Grant bonuses to all pieces'],
        variants: { white: 'Player (Steve)', black: 'Herobrine', red: 'Notch', blue: 'Alex' }
      }
    }
  },
  desert: {
    name: 'Desert Kingdom',
    background: '#d4af37',
    pieces: {
      pawn: { 
        name: 'Desert Wanderer', 
        thumbnail: '🏜️', 
        description: 'Nomads and desert dwellers adapted to harsh conditions',
        abilities: ['Sand Storm: Obscure vision temporarily', 'Desert Survival: Regenerate health slowly', 'Mirage: Create false images'],
        variants: { white: 'Desert Villager', black: 'Husk', red: 'Stray', blue: 'Pillager' }
      },
      rook: { 
        name: 'Pyramid Guardian', 
        thumbnail: '🏺', 
        description: 'Ancient guardians of lost treasures',
        abilities: ['Curse: Weaken nearby enemies', 'Sandstorm: Block multiple squares', 'Ancient Power: Grow stronger over time'],
        variants: { white: 'Guardian', black: 'Elder Guardian', red: 'Golem', blue: 'Ravager' }
      },
      knight: { 
        name: 'Desert Raider', 
        thumbnail: '🐪', 
        description: 'Fast desert creatures with hit-and-run tactics',
        abilities: ['Sand Jump: Move through other pieces', 'Heat Mirage: Confuse enemy targeting', 'Desert Speed: Extra movement in open areas'],
        variants: { white: 'Camel', black: 'Spider', red: 'Cave Spider', blue: 'Silverfish' }
      },
      bishop: { 
        name: 'Sand Mage', 
        thumbnail: '🔮', 
        description: 'Masters of sand and sun magic',
        abilities: ['Sun Flare: Blind enemies temporarily', 'Sand Control: Reshape battlefield', 'Heat Wave: Damage over time'],
        variants: { white: 'Desert Priest', black: 'Evoker', red: 'Witch', blue: 'Illusioner' }
      },
      queen: { 
        name: 'Desert Empress', 
        thumbnail: '🌅', 
        description: 'Rulers of the endless dunes',
        abilities: ['Eternal Sun: Boost all friendly pieces', 'Sandstorm Mastery: Control battlefield weather', 'Divine Authority: Command absolute loyalty'],
        variants: { white: 'Warden', black: 'Wither', red: 'Ender Dragon', blue: 'Elder Guardian' }
      },
      king: { 
        name: 'Pharaoh', 
        thumbnail: '👨‍💼', 
        description: 'Ancient rulers with divine power',
        abilities: ['Pharaoh\'s Curse: Weaken enemies permanently', 'Divine Protection: Immunity to certain attacks', 'Eternal Rule: Continue fighting even when defeated'],
        variants: { white: 'Desert Steve', black: 'Desert Herobrine', red: 'Pharaoh', blue: 'Desert Alex' }
      }
    }
  },
  ocean: {
    name: 'Ocean Depths',
    background: '#006994',
    pieces: {
      pawn: { 
        name: 'Sea Dweller', 
        thumbnail: '🐠', 
        description: 'Creatures of the deep with aquatic abilities',
        abilities: ['Tidal Wave: Push enemies back', 'Deep Dive: Hide underwater temporarily', 'School Formation: Move in groups'],
        variants: { white: 'Drowned', black: 'Guardian', red: 'Tropical Fish', blue: 'Squid' }
      },
      rook: { 
        name: 'Ocean Fortress', 
        thumbnail: '🏛️', 
        description: 'Massive underwater structures and their guardians',
        abilities: ['Tidal Barrier: Block with water walls', 'Pressure Crush: Devastating close-range attacks', 'Coral Growth: Create defensive structures'],
        variants: { white: 'Elder Guardian', black: 'Guardian', red: 'Conduit', blue: 'Prismarine Golem' }
      },
      knight: { 
        name: 'Sea Rider', 
        thumbnail: '🐬', 
        description: 'Fast aquatic creatures with playful movement',
        abilities: ['Dolphin Leap: Jump over other pieces', 'Sonar: Detect hidden enemies', 'Pack Hunt: Coordinate with other knights'],
        variants: { white: 'Dolphin', black: 'Shark', red: 'Turtle', blue: 'Axolotl' }
      },
      bishop: { 
        name: 'Sea Witch', 
        thumbnail: '🧜‍♀️', 
        description: 'Masters of water magic and ocean currents',
        abilities: ['Whirlpool: Trap enemies in place', 'Healing Waters: Restore friendly pieces', 'Ocean\'s Blessing: Grant water-walking'],
        variants: { white: 'Sea Witch', black: 'Drowned Mage', red: 'Coral Mage', blue: 'Ocean Priest' }
      },
      queen: { 
        name: 'Leviathan', 
        thumbnail: '🐋', 
        description: 'Legendary sea monsters of immense power',
        abilities: ['Tsunami: Devastating area attack', 'Deep Sea Pressure: Crush multiple enemies', 'Ocean Dominion: Control all water on board'],
        variants: { white: 'Kraken', black: 'Leviathan', red: 'Sea Serpent', blue: 'Ocean Dragon' }
      },
      king: { 
        name: 'Ocean Lord', 
        thumbnail: '🔱', 
        description: 'Rulers of the seven seas',
        abilities: ['Command the Tides: Alter board layout', 'Deep Sea Realm: Create underwater sanctuaries', 'Poseidon\'s Wrath: Devastating final attack'],
        variants: { white: 'Aqua Steve', black: 'Deep One', red: 'Poseidon', blue: 'Aqua Alex' }
      }
    }
  }
  // Add more biomes as needed...
};

export function CharacterShowcase({ isOpen, onClose }: CharacterShowcaseProps) {
  const isMobile = useIsMobile();
  const { currentTheme } = useTheme();
  const [selectedBiome, setSelectedBiome] = useState<keyof typeof CHARACTERS>('forest');
  const [selectedPiece, setSelectedPiece] = useState<string>('pawn');

  if (!isOpen) return null;

  const currentBiomeData = CHARACTERS[selectedBiome];
  const currentPieceData = currentBiomeData.pieces[selectedPiece as keyof typeof currentBiomeData.pieces];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`bg-slate-900 rounded-lg border-4 border-amber-600 ${
        isMobile ? 'w-full h-full' : 'w-full max-w-6xl max-h-[90vh]'
      } overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className="p-4 border-b-2 border-amber-600 flex items-center justify-between">
          <h2 className="font-minecraft text-2xl text-amber-400">Character Showcase</h2>
          <button
            onClick={onClose}
            className="minecraft-button minecraft-button-danger"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Biome Selection */}
          <div className="w-1/4 border-r-2 border-amber-600 p-4 overflow-y-auto">
            <h3 className="minecraft-section-title mb-4">Biomes</h3>
            {Object.entries(CHARACTERS).map(([biomeKey, biomeData]) => (
              <button
                key={biomeKey}
                onClick={() => setSelectedBiome(biomeKey as keyof typeof CHARACTERS)}
                className={`w-full p-3 mb-2 rounded border-2 text-left transition-all ${
                  selectedBiome === biomeKey 
                    ? 'border-amber-400 bg-amber-900 bg-opacity-30' 
                    : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                }`}
                style={{
                  background: selectedBiome === biomeKey 
                    ? `linear-gradient(135deg, ${biomeData.background}40, ${biomeData.background}20)`
                    : undefined
                }}
              >
                <div className="font-minecraft text-amber-400">{biomeData.name}</div>
              </button>
            ))}
          </div>

          {/* Piece Selection */}
          <div className="w-1/4 border-r-2 border-amber-600 p-4 overflow-y-auto">
            <h3 className="minecraft-section-title mb-4">Pieces</h3>
            {Object.entries(currentBiomeData.pieces).map(([pieceKey, pieceData]) => (
              <button
                key={pieceKey}
                onClick={() => setSelectedPiece(pieceKey)}
                className={`w-full p-3 mb-2 rounded border-2 text-left transition-all ${
                  selectedPiece === pieceKey 
                    ? 'border-amber-400 bg-amber-900 bg-opacity-30' 
                    : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{pieceData.thumbnail}</span>
                  <div>
                    <div className="font-minecraft text-amber-400 text-sm">{pieceData.name}</div>
                    <div className="text-xs text-slate-400 capitalize">{pieceKey}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Character Details */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="character-detail-panel">
              {/* Character Header */}
              <div className="character-header mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="character-thumbnail text-6xl">
                    {currentPieceData.thumbnail}
                  </div>
                  <div>
                    <h3 className="font-minecraft text-2xl text-amber-400 mb-2">
                      {currentPieceData.name}
                    </h3>
                    <p className="text-slate-300 text-lg">
                      {currentPieceData.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Character Variants */}
              <div className="character-variants mb-6">
                <h4 className="minecraft-section-title mb-3">Biome Variants</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(currentPieceData.variants).map(([color, variant]) => (
                    <div key={color} className="variant-card p-3 bg-slate-800 rounded border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-slate-400"
                          style={{ backgroundColor: 
                            color === 'white' ? '#ffffff' :
                            color === 'black' ? '#2c2c2c' :
                            color === 'red' ? '#c62828' :
                            '#1565c0'
                          }}
                        />
                        <span className="font-minecraft text-amber-400 capitalize">{color}</span>
                      </div>
                      <div className="text-sm text-slate-200">{variant}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Abilities */}
              <div className="character-abilities">
                <h4 className="minecraft-section-title mb-3">Special Abilities</h4>
                <div className="space-y-3">
                  {currentPieceData.abilities.map((ability, index) => (
                    <div key={index} className="ability-item p-3 bg-slate-800 rounded border-l-4 border-amber-600">
                      <div className="text-amber-400 font-minecraft font-bold mb-1">
                        {ability.split(':')[0]}
                      </div>
                      <div className="text-slate-300 text-sm">
                        {ability.split(':')[1] || ability}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile scroll indicator */}
        {isMobile && (
          <div className="mobile-scroll-indicator p-2 border-t border-slate-600 text-center">
            <div className="text-slate-400 text-xs">
              ↕️ Scroll to explore all characters and abilities
            </div>
          </div>
        )}
      </div>
    </div>
  );
}