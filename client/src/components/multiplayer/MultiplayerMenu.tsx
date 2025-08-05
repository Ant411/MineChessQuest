import React, { useEffect, useState } from 'react';
import { useMultiplayer, useMultiplayerActions } from '../../lib/stores/useMultiplayer';
import { BIOME_CONFIGS } from '../../lib/minecraft/BiomeEnvironments';
import { useIsMobile } from '../../hooks/use-is-mobile';

interface MultiplayerMenuProps {
  onClose: () => void;
}

export function MultiplayerMenu({ onClose }: MultiplayerMenuProps) {
  const isMobile = useIsMobile();
  const [playerName, setPlayerName] = useState(() => 
    localStorage.getItem('minecraft_chess_player_name') || ''
  );
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [selectedGameMode, setSelectedGameMode] = useState<'2player' | '3player' | '4player'>('2player');
  const [selectedBiome, setSelectedBiome] = useState('forest');
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);

  const {
    connectionStatus,
    connectionType,
    currentPlayer,
    nearbyPlayers,
    availableRooms,
    currentRoom,
    isMatchmaking,
    activeTab,
    showMultiplayerMenu
  } = useMultiplayer();

  const {
    connect,
    disconnect,
    registerPlayer,
    createRoom,
    joinRoom,
    leaveRoom,
    findNearbyPlayers,
    requestMatchmaking,
    setActiveTab
  } = useMultiplayerActions();

  useEffect(() => {
    if (showMultiplayerMenu && connectionStatus === 'disconnected') {
      connect('internet');
    }
  }, [showMultiplayerMenu, connectionStatus, connect]);

  useEffect(() => {
    if (connectionStatus === 'connected' && !currentPlayer && playerName) {
      registerPlayer({
        name: playerName,
        deviceType: isMobile ? 'mobile' : 'desktop'
      });
    }
  }, [connectionStatus, currentPlayer, playerName, registerPlayer, isMobile]);

  const handlePlayerNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    localStorage.setItem('minecraft_chess_player_name', playerName);
    
    if (connectionStatus === 'connected') {
      await registerPlayer({
        name: playerName,
        deviceType: isMobile ? 'mobile' : 'desktop'
      });
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    await createRoom({
      name: roomName,
      gameMode: selectedGameMode,
      biome: selectedBiome,
      isPrivate: isPrivateRoom,
      password: isPrivateRoom ? roomPassword : undefined
    });

    setRoomName('');
    setRoomPassword('');
  };

  const handleJoinRoom = async (roomId: string, password?: string) => {
    await joinRoom(roomId, password);
  };

  const handleQuickMatch = async () => {
    await requestMatchmaking({
      gameMode: selectedGameMode,
      biome: selectedBiome,
      ratingRange: 300
    });
  };

  const renderConnectionStatus = () => {
    const statusColors = {
      disconnected: 'text-red-400',
      connecting: 'text-yellow-400',
      connected: 'text-green-400',
      error: 'text-red-400'
    };

    const statusText = {
      disconnected: 'Disconnected',
      connecting: 'Connecting...',
      connected: 'Connected',
      error: 'Connection Error'
    };

    return (
      <div className="flex items-center gap-2 mb-4 p-3 bg-slate-800 rounded border-2 border-amber-600">
        <div className={`w-3 h-3 rounded-full ${
          connectionStatus === 'connected' ? 'bg-green-400' : 
          connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 
          'bg-red-400'
        }`} />
        <span className={`text-sm font-minecraft ${statusColors[connectionStatus]}`}>
          {statusText[connectionStatus]}
        </span>
        {connectionType !== 'internet' && (
          <span className="text-xs text-slate-400 ml-2">({connectionType})</span>
        )}
      </div>
    );
  };

  const renderPlayerRegistration = () => {
    if (currentPlayer) return null;

    return (
      <div className="minecraft-panel mb-6">
        <h3 className="minecraft-panel-title">Enter Your Name</h3>
        <form onSubmit={handlePlayerNameSubmit} className="space-y-4">
          <div>
            <label className="minecraft-input-label">Player Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="minecraft-input"
              placeholder="Enter your Minecraft name"
              maxLength={16}
              required
            />
          </div>
          <button
            type="submit"
            className="minecraft-button minecraft-button-primary w-full"
            disabled={!playerName.trim() || connectionStatus !== 'connected'}
          >
            Join Multiplayer
          </button>
        </form>
      </div>
    );
  };

  const renderTabs = () => (
    <div className="minecraft-help-tabs mb-4">
      {(['rooms', 'tournaments', 'nearby', 'history'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`minecraft-button minecraft-help-tab ${
            activeTab === tab ? 'minecraft-button-selected' : ''
          }`}
        >
          {tab === 'rooms' ? '🏠 Rooms' :
           tab === 'tournaments' ? '🏆 Tournaments' :
           tab === 'nearby' ? '📡 Nearby' :
           '📊 History'}
        </button>
      ))}
    </div>
  );

  const renderRoomsTab = () => (
    <div className="space-y-6">
      {/* Quick Match */}
      <div className="minecraft-panel">
        <h4 className="minecraft-section-title">Quick Match</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="minecraft-input-label">Game Mode</label>
              <select
                value={selectedGameMode}
                onChange={(e) => setSelectedGameMode(e.target.value as any)}
                className="minecraft-input"
              >
                <option value="2player">2 Player Chess</option>
                <option value="3player">3 Player Chess</option>
                <option value="4player">4 Player Chess</option>
              </select>
            </div>
            <div>
              <label className="minecraft-input-label">Biome</label>
              <select
                value={selectedBiome}
                onChange={(e) => setSelectedBiome(e.target.value)}
                className="minecraft-input"
              >
                {Object.entries(BIOME_CONFIGS).map(([key, config]) => (
                  <option key={key} value={key}>{config.displayName}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleQuickMatch}
            disabled={!currentPlayer || isMatchmaking}
            className="minecraft-button minecraft-button-primary w-full"
          >
            {isMatchmaking ? 'Finding Match...' : '⚡ Quick Match'}
          </button>
        </div>
      </div>

      {/* Create Room */}
      <div className="minecraft-panel">
        <h4 className="minecraft-section-title">Create Room</h4>
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label className="minecraft-input-label">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="minecraft-input"
              placeholder="My Awesome Chess Room"
              maxLength={50}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="minecraft-input-label">Game Mode</label>
              <select
                value={selectedGameMode}
                onChange={(e) => setSelectedGameMode(e.target.value as any)}
                className="minecraft-input"
              >
                <option value="2player">2 Player Chess</option>
                <option value="3player">3 Player Chess</option>
                <option value="4player">4 Player Chess</option>
              </select>
            </div>
            <div>
              <label className="minecraft-input-label">Biome</label>
              <select
                value={selectedBiome}
                onChange={(e) => setSelectedBiome(e.target.value)}
                className="minecraft-input"
              >
                {Object.entries(BIOME_CONFIGS).map(([key, config]) => (
                  <option key={key} value={key}>{config.displayName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="private-room"
              checked={isPrivateRoom}
              onChange={(e) => setIsPrivateRoom(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="private-room" className="minecraft-input-label mb-0">
              Private Room
            </label>
          </div>

          {isPrivateRoom && (
            <div>
              <label className="minecraft-input-label">Password</label>
              <input
                type="password"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                className="minecraft-input"
                placeholder="Room password"
                maxLength={20}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={!currentPlayer || !roomName.trim()}
            className="minecraft-button minecraft-button-primary w-full"
          >
            🏠 Create Room
          </button>
        </form>
      </div>

      {/* Available Rooms */}
      <div className="minecraft-panel">
        <h4 className="minecraft-section-title">Available Rooms ({availableRooms.length})</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableRooms.length === 0 ? (
            <div className="minecraft-no-data">
              <div className="minecraft-no-data-icon">🏠</div>
              <div className="minecraft-no-data-text">
                No rooms available. Create one to get started!
              </div>
            </div>
          ) : (
            availableRooms.map((room) => (
              <div
                key={room.id}
                className="p-4 bg-slate-700 rounded border border-amber-600 hover:border-amber-400 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-minecraft text-amber-400 font-bold">{room.name}</h5>
                    <div className="text-sm text-slate-300">
                      {room.gameMode} • {BIOME_CONFIGS[room.biome]?.displayName || room.biome}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">
                      {room.players.length}/{room.maxPlayers} players
                    </div>
                    <div className={`text-xs ${
                      room.status === 'waiting' ? 'text-green-400' :
                      room.status === 'playing' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {room.status}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {room.players.slice(0, 4).map((player, index) => (
                      <div
                        key={player.id}
                        className="w-8 h-8 bg-slate-600 rounded border-2 border-amber-600 flex items-center justify-center text-xs font-minecraft"
                        title={player.name}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {room.players.length > 4 && (
                      <div className="w-8 h-8 bg-slate-600 rounded border-2 border-amber-600 flex items-center justify-center text-xs">
                        +{room.players.length - 4}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {room.isPrivate && <span className="text-xs text-amber-400">🔒</span>}
                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={!currentPlayer || room.status !== 'waiting' || room.players.length >= room.maxPlayers}
                      className="minecraft-button minecraft-button-small minecraft-button-primary"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderNearbyTab = () => (
    <div className="minecraft-panel">
      <h4 className="minecraft-section-title">Nearby Players</h4>
      <div className="space-y-4">
        <button
          onClick={findNearbyPlayers}
          disabled={!currentPlayer}
          className="minecraft-button minecraft-button-primary w-full"
        >
          🔍 Scan for Nearby Players
        </button>
        
        <div className="space-y-2">
          {nearbyPlayers.length === 0 ? (
            <div className="minecraft-no-data">
              <div className="minecraft-no-data-icon">📡</div>
              <div className="minecraft-no-data-text">
                No nearby players found. Make sure you're on the same WiFi network.
              </div>
            </div>
          ) : (
            nearbyPlayers.map((player) => (
              <div
                key={player.id}
                className="p-3 bg-slate-700 rounded border border-amber-600 flex items-center justify-between"
              >
                <div>
                  <div className="font-minecraft text-amber-400">{player.name}</div>
                  <div className="text-xs text-slate-400">
                    Rating: {player.rating} • {player.connectionType}
                  </div>
                </div>
                <button
                  className="minecraft-button minecraft-button-small minecraft-button-primary"
                  disabled={!currentPlayer}
                >
                  Invite
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  if (!showMultiplayerMenu) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`bg-slate-900 rounded-lg border-4 border-amber-600 ${
        isMobile ? 'w-full h-full' : 'w-full max-w-4xl max-h-[90vh]'
      } overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b-2 border-amber-600 flex items-center justify-between">
          <h2 className="font-minecraft text-2xl text-amber-400">Multiplayer</h2>
          <button
            onClick={onClose}
            className="minecraft-button minecraft-button-danger"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {renderConnectionStatus()}
          
          {!currentPlayer ? (
            renderPlayerRegistration()
          ) : (
            <div>
              {/* Player Info */}
              <div className="mb-4 p-3 bg-slate-800 rounded border-2 border-green-600">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-minecraft text-green-400">Welcome, {currentPlayer.name}!</span>
                    <div className="text-sm text-slate-400">
                      Rating: {currentPlayer.rating} • Games: {currentPlayer.gamesPlayed}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => disconnect()}
                      className="minecraft-button minecraft-button-small minecraft-button-secondary"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Room */}
              {currentRoom && (
                <div className="mb-4 p-4 bg-blue-900 bg-opacity-50 rounded border-2 border-blue-400">
                  <h4 className="font-minecraft text-blue-400 mb-2">Current Room: {currentRoom.name}</h4>
                  <div className="text-sm text-slate-300">
                    {currentRoom.gameMode} • {BIOME_CONFIGS[currentRoom.biome]?.displayName}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-slate-400">
                      {currentRoom.players.length}/{currentRoom.maxPlayers} players
                    </div>
                    <button
                      onClick={() => leaveRoom(currentRoom.id)}
                      className="minecraft-button minecraft-button-small minecraft-button-danger"
                    >
                      Leave Room
                    </button>
                  </div>
                </div>
              )}

              {/* Tabs */}
              {renderTabs()}

              {/* Tab Content */}
              {activeTab === 'rooms' && renderRoomsTab()}
              {activeTab === 'nearby' && renderNearbyTab()}
              {activeTab === 'tournaments' && (
                <div className="minecraft-no-data">
                  <div className="minecraft-no-data-icon">🏆</div>
                  <div className="minecraft-no-data-text">
                    Tournament system coming soon!
                  </div>
                </div>
              )}
              {activeTab === 'history' && (
                <div className="minecraft-no-data">
                  <div className="minecraft-no-data-icon">📊</div>
                  <div className="minecraft-no-data-text">
                    Player history and statistics coming soon!
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}