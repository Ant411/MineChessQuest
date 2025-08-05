import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Plane } from '@react-three/drei';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface BiomeEnvironmentProps {
  biome: 'forest' | 'desert' | 'ocean' | 'nether';
}

export function BiomeEnvironment({ biome }: BiomeEnvironmentProps) {
  const grassTexture = useTexture('/textures/grass.png');
  const sandTexture = useTexture('/textures/sand.jpg');
  const woodTexture = useTexture('/textures/wood.jpg');

  // Pre-calculate random positions for decorative elements
  const decorativeElements = useMemo(() => {
    const elements = [];
    const count = biome === 'nether' ? 8 : 12;
    
    for (let i = 0; i < count; i++) {
      elements.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 40,
          0,
          (Math.random() - 0.5) * 40
        ] as [number, number, number],
        scale: 0.5 + Math.random() * 1.5,
        rotation: Math.random() * Math.PI * 2
      });
    }
    return elements;
  }, [biome]);

  const getEnvironmentElements = () => {
    switch (biome) {
      case 'forest':
        return (
          <>
            {/* Trees */}
            {decorativeElements.map((element) => (
              <group key={element.id} position={element.position}>
                {/* Tree trunk */}
                <Cylinder 
                  args={[0.3 * element.scale, 0.4 * element.scale, 3 * element.scale]} 
                  position={[0, 1.5 * element.scale, 0]}
                >
                  <meshStandardMaterial map={woodTexture} />
                </Cylinder>
                {/* Tree leaves */}
                <Sphere 
                  args={[1.5 * element.scale]} 
                  position={[0, 3.5 * element.scale, 0]}
                >
                  <meshStandardMaterial color="#228B22" />
                </Sphere>
              </group>
            ))}
            
            {/* Ground */}
            <Plane
              args={[100, 100]}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.5, 0]}
              receiveShadow
            >
              <meshStandardMaterial map={grassTexture} />
            </Plane>
          </>
        );

      case 'desert':
        return (
          <>
            {/* Cacti */}
            {decorativeElements.map((element) => (
              <group key={element.id} position={element.position}>
                <Cylinder 
                  args={[0.3 * element.scale, 0.3 * element.scale, 2 * element.scale]} 
                  position={[0, 1 * element.scale, 0]}
                >
                  <meshStandardMaterial color="#2F4F2F" />
                </Cylinder>
                {/* Cactus arms */}
                <Cylinder 
                  args={[0.2 * element.scale, 0.2 * element.scale, 1 * element.scale]} 
                  position={[0.5 * element.scale, 1.5 * element.scale, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                >
                  <meshStandardMaterial color="#2F4F2F" />
                </Cylinder>
              </group>
            ))}
            
            {/* Sand dunes */}
            {decorativeElements.slice(0, 6).map((element) => (
              <Sphere 
                key={`dune-${element.id}`}
                args={[2 * element.scale, 8, 6]} 
                position={[element.position[0], -1, element.position[2]]}
              >
                <meshStandardMaterial map={sandTexture} />
              </Sphere>
            ))}
            
            {/* Ground */}
            <Plane
              args={[100, 100]}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.5, 0]}
              receiveShadow
            >
              <meshStandardMaterial map={sandTexture} />
            </Plane>
          </>
        );

      case 'ocean':
        return (
          <>
            {/* Coral */}
            {decorativeElements.map((element) => (
              <group key={element.id} position={element.position}>
                <Sphere 
                  args={[0.5 * element.scale, 8, 6]} 
                  position={[0, 0.5 * element.scale, 0]}
                >
                  <meshStandardMaterial color="#FF7F50" />
                </Sphere>
                <Cylinder 
                  args={[0.1 * element.scale, 0.2 * element.scale, 1 * element.scale]} 
                  position={[0, 0.5 * element.scale, 0]}
                >
                  <meshStandardMaterial color="#20B2AA" />
                </Cylinder>
              </group>
            ))}
            
            {/* Water effect */}
            <Plane
              args={[100, 100]}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.5, 0]}
              receiveShadow
            >
              <meshStandardMaterial 
                color="#006994" 
                transparent 
                opacity={0.8}
                roughness={0.1}
                metalness={0.1}
              />
            </Plane>
          </>
        );

      case 'nether':
        return (
          <>
            {/* Nether structures */}
            {decorativeElements.map((element) => (
              <group key={element.id} position={element.position}>
                <Box 
                  args={[1 * element.scale, 3 * element.scale, 1 * element.scale]} 
                  position={[0, 1.5 * element.scale, 0]}
                >
                  <meshStandardMaterial color="#8B0000" emissive="#330000" />
                </Box>
                {/* Glowing top */}
                <Box 
                  args={[1.2 * element.scale, 0.2 * element.scale, 1.2 * element.scale]} 
                  position={[0, 3.1 * element.scale, 0]}
                >
                  <meshStandardMaterial color="#FF4500" emissive="#FF2200" />
                </Box>
              </group>
            ))}
            
            {/* Lava ground */}
            <Plane
              args={[100, 100]}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.5, 0]}
              receiveShadow
            >
              <meshStandardMaterial 
                color="#8B0000" 
                emissive="#330000"
                roughness={0.8}
              />
            </Plane>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <group>
      {getEnvironmentElements()}
      
      {/* Particles effect for atmosphere */}
      {biome === 'nether' && (
        <NetherParticles />
      )}
      
      {biome === 'ocean' && (
        <OceanBubbles />
      )}
    </group>
  );
}

// Nether particles component
function NetherParticles() {
  const particleCount = 50;
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 50,
          Math.random() * 20,
          (Math.random() - 0.5) * 50
        ] as [number, number, number],
        speed: 0.01 + Math.random() * 0.02
      });
    }
    return temp;
  }, []);

  return (
    <>
      {particles.map((particle, index) => (
        <Sphere key={index} args={[0.05]} position={particle.position}>
          <meshBasicMaterial color="#FF4500" transparent opacity={0.6} />
        </Sphere>
      ))}
    </>
  );
}

// Ocean bubbles component
function OceanBubbles() {
  const bubbleCount = 30;
  const bubbles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < bubbleCount; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 30,
          Math.random() * 10,
          (Math.random() - 0.5) * 30
        ] as [number, number, number]
      });
    }
    return temp;
  }, []);

  return (
    <>
      {bubbles.map((bubble, index) => (
        <Sphere key={index} args={[0.1]} position={bubble.position}>
          <meshBasicMaterial color="#87CEEB" transparent opacity={0.4} />
        </Sphere>
      ))}
    </>
  );
}
