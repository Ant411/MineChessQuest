import React from 'react';
import { Tournament } from '../../lib/multiplayer/MultiplayerClient';
import { useIsMobile } from '../../hooks/use-is-mobile';

interface TournamentBracketProps {
  tournament: Tournament;
  onClose: () => void;
}

export function TournamentBracket({ tournament, onClose }: TournamentBracketProps) {
  const isMobile = useIsMobile();

  const renderBracketRound = (round: any, roundIndex: number) => {
    return (
      <div key={roundIndex} className="tournament-round">
        <h4 className="minecraft-section-title">Round {round.roundNumber}</h4>
        <div className="space-y-4">
          {round.matches.map((match: any, matchIndex: number) => (
            <div
              key={match.id}
              className={`tournament-match p-4 border-2 rounded ${
                match.status === 'completed' ? 'border-green-600 bg-green-900 bg-opacity-20' :
                match.status === 'active' ? 'border-yellow-600 bg-yellow-900 bg-opacity-20' :
                'border-slate-600 bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-minecraft text-amber-400">Match {matchIndex + 1}</h5>
                <span className={`text-xs px-2 py-1 rounded ${
                  match.status === 'completed' ? 'bg-green-600 text-white' :
                  match.status === 'active' ? 'bg-yellow-600 text-black' :
                  'bg-slate-600 text-white'
                }`}>
                  {match.status}
                </span>
              </div>
              
              <div className="space-y-2">
                {match.players.map((player: any, playerIndex: number) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-2 rounded ${
                      match.winner?.id === player.id ? 'bg-green-700' :
                      match.status === 'completed' ? 'bg-red-800' :
                      'bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-600 rounded border border-amber-600 flex items-center justify-center text-xs font-minecraft">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-slate-200">{player.name}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Rating: {player.rating}
                    </div>
                  </div>
                ))}
              </div>
              
              {match.status === 'active' && (
                <button className="minecraft-button minecraft-button-small minecraft-button-primary mt-2 w-full">
                  Watch Game
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTournamentHeader = () => (
    <div className="tournament-header p-4 border-b-2 border-amber-600">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-minecraft text-2xl text-amber-400">{tournament.name}</h2>
        <button
          onClick={onClose}
          className="minecraft-button minecraft-button-danger"
        >
          ✕
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="text-slate-400">Status</div>
          <div className={`font-minecraft ${
            tournament.status === 'registration' ? 'text-blue-400' :
            tournament.status === 'active' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {tournament.status}
          </div>
        </div>
        <div className="text-center">
          <div className="text-slate-400">Participants</div>
          <div className="text-amber-400 font-minecraft">
            {tournament.participants.length}/{tournament.maxParticipants}
          </div>
        </div>
        <div className="text-center">
          <div className="text-slate-400">Current Round</div>
          <div className="text-amber-400 font-minecraft">
            {tournament.currentRound}/{tournament.rounds.length || 1}
          </div>
        </div>
        <div className="text-center">
          <div className="text-slate-400">Game Mode</div>
          <div className="text-amber-400 font-minecraft">{tournament.gameMode}</div>
        </div>
      </div>
    </div>
  );

  const renderParticipants = () => (
    <div className="tournament-participants p-4 border-b-2 border-amber-600">
      <h3 className="minecraft-section-title">Participants</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {tournament.participants.map((participant) => (
          <div
            key={participant.id}
            className="participant-card p-2 bg-slate-800 rounded border border-amber-600 text-center"
          >
            <div className="w-8 h-8 bg-slate-600 rounded border-2 border-amber-600 flex items-center justify-center text-xs font-minecraft mx-auto mb-1">
              {participant.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs text-slate-200 truncate">{participant.name}</div>
            <div className="text-xs text-slate-400">{participant.rating}</div>
          </div>
        ))}
        
        {/* Empty slots */}
        {Array.from({ length: tournament.maxParticipants - tournament.participants.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="participant-card p-2 bg-slate-800 bg-opacity-50 rounded border border-slate-600 text-center"
          >
            <div className="w-8 h-8 bg-slate-700 rounded border-2 border-slate-600 flex items-center justify-center text-xs font-minecraft mx-auto mb-1">
              ?
            </div>
            <div className="text-xs text-slate-500">Open Slot</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBracket = () => {
    if (!tournament.rounds || tournament.rounds.length === 0) {
      return (
        <div className="minecraft-no-data">
          <div className="minecraft-no-data-icon">🏆</div>
          <div className="minecraft-no-data-text">
            Tournament bracket will be generated when the tournament starts.
          </div>
        </div>
      );
    }

    return (
      <div className="tournament-bracket p-4">
        <h3 className="minecraft-section-title">Tournament Bracket</h3>
        <div className={`bracket-container ${isMobile ? 'mobile-bracket' : 'desktop-bracket'}`}>
          {tournament.rounds.map((round, index) => renderBracketRound(round, index))}
        </div>
      </div>
    );
  };

  const renderWinner = () => {
    if (!tournament.winner) return null;

    return (
      <div className="tournament-winner p-4 bg-yellow-900 bg-opacity-30 border-2 border-yellow-600 rounded mb-4">
        <div className="text-center">
          <h3 className="minecraft-section-title text-yellow-400">🏆 Tournament Champion!</h3>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-yellow-600 rounded-full border-4 border-yellow-400 flex items-center justify-center text-2xl font-minecraft">
              {tournament.winner.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-minecraft text-xl text-yellow-400">{tournament.winner.name}</div>
              <div className="text-sm text-yellow-200">Rating: {tournament.winner.rating}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`bg-slate-900 rounded-lg border-4 border-amber-600 ${
        isMobile ? 'w-full h-full' : 'w-full max-w-6xl max-h-[90vh]'
      } overflow-hidden flex flex-col`}>
        
        {renderTournamentHeader()}
        
        <div className="flex-1 overflow-y-auto">
          {renderWinner()}
          {renderParticipants()}
          {renderBracket()}
        </div>
      </div>
    </div>
  );
}

// Tournament creation modal
interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTournament: (tournamentData: any) => void;
}

export function CreateTournamentModal({ 
  isOpen, 
  onClose, 
  onCreateTournament 
}: CreateTournamentModalProps) {
  const [tournamentName, setTournamentName] = React.useState('');
  const [gameMode, setGameMode] = React.useState<'2player' | '3player' | '4player'>('2player');
  const [biome, setBiome] = React.useState('forest');
  const [maxParticipants, setMaxParticipants] = React.useState(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentName.trim()) return;

    onCreateTournament({
      name: tournamentName,
      gameMode,
      biome,
      maxParticipants
    });

    // Reset form
    setTournamentName('');
    setGameMode('2player');
    setBiome('forest');
    setMaxParticipants(8);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg border-4 border-amber-600 w-full max-w-md">
        <div className="p-4 border-b-2 border-amber-600 flex items-center justify-between">
          <h2 className="font-minecraft text-xl text-amber-400">Create Tournament</h2>
          <button
            onClick={onClose}
            className="minecraft-button minecraft-button-danger minecraft-button-small"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="minecraft-input-label">Tournament Name</label>
            <input
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              className="minecraft-input"
              placeholder="Epic Chess Championship"
              maxLength={50}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="minecraft-input-label">Game Mode</label>
              <select
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value as any)}
                className="minecraft-input"
              >
                <option value="2player">2 Player</option>
                <option value="3player">3 Player</option>
                <option value="4player">4 Player</option>
              </select>
            </div>
            <div>
              <label className="minecraft-input-label">Max Players</label>
              <select
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="minecraft-input"
              >
                <option value={4}>4 Players</option>
                <option value={8}>8 Players</option>
                <option value={16}>16 Players</option>
                <option value={32}>32 Players</option>
              </select>
            </div>
          </div>

          <div>
            <label className="minecraft-input-label">Biome</label>
            <select
              value={biome}
              onChange={(e) => setBiome(e.target.value)}
              className="minecraft-input"
            >
              <option value="forest">Forest</option>
              <option value="desert">Desert</option>
              <option value="ocean">Ocean</option>
              <option value="nether">Nether</option>
              <option value="end">End</option>
              <option value="mushroom">Mushroom</option>
              <option value="ice">Ice</option>
              <option value="jungle">Jungle</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="minecraft-button minecraft-button-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="minecraft-button minecraft-button-primary flex-1"
              disabled={!tournamentName.trim()}
            >
              Create Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}