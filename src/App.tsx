import React, { useState, useEffect } from 'react';
import { ScreenType, MatchFilter, Match } from './types';
import { INITIAL_MATCHES, STANDINGS_N1, TOP_SCORERS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { LiquidGlassNav } from './components/LiquidGlassNav';
import { HeroMatch } from './components/HeroMatch';
import { MatchList } from './components/MatchList';
import { SidebarWidgets } from './components/SidebarWidgets';
import { StandingsScreen } from './components/StandingsScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { MatchDetailModal } from './components/MatchDetailModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { SearchScreen } from './components/SearchScreen';
import { UserConfigModal } from './components/UserConfigModal';
import { AdBanner } from './components/AdBanner';
import { playScoreChime, playClickBeep } from './utils/audio';
import { AdminApp } from './admin/AdminApp';

interface NotificationItem {
  id: string;
  matchId: string;
  time: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'score' | 'end_quarter' | 'alert';
}

// Helper to determine if current URL targets the isolated Admin module
const isCurrentRouteAdmin = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || search.includes('page=admin');
};

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(isCurrentRouteAdmin);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('matchs');
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [currentDateIndex, setCurrentDateIndex] = useState(7); // 7 = DIM. 01/03 AUJOURD'HUI (7 jours avant, 7 jours après)
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('m1');
  const [favorites, setFavorites] = useState<string[]>(['m1']);
  const [pinnedLeagues, setPinnedLeagues] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [recentScoreFlash, setRecentScoreFlash] = useState<'home' | 'away' | null>(null);
  const [userConfigModalOpen, setUserConfigModalOpen] = useState(false);
  const [userConfigModalMode, setUserConfigModalMode] = useState<'user' | 'settings'>('user');

  // Listen to popstate, hashchange and URL changes for /admin navigation
  useEffect(() => {
    const handleLocationCheck = () => {
      setIsAdminMode(isCurrentRouteAdmin());
    };
    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('hashchange', handleLocationCheck);

    // Administrative testing shortcut (Ctrl+Shift+A or Cmd+Shift+A)
    // Allows toggling /admin in environments where URL bar cannot be changed directly
    const handleAdminShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const nextMode = !isAdminMode;
        if (nextMode) {
          window.history.pushState({}, '', '/admin');
        } else {
          window.history.pushState({}, '', '/');
        }
        setIsAdminMode(nextMode);
      }
    };
    window.addEventListener('keydown', handleAdminShortcut);

    return () => {
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('hashchange', handleLocationCheck);
      window.removeEventListener('keydown', handleAdminShortcut);
    };
  }, [isAdminMode]);

  // Keyboard shortcut Cmd/Ctrl + K to toggle search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCurrentScreen((prev) => (prev === 'recherche' ? 'matchs' : 'recherche'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      matchId: 'm1',
      time: '02:45',
      title: 'Panier Crucial • ABC Fighters',
      message: 'S. Dieng convertit un tir primé à mi-distance ! ABC mène 98 - 94 contre la JCA.',
      isRead: false,
      type: 'score'
    },
    {
      id: 'notif-2',
      matchId: 'm3',
      time: '05:12',
      title: 'Avantage Hypersonic BC',
      message: 'Hypersonic BC prend 6 points d\'avance face aux Abi-Snipers (78 - 72).',
      isRead: false,
      type: 'score'
    },
    {
      id: 'notif-3',
      matchId: 'm2',
      time: 'Fin de match',
      title: 'Victoire de CBA Abidjan',
      message: 'Score final palpitant : CBA Abidjan s\'impose 108 à 105 face au Fusion BC.',
      isRead: true,
      type: 'end_quarter'
    }
  ]);

  // Selected match object
  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];
  const featuredMatch = matches.find((m) => m.isFeatured) || matches[0];
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('matchs');

  // Screen switcher
  const handleSelectScreen = (screen: ScreenType) => {
    if (soundEnabled) playClickBeep();
    if (currentScreen !== 'recherche' && currentScreen !== 'detail') {
      setPreviousScreen(currentScreen);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back navigation from search screen
  const handleBackFromSearch = () => {
    if (soundEnabled) playClickBeep();
    setCurrentScreen(previousScreen === 'recherche' ? 'matchs' : previousScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open match detail
  const handleOpenMatch = (matchId: string) => {
    if (soundEnabled) playClickBeep();
    setSelectedMatchId(matchId);
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite
  const handleToggleFavorite = (matchId: string) => {
    if (soundEnabled) playClickBeep();
    setFavorites((prev) =>
      prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId]
    );
  };

  // Toggle pinned league
  const handleTogglePinLeague = (leagueId: string) => {
    if (soundEnabled) playClickBeep();
    setPinnedLeagues((prev) =>
      prev.includes(leagueId) ? prev.filter((id) => id !== leagueId) : [...prev, leagueId]
    );
  };

  // Toggle sound
  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Manual refresh trigger
  const handleTriggerRefresh = () => {
    if (soundEnabled) playClickBeep();
    // Simulate score update on featured match
    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        if (m.id === 'm1' && typeof m.homeScore === 'number') {
          const addPoints = Math.random() > 0.5 ? 2 : 3;
          const isHome = Math.random() > 0.4;
          if (isHome) {
            setRecentScoreFlash('home');
            setTimeout(() => setRecentScoreFlash(null), 1200);
            return {
              ...m,
              homeScore: m.homeScore + addPoints,
              periodScores: {
                ...m.periodScores,
                q4: [m.periodScores.q4[0] + addPoints, m.periodScores.q4[1]]
              }
            };
          } else {
            setRecentScoreFlash('away');
            setTimeout(() => setRecentScoreFlash(null), 1200);
            return {
              ...m,
              awayScore: (m.awayScore as number) + addPoints,
              periodScores: {
                ...m.periodScores,
                q4: [m.periodScores.q4[0], m.periodScores.q4[1] + addPoints]
              }
            };
          }
        }
        return m;
      })
    );
    if (soundEnabled) playScoreChime();
  };

  // Simulated live basketball game tick (updates clock countdown and occasional points for fluid Framer Motion transitions)
  useEffect(() => {
    let tickCount = 0;
    const timer = setInterval(() => {
      tickCount += 1;
      const shouldScore = tickCount % 3 === 0; // Every ~12 seconds

      setMatches((prevMatches) => {
        const liveMatches = prevMatches.filter((m) => m.statusType === 'live');
        const scoringMatchId =
          shouldScore && liveMatches.length > 0
            ? liveMatches[Math.floor(Math.random() * liveMatches.length)].id
            : null;

        return prevMatches.map((match) => {
          if (match.statusType === 'live') {
            // Parse minutes and seconds if available
            const matchTime = match.status.match(/(\d+):(\d+)/);
            let updatedStatus = match.status;

            if (matchTime) {
              let minutes = parseInt(matchTime[1], 10);
              let seconds = parseInt(matchTime[2], 10);

              if (seconds > 0) {
                seconds -= 1;
              } else if (minutes > 0) {
                minutes -= 1;
                seconds = 59;
              }

              const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
              const periodPrefix = match.status.split(' ')[0] || 'Q4';
              updatedStatus = `${periodPrefix} ${formattedTime}`;
            }

            // If selected to score this tick
            if (
              match.id === scoringMatchId &&
              typeof match.homeScore === 'number' &&
              typeof match.awayScore === 'number'
            ) {
              const addPoints = Math.random() > 0.4 ? 2 : 3;
              const isHome = Math.random() > 0.5;

              if (match.isFeatured) {
                setRecentScoreFlash(isHome ? 'home' : 'away');
                setTimeout(() => setRecentScoreFlash(null), 1200);
              }

              return {
                ...match,
                status: updatedStatus,
                homeScore: isHome ? match.homeScore + addPoints : match.homeScore,
                awayScore: !isHome ? match.awayScore + addPoints : match.awayScore,
                periodScores: {
                  ...match.periodScores,
                  q4: [
                    isHome ? match.periodScores.q4[0] + addPoints : match.periodScores.q4[0],
                    !isHome ? match.periodScores.q4[1] + addPoints : match.periodScores.q4[1]
                  ]
                }
              };
            }

            return {
              ...match,
              status: updatedStatus
            };
          }
          return match;
        });
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // If in Admin Mode, render the isolated Admin application
  if (isAdminMode) {
    return (
      <AdminApp
        onExitAdmin={() => {
          window.history.pushState({}, '', '/');
          setIsAdminMode(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#090D14] text-slate-100 selection:bg-orange-500 selection:text-white pb-24">
      {/* TOP FIXED NAVBAR */}
      <Navbar
        currentScreen={currentScreen}
        onSelectScreen={handleSelectScreen}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setNotificationsOpen(true)}
        isLiveSimulating={true}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onTriggerRefresh={handleTriggerRefresh}
        onOpenUserModal={() => {
          setUserConfigModalMode('user');
          setUserConfigModalOpen(true);
        }}
        onOpenSettingsModal={() => {
          setUserConfigModalMode('settings');
          setUserConfigModalOpen(true);
        }}
      />

      {/* NOTIFICATIONS DRAWER */}
      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onSelectMatch={handleOpenMatch}
      />

      {/* MAIN BODY CONTAINER */}
      <div className="flex justify-center w-full max-w-[1800px] mx-auto xl:px-4 gap-4 2xl:gap-8 pt-14 sm:pt-16">

        {/* LEFT AD SIDEBAR (Desktop only) */}
        <aside className="hidden xl:block shrink-0 sticky top-20 h-fit">
          <AdBanner placement="vertical" />
        </aside>

        <main className="flex-1 min-w-0 max-w-7xl px-2.5 sm:px-4 space-y-3.5 sm:space-y-4">

          {/* TOP AD BANNER (Mobile/Tablet only) */}
          <div className="xl:hidden w-full mb-4">
            <AdBanner placement="horizontal" />
          </div>

          {/* CENTERED LIQUID GLASS NAVIGATION BAR (Hidden on detail and recherche) */}
          {currentScreen !== 'detail' && currentScreen !== 'recherche' && (
          <LiquidGlassNav
            currentScreen={currentScreen}
            onSelectScreen={handleSelectScreen}
            favoritesCount={favorites.length + pinnedLeagues.length}
          />
        )}

        {/* SCREEN VIEWS */}
        {/* ========================================= */}
        {/* SCREEN 1: MATCHS (Direct & Journée) */}
        {/* ========================================= */}
        {currentScreen === 'matchs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Matches Column (2 Cols on Large) */}
              <div className="lg:col-span-2 space-y-6">
                {/* HERO FEATURED MATCH ("div de choc") */}
                <HeroMatch
                  match={featuredMatch}
                  onOpenMatch={handleOpenMatch}
                  recentScoreFlash={recentScoreFlash}
                />

                {/* MATCH LIST WITH CALENDAR & STATUS FILTER */}
                <MatchList
                  matches={matches}
                  filter={filter}
                  onFilterChange={setFilter}
                  onOpenMatch={handleOpenMatch}
                  onNavigateToStandings={() => handleSelectScreen('classements')}
                  currentDateIndex={currentDateIndex}
                  onDateChange={setCurrentDateIndex}
                  pinnedLeagues={pinnedLeagues}
                  onTogglePinLeague={handleTogglePinLeague}
                />
              </div>

              {/* SIDEBAR WIDGETS (1 Col on Large) */}
              <div className="space-y-6">
                <SidebarWidgets
                  topStandings={STANDINGS_N1}
                  topScorers={TOP_SCORERS}
                  onNavigateToStandings={() => handleSelectScreen('classements')}
                  onSelectTeam={() => handleSelectScreen('classements')}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* SCREEN 2: CLASSEMENTS (Standings) */}
        {/* ========================================= */}
        {currentScreen === 'classements' && (
          <div>
            <StandingsScreen
              standings={STANDINGS_N1}
              onSelectTeam={(teamName) => {
                // Find if this team has a match today
                const teamMatch = matches.find(
                  (m) => m.homeTeam.name.includes(teamName) || m.awayTeam.name.includes(teamName)
                );
                if (teamMatch) {
                  handleOpenMatch(teamMatch.id);
                }
              }}
            />
          </div>
        )}

        {/* ========================================= */}
        {/* SCREEN 3: FAVORIS (Mes équipes & chocs suivis) */}
        {/* ========================================= */}
        {currentScreen === 'favoris' && (
          <div>
            <FavoritesScreen
              matches={matches}
              favorites={favorites}
              pinnedLeagues={pinnedLeagues}
              onToggleFavorite={handleToggleFavorite}
              onTogglePinLeague={handleTogglePinLeague}
              onOpenMatch={handleOpenMatch}
              onNavigateToMatches={() => handleSelectScreen('matchs')}
            />
          </div>
        )}

        {/* ========================================= */}
        {/* SCREEN 4: CALENDRIER (Saison & Journées FIBB) */}
        {/* ========================================= */}
        {currentScreen === 'calendrier' && (
          <div>
            <CalendarScreen
              onOpenMatch={handleOpenMatch}
              matches={matches}
            />
          </div>
        )}

        {/* ========================================= */}
        {/* SCREEN 5: DÉTAIL DU MATCH (Box Score & Compositions) */}
        {/* ========================================= */}
        {currentScreen === 'detail' && (
          <div>
            <MatchDetailModal
              match={selectedMatch}
              onBack={() => handleSelectScreen('matchs')}
              isFavorite={favorites.includes(selectedMatch.id)}
              onToggleFavorite={() => handleToggleFavorite(selectedMatch.id)}
            />
          </div>
        )}

        {/* ========================================= */}
        {/* SCREEN 6: RECHERCHE GÉNÉRALE & CHAMPIONNATS */}
        {/* ========================================= */}
        {currentScreen === 'recherche' && (
          <div>
            <SearchScreen
              matches={matches}
              onOpenMatch={handleOpenMatch}
              onNavigateToStandings={() => handleSelectScreen('classements')}
              onNavigateToCalendar={() => handleSelectScreen('calendrier')}
              onBack={handleBackFromSearch}
            />
          </div>
        )}
        </main>

        {/* RIGHT AD SIDEBAR (Desktop only) */}
        <aside className="hidden xl:block shrink-0 sticky top-20 h-fit">
          <AdBanner placement="vertical" />
        </aside>

      </div>

      {/* USER & SETTINGS MODAL */}
      <UserConfigModal
        isOpen={userConfigModalOpen}
        mode={userConfigModalMode}
        onClose={() => setUserConfigModalOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* BOTTOM AD BANNER (Mobile/Tablet only) */}
      <div className="xl:hidden w-full mt-8 mb-4 px-4 flex justify-center">
        <AdBanner placement="horizontal" />
      </div>

      {/* FOOTER */}
      <footer className="mt-12 sm:mt-20 border-t border-white/5 py-6 sm:py-8 text-center text-xs text-slate-500 max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white font-bold text-[10px]">
            V
          </div>
          <span className="font-bold text-slate-400">voirScore FIBB</span>
          <span>• Championnat National de Basketball de Côte d'Ivoire</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>FIBA LiveStats Officiel</span>
          <span>•</span>
          <span>Palais des Sports de Treichville</span>
          <span>•</span>
          <span className="text-emerald-400 font-mono">Saison 2026</span>
        </div>
      </footer>
    </div>
  );
}

