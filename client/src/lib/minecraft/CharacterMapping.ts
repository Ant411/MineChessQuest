export interface MinecraftCharacter {
  name: string;
  description: string;
  color: string;
  abilities: string[];
  sounds: {
    move: string;
    capture: string;
    special: string;
  };
}

export interface BiomeCharacter {
  forest: MinecraftCharacter;
  desert: MinecraftCharacter;
  ocean: MinecraftCharacter;
  nether: MinecraftCharacter;
}

export interface PieceMapping {
  name: string;
  description: string;
  biomes: BiomeCharacter;
  specialMoves: string[];
}

export class CharacterMapping {
  static pieces: Record<string, PieceMapping> = {
    pawn: {
      name: 'Village Defender',
      description: 'Common villagers and creatures defending their territory',
      specialMoves: [
        'Zombie Horde: Can move multiple pawns in formation',
        'Village Rally: Gain strength when near other pawns'
      ],
      biomes: {
        forest: {
          name: 'Villager',
          description: 'Peaceful villager tending crops',
          color: '#8B4513',
          abilities: ['Trading', 'Farming', 'Group Defense'],
          sounds: { move: 'villager_ambient', capture: 'villager_hurt', special: 'villager_yes' }
        },
        desert: {
          name: 'Husk',
          description: 'Desert zombie adapted to harsh conditions',
          color: '#DEB887',
          abilities: ['Sun Immunity', 'Hunger Infliction', 'Desert Camouflage'],
          sounds: { move: 'husk_ambient', capture: 'husk_hurt', special: 'husk_death' }
        },
        ocean: {
          name: 'Drowned',
          description: 'Underwater zombie with trident skills',
          color: '#4682B4',
          abilities: ['Swimming', 'Trident Throw', 'Water Breathing'],
          sounds: { move: 'drowned_ambient', capture: 'drowned_hurt', special: 'drowned_shoot' }
        },
        nether: {
          name: 'Zombie Pigman',
          description: 'Neutral undead pig creature',
          color: '#FF69B4',
          abilities: ['Fire Resistance', 'Pack Mentality', 'Golden Sword'],
          sounds: { move: 'zombified_piglin_ambient', capture: 'zombified_piglin_hurt', special: 'zombified_piglin_angry' }
        }
      }
    },

    rook: {
      name: 'Fortress Guardian',
      description: 'Powerful defensive structures and their guardians',
      specialMoves: [
        'Castle Wall: Create temporary barriers',
        'Siege Engine: Enhanced attack range',
        'Fortification: Boost defense of nearby pieces'
      ],
      biomes: {
        forest: {
          name: 'Iron Golem',
          description: 'Village protector made of iron blocks',
          color: '#C0C0C0',
          abilities: ['Village Defense', 'Knockback Attack', 'Self Repair'],
          sounds: { move: 'iron_golem_step', capture: 'iron_golem_attack', special: 'iron_golem_repair' }
        },
        desert: {
          name: 'Guardian',
          description: 'Ancient temple guardian with laser beam',
          color: '#D2691E',
          abilities: ['Laser Beam', 'Thorn Defense', 'Water Domain'],
          sounds: { move: 'guardian_ambient', capture: 'guardian_attack', special: 'guardian_beam' }
        },
        ocean: {
          name: 'Elder Guardian',
          description: 'Massive ocean temple boss',
          color: '#4169E1',
          abilities: ['Mining Fatigue', 'Thorn Aura', 'Teleportation'],
          sounds: { move: 'elder_guardian_ambient', capture: 'elder_guardian_curse', special: 'elder_guardian_death' }
        },
        nether: {
          name: 'Wither Skeleton',
          description: 'Tall skeletal warrior with stone sword',
          color: '#2F2F2F',
          abilities: ['Wither Effect', 'Fire Immunity', 'Tall Reach'],
          sounds: { move: 'wither_skeleton_ambient', capture: 'wither_skeleton_hurt', special: 'wither_skeleton_death' }
        }
      }
    },

    knight: {
      name: 'Swift Scout',
      description: 'Fast-moving creatures with unique movement patterns',
      specialMoves: [
        'Teleport Jump: Can jump to any empty square once per game',
        'Scout Rush: Move twice in one turn',
        'Surprise Attack: Attack from unexpected angles'
      ],
      biomes: {
        forest: {
          name: 'Horse',
          description: 'Noble steed capable of jumping obstacles',
          color: '#8B4513',
          abilities: ['High Jump', 'Speed Boost', 'Rider Carrying'],
          sounds: { move: 'horse_gallop', capture: 'horse_angry', special: 'horse_jump' }
        },
        desert: {
          name: 'Spider',
          description: 'Eight-legged climber with web abilities',
          color: '#8B0000',
          abilities: ['Wall Climbing', 'Web Trap', 'Night Vision'],
          sounds: { move: 'spider_ambient', capture: 'spider_hurt', special: 'spider_death' }
        },
        ocean: {
          name: 'Dolphin',
          description: 'Intelligent marine mammal',
          color: '#87CEEB',
          abilities: ['Echolocation', 'Speed Swimming', 'Treasure Finding'],
          sounds: { move: 'dolphin_ambient', capture: 'dolphin_hurt', special: 'dolphin_play' }
        },
        nether: {
          name: 'Strider',
          description: 'Lava-walking creature with long legs',
          color: '#DC143C',
          abilities: ['Lava Walking', 'Fire Immunity', 'Temperature Resistance'],
          sounds: { move: 'strider_step_lava', capture: 'strider_hurt', special: 'strider_retreat' }
        }
      }
    },

    bishop: {
      name: 'Mystic Caster',
      description: 'Magic users and potion masters with diagonal powers',
      specialMoves: [
        'Potion Brew: Heal friendly pieces or poison enemies',
        'Magic Barrier: Block enemy special abilities',
        'Enchantment: Enhance other pieces temporarily'
      ],
      biomes: {
        forest: {
          name: 'Witch',
          description: 'Potion-brewing spellcaster in hut',
          color: '#4B0082',
          abilities: ['Potion Throwing', 'Healing', 'Poison Immunity'],
          sounds: { move: 'witch_ambient', capture: 'witch_hurt', special: 'witch_throw' }
        },
        desert: {
          name: 'Evoker',
          description: 'Illager spellcaster summoning vexes',
          color: '#696969',
          abilities: ['Vex Summoning', 'Fang Attack', 'Magic Resistance'],
          sounds: { move: 'evoker_ambient', capture: 'evoker_hurt', special: 'evoker_cast_spell' }
        },
        ocean: {
          name: 'Squid',
          description: 'Tentacled sea creature with ink defense',
          color: '#000080',
          abilities: ['Ink Cloud', 'Water Jet', 'Camouflage'],
          sounds: { move: 'squid_ambient', capture: 'squid_hurt', special: 'squid_squirt' }
        },
        nether: {
          name: 'Blaze',
          description: 'Floating fire spirit shooting fireballs',
          color: '#FF8C00',
          abilities: ['Fireball', 'Flight', 'Fire Shield'],
          sounds: { move: 'blaze_ambient', capture: 'blaze_hurt', special: 'blaze_shoot' }
        }
      }
    },

    queen: {
      name: 'Realm Ruler',
      description: 'The most powerful beings commanding vast territories',
      specialMoves: [
        'Royal Command: Control enemy piece for one move',
        'Domain Control: Enhanced abilities in owned territory',
        'Elite Guard: Summon protective pieces'
      ],
      biomes: {
        forest: {
          name: 'Ender Dragon',
          description: 'The ultimate boss dragon of The End',
          color: '#2F2F2F',
          abilities: ['Dragon Breath', 'Flight', 'Block Destruction'],
          sounds: { move: 'ender_dragon_ambient', capture: 'ender_dragon_hurt', special: 'ender_dragon_shoot' }
        },
        desert: {
          name: 'Warden',
          description: 'Blind but powerful deep dark guardian',
          color: '#0F0F23',
          abilities: ['Sonic Boom', 'Vibration Sensing', 'Darkness Effect'],
          sounds: { move: 'warden_step', capture: 'warden_hurt', special: 'warden_sonic_boom' }
        },
        ocean: {
          name: 'Ocean Monument Boss',
          description: 'Mythical ruler of ocean depths',
          color: '#20B2AA',
          abilities: ['Tidal Wave', 'Water Control', 'Pressure Crush'],
          sounds: { move: 'guardian_ambient_land', capture: 'elder_guardian_hurt', special: 'elder_guardian_curse' }
        },
        nether: {
          name: 'Wither',
          description: 'Three-headed undead boss of destruction',
          color: '#2F2F2F',
          abilities: ['Wither Skulls', 'Explosion Immunity', 'Block Breaking'],
          sounds: { move: 'wither_ambient', capture: 'wither_hurt', special: 'wither_shoot' }
        }
      }
    },

    king: {
      name: 'Village Leader',
      description: 'The heart of each faction, must be protected at all costs',
      specialMoves: [
        'Royal Decree: Force temporary alliance (3-player mode)',
        'Inspiring Presence: Boost all nearby pieces',
        'Last Stand: Enhanced defense when threatened'
      ],
      biomes: {
        forest: {
          name: 'Village Chief',
          description: 'Wise leader of the forest village',
          color: '#228B22',
          abilities: ['Trade Negotiation', 'Village Rally', 'Wisdom Blessing'],
          sounds: { move: 'villager_ambient', capture: 'villager_hurt', special: 'villager_celebrate' }
        },
        desert: {
          name: 'Pharaoh Mummy',
          description: 'Ancient desert ruler wrapped in bandages',
          color: '#F4A460',
          abilities: ['Curse Power', 'Sand Control', 'Ancient Wisdom'],
          sounds: { move: 'husk_ambient', capture: 'husk_converted_to_zombie', special: 'zombie_ambient' }
        },
        ocean: {
          name: 'Poseidon Trident',
          description: 'Legendary trident of sea power',
          color: '#4682B4',
          abilities: ['Storm Calling', 'Tide Control', 'Drowning Immunity'],
          sounds: { move: 'trident_throw', capture: 'trident_hit', special: 'trident_thunder' }
        },
        nether: {
          name: 'Nether Lord',
          description: 'Demonic ruler of the underworld',
          color: '#8B0000',
          abilities: ['Hellfire', 'Soul Command', 'Demon Summoning'],
          sounds: { move: 'ghast_ambient', capture: 'ghast_hurt', special: 'ghast_shoot' }
        }
      }
    }
  };

  static getCharacter(
    pieceType: string, 
    pieceColor: string, 
    biome: 'forest' | 'desert' | 'ocean' | 'nether'
  ): MinecraftCharacter {
    const piece = this.pieces[pieceType];
    if (!piece) {
      return this.getDefaultCharacter(pieceColor);
    }

    const character = piece.biomes[biome];
    if (!character) {
      return this.getDefaultCharacter(pieceColor);
    }

    return {
      ...character,
      color: this.adjustColorForPlayer(character.color, pieceColor)
    };
  }

  private static adjustColorForPlayer(baseColor: string, playerColor: string): string {
    const colorAdjustments = {
      'white': '#FFFFFF',
      'black': '#000000',
      'red': '#FF0000',
      'blue': '#0000FF'
    };

    // Blend base color with player color for team identification
    return colorAdjustments[playerColor as keyof typeof colorAdjustments] || baseColor;
  }

  private static getDefaultCharacter(pieceColor: string): MinecraftCharacter {
    return {
      name: 'Steve',
      description: 'Default Minecraft character',
      color: pieceColor === 'white' ? '#FFFFFF' : 
             pieceColor === 'black' ? '#000000' :
             pieceColor === 'red' ? '#FF0000' : '#0000FF',
      abilities: ['Basic Movement', 'Block Placing', 'Tool Usage'],
      sounds: { move: 'step_stone', capture: 'hurt', special: 'break_block' }
    };
  }

  static getAllCharacters(): Record<string, PieceMapping> {
    return this.pieces;
  }

  static getCharactersByBiome(biome: 'forest' | 'desert' | 'ocean' | 'nether'): Record<string, MinecraftCharacter> {
    const characters: Record<string, MinecraftCharacter> = {};
    
    Object.entries(this.pieces).forEach(([pieceType, piece]) => {
      characters[pieceType] = piece.biomes[biome];
    });
    
    return characters;
  }

  static getSpecialAbilities(pieceType: string): string[] {
    const piece = this.pieces[pieceType];
    return piece ? piece.specialMoves : [];
  }

  static getCharacterDescription(
    pieceType: string,
    biome: 'forest' | 'desert' | 'ocean' | 'nether'
  ): string {
    const piece = this.pieces[pieceType];
    if (!piece) return 'Unknown character';
    
    const character = piece.biomes[biome];
    return character ? `${character.name}: ${character.description}` : 'Unknown character variant';
  }

  // Battle matchups - determine animation style based on character types
  static getBattleStyle(
    attacker: { type: string; biome: string },
    defender: { type: string; biome: string }
  ): string {
    const attackerChar = this.pieces[attacker.type]?.biomes[attacker.biome as keyof BiomeCharacter];
    const defenderChar = this.pieces[defender.type]?.biomes[defender.biome as keyof BiomeCharacter];
    
    if (!attackerChar || !defenderChar) return 'basic_battle';
    
    // Special battle animations based on character matchups
    if (attackerChar.name.includes('Dragon') && defenderChar.name.includes('Wither')) {
      return 'epic_boss_battle';
    } else if (attackerChar.name.includes('Witch') && defenderChar.name.includes('Villager')) {
      return 'magic_vs_mundane';
    } else if (attackerChar.name.includes('Golem') && defenderChar.name.includes('Zombie')) {
      return 'protector_vs_undead';
    } else if (attacker.biome === defender.biome) {
      return 'biome_skirmish';
    } else {
      return 'cross_biome_battle';
    }
  }

