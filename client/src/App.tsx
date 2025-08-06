import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/inter";
import "./styles/minecraft-theme.css";

import { MainMenu } from "./components/ui/MainMenu";
import { GameScene } from "./components/game/GameScene";
import { HelpSection } from "./components/ui/HelpSection";
import { PlayerSetup } from "./components/ui/PlayerSetup";
import { ScoreBoard } from "./components/ui/ScoreBoard";
import { ThemeSelector } from "./components/ui/ThemeSelector";
import { MultiplayerMenu } from "./components/multiplayer/MultiplayerMenu";
import { TournamentBracket } from "./components/multiplayer/TournamentBracket";
import { MobileGameUI } from "./components/ui/MobileGameUI";
import { TouchChessControls } from "./components/ui/TouchChessControls";
import { useIsMobile } from "./hooks/use-is-mobile";

import { useChessGame } from "./lib/stores/useChessGame";
import { useTheme } from "./lib/stores/useTheme";
import { useAudio } from "./lib/stores/useAudio";
import { useMultiplayer } from "./lib/stores/useMultiplayer";
import { SoundManager } from "./lib/minecraft/SoundManager";

const queryClient = new QueryClient();

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "select", keys: ["Space", "Enter"] },
  { name: "escape", keys: ["Escape"] },
  { name: "help", keys: ["KeyH"] },
  { name: "theme", keys: ["KeyT"] },
];

function App() {
  const { gameState, gameMode } = useChessGame();
  const { currentTheme } = useTheme();
  const { showMultiplayerMenu, showTournamentBracket, currentTournament } = useMultiplayer();
  const isMobile = useIsMobile();
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div 
        className={`minecraft-container ${currentTheme} ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'relative', 
          overflow: 'hidden',
          backgroundColor: currentTheme === 'dark' ? '#1a1a2e' : '#87ceeb'
        }}
      >
        {showCanvas && (
          <KeyboardControls map={controls}>
            {gameState === 'menu' && <MainMenu />}
            
            {gameState === 'player_setup' && <PlayerSetup />}
            
            {gameState === 'help' && <HelpSection />}
            
            {gameState === 'scoreboard' && <ScoreBoard />}
            
            {(gameState === 'playing' || gameState === 'game_over') && (
              <>
                {isMobile ? (
                  <MobileGameUI />
                ) : (
                  <>
                    <Canvas
                      shadows
                      camera={{
                        position: [0, 8, 12],
                        fov: 45,
                        near: 0.1,
                        far: 1000
                      }}
                      gl={{
                        antialias: true,
                        powerPreference: "high-performance"
                      }}
                    >
                      <color attach="background" args={[currentTheme === 'dark' ? "#0f0f23" : "#87ceeb"]} />
                      
                      <Suspense fallback={null}>
                        <GameScene />
                      </Suspense>
                    </Canvas>
                    
                    <ThemeSelector />
                  </>
                )}
              </>
            )}
            
            <SoundManager />
            
            {/* Multiplayer Components */}
            {showMultiplayerMenu && (
              <MultiplayerMenu 
                onClose={() => useMultiplayer.getState().setShowMultiplayerMenu(false)}
              />
            )}
            
            {showTournamentBracket && currentTournament && (
              <TournamentBracket 
                tournament={currentTournament}
                onClose={() => useMultiplayer.getState().setShowTournamentBracket(false)}
              />
            )}
          </KeyboardControls>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
