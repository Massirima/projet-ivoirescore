import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Shield, 
  Radio, 
  Database, 
  Activity, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AdminUser, Match, Team, ScoutUser, ScoutFeedEvent } from '../types';
import { AdminHeader } from './components/AdminHeader';
import { MatchsSection } from './components/MatchsSection';
import { TeamsSection } from './components/TeamsSection';
import { PlayersSection } from './components/PlayersSection';
import { StandingsSection } from './components/StandingsSection';
import { ScoutsSection } from './components/ScoutsSection';
import { ScoutFeedBufferSection } from './components/ScoutFeedBufferSection';
import { DEFAULT_SCOUTS, INITIAL_SCOUT_FEED_EVENTS } from './adminData';
import { INITIAL_MATCHES, TEAMS } from '../data/mockData';

interface AdminDashboardProps {
  adminUser: AdminUser;
  onLogout: () => void;
}

export type AdminTab = 'matches' | 'scouts' | 'scout_feed' | 'standings' | 'teams' | 'players';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminUser, onLogout }) => {
  const { isLight } = useTheme();
  const [activeTab, setActiveTab] = useState<AdminTab>('matches');

  // Shared state
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [teams, setTeams] = useState<Record<string, Team>>(TEAMS);
  const [scouts, setScouts] = useState<ScoutUser[]>(DEFAULT_SCOUTS);
  const [feedEvents, setFeedEvents] = useState<ScoutFeedEvent[]>(INITIAL_SCOUT_FEED_EVENTS);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Match operations
  const handleAddMatch = (newMatch: Match) => {
    setMatches([newMatch, ...matches]);
    showToast(`Rencontre ${newMatch.homeTeam.shortName} vs ${newMatch.awayTeam.shortName} programmée avec succès.`);
  };

  const handleUpdateMatch = (updatedMatch: Match) => {
    setMatches(matches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)));
    showToast(`Rencontre mise à jour : ${updatedMatch.homeTeam.shortName} vs ${updatedMatch.awayTeam.shortName}.`);
  };

  const handleDeleteMatch = (matchId: string) => {
    setMatches(matches.filter((m) => m.id !== matchId));
    showToast("Rencontre supprimée de la programmation.");
  };

  const handleValidateFinalScore = (matchId: string) => {
    setMatches(
      matches.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            status: 'Terminé',
            statusType: 'finished' as const
          };
        }
        return m;
      })
    );
    showToast("Score final validé et entériné officiellement !");
  };

  // Team operations
  const handleAddTeam = (newTeam: Team) => {
    setTeams({ ...teams, [newTeam.id]: newTeam });
    showToast(`Club ${newTeam.name} (${newTeam.code}) enregistré.`);
  };

  const handleUpdateTeam = (updatedTeam: Team) => {
    setTeams({ ...teams, [updatedTeam.id]: updatedTeam });
    showToast(`Informations du club ${updatedTeam.name} mises à jour.`);
  };

  const handleDeleteTeam = (teamId: string) => {
    const updated = { ...teams };
    delete updated[teamId];
    setTeams(updated);
    showToast("Club supprimé de la base.");
  };

  // Scout operations
  const handleAddScout = (newScoutData: Omit<ScoutUser, 'id' | 'createdAt' | 'apiKey'>) => {
    const newScout: ScoutUser = {
      ...newScoutData,
      id: `scout_${Date.now()}`,
      createdAt: new Date().toISOString(),
      apiKey: `fibb_scout_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 6)}`
    };
    setScouts([newScout, ...scouts]);
    showToast(`Compte scout créé pour ${newScout.fullName} (@${newScout.username}).`);
  };

  const handleUpdateScout = (updatedScout: ScoutUser) => {
    setScouts(scouts.map((s) => (s.id === updatedScout.id ? updatedScout : s)));
    showToast(`Compte scout de ${updatedScout.fullName} mis à jour.`);
  };

  const handleDeleteScout = (scoutId: string) => {
    setScouts(scouts.filter((s) => s.id !== scoutId));
    showToast("Compte scout révoqué et supprimé.");
  };

  // Scout live action simulation
  const handleTriggerSimulatedScoutAction = (actionData: Omit<ScoutFeedEvent, 'id' | 'timestamp'>) => {
    const newEvent: ScoutFeedEvent = {
      ...actionData,
      id: `fe_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setFeedEvents([newEvent, ...feedEvents]);

    // If it has points, update the corresponding match score
    if (actionData.pointsAdded && actionData.matchId) {
      setMatches((prevMatches) =>
        prevMatches.map((m) => {
          if (m.id === actionData.matchId) {
            const isHome = actionData.team === 'home';
            const curHome = typeof m.homeScore === 'number' ? m.homeScore : 0;
            const curAway = typeof m.awayScore === 'number' ? m.awayScore : 0;
            return {
              ...m,
              homeScore: isHome ? curHome + actionData.pointsAdded! : curHome,
              awayScore: !isHome ? curAway + actionData.pointsAdded! : curAway,
              status: `${actionData.quarter} ${actionData.gameClock}`,
              statusType: 'live' as const
            };
          }
          return m;
        })
      );
    }

    showToast(`Signal reçu du Scout ${actionData.scoutName} : ${actionData.type.toUpperCase()}`);
  };

  const handleClearBuffer = () => {
    setFeedEvents([]);
    showToast("Le tampon du flux scout a été réinitialisé.");
  };

  const activeScoutsCount = scouts.filter((s) => s.status === 'on_duty').length;
  const liveMatchesCount = matches.filter((m) => m.statusType === 'live').length;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#080a0f] text-white'
    }`}>
      {/* Admin Sticky Header */}
      <AdminHeader
        adminUser={adminUser}
        onLogout={onLogout}
        activeScoutsCount={activeScoutsCount}
        liveMatchesCount={liveMatchesCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className={`p-1.5 rounded-2xl border flex items-center gap-1 overflow-x-auto scrollbar-none transition shadow-sm ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/10'
        }`}>
          {/* Tab: Matches */}
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : isLight ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Rencontres & Scores</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
              activeTab === 'matches' ? 'bg-white/20 text-white' : 'bg-slate-500/10 text-slate-400'
            }`}>
              {matches.length}
            </span>
          </button>

          {/* Tab: Scouts */}
          <button
            id="admin-tab-scouts"
            onClick={() => setActiveTab('scouts')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'scouts'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : isLight ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-4 h-4 text-amber-400" />
            <span>Gestion Scouts (Fournisseurs)</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
              activeTab === 'scouts' ? 'bg-white/20 text-white' : 'bg-slate-500/10 text-slate-400'
            }`}>
              {scouts.length}
            </span>
          </button>

          {/* Tab: Scout Feed & Postgres buffer */}
          <button
            id="admin-tab-scout-feed"
            onClick={() => setActiveTab('scout_feed')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'scout_feed'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : isLight ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4 text-blue-400" />
            <span>Flux Scout & File PostgreSQL</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
              activeTab === 'scout_feed' ? 'bg-white/20 text-white' : 'bg-blue-500/15 text-blue-400'
            }`}>
              {feedEvents.length}
            </span>
          </button>

          {/* Tab: Standings */}
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'standings'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : isLight ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Classements</span>
          </button>

          {/* Tab: Teams */}
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'teams'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : isLight ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Clubs FIBB</span>
          </button>

          {/* Tab: Players */}
          <button
            onClick={() => setActiveTab('players')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'players'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : isLight ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Effectifs Joueurs</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'matches' && (
            <MatchsSection
              matches={matches}
              teams={teams}
              onAddMatch={handleAddMatch}
              onUpdateMatch={handleUpdateMatch}
              onDeleteMatch={handleDeleteMatch}
              onValidateFinalScore={handleValidateFinalScore}
            />
          )}

          {activeTab === 'scouts' && (
            <ScoutsSection
              scouts={scouts}
              matches={matches}
              onAddScout={handleAddScout}
              onUpdateScout={handleUpdateScout}
              onDeleteScout={handleDeleteScout}
            />
          )}

          {activeTab === 'scout_feed' && (
            <ScoutFeedBufferSection
              feedEvents={feedEvents}
              scouts={scouts}
              matches={matches}
              onTriggerSimulatedScoutAction={handleTriggerSimulatedScoutAction}
              onClearBuffer={handleClearBuffer}
            />
          )}

          {activeTab === 'standings' && <StandingsSection />}

          {activeTab === 'teams' && (
            <TeamsSection
              teams={teams}
              onAddTeam={handleAddTeam}
              onUpdateTeam={handleUpdateTeam}
              onDeleteTeam={handleDeleteTeam}
            />
          )}

          {activeTab === 'players' && <PlayersSection teams={teams} />}
        </div>
      </main>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-orange-500/40 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