  // Get finishing move description for captures
  static getFinishingMove(
    attackerType: string,
    biome: 'forest' | 'desert' | 'ocean' | 'nether'
  ): string {
    const finishingMoves = {
      pawn: {
        forest: 'The villager rallies the community to overwhelm the enemy!',
        desert: 'The husk calls forth a sandstorm to bury its foe!',
        ocean: 'The drowned summons a tidal wave to sweep away the enemy!',
        nether: 'The zombie pigman ignites the ground with nether fire!'
      },
      rook: {
        forest: 'The iron golem delivers a devastating punch that sends shockwaves!',
        desert: 'The guardian fires a concentrated laser beam!',
        ocean: 'The elder guardian creates a whirlpool of destruction!',
        nether: 'The wither skeleton swings its stone sword with bone-crushing force!'
      },
      knight: {
        forest: 'The horse leaps high and delivers a powerful hoofstrike!',
        desert: 'The spider wraps its prey in sticky webbing!',
        ocean: 'The dolphin creates a water spout to lift and slam the enemy!',
        nether: 'The strider opens a lava fissure beneath its opponent!'
      },
      bishop: {
        forest: 'The witch brews a deadly potion and hurls it with precision!',
        desert: 'The evoker summons vexes to swarm the enemy!',
        ocean: 'The squid releases a massive ink cloud and strikes from within!',
        nether: 'The blaze unleashes a barrage of fireballs!'
      },
      queen: {
        forest: 'The ender dragon breathes purple fire and destroys everything!',
        desert: 'The warden releases a sonic boom that shatters reality!',
        ocean: 'The ocean boss creates a massive tsunami!',
        nether: 'The wither fires three explosive skulls simultaneously!'
      },
      king: {
        forest: 'The village chief rallies all allies for a final desperate charge!',
        desert: 'The pharaoh mummy unleashes an ancient curse!',
        ocean: 'The trident calls down lightning from the storm clouds!',
        nether: 'The nether lord opens a portal to summon demonic reinforcements!'
      }
    };

    const moves = finishingMoves[attackerType as keyof typeof finishingMoves];
    return moves ? moves[biome] : 'The piece delivers a mighty finishing blow!';
  }
}
