import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Match, MatchFilter } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MatchListProps {
  matches: Match[];
  filter: MatchFilter;
  onFilterChange: (filter: MatchFilter) => void;
  onOpenMatch: (matchId: string) => void;
  onNavigateToStandings: () => void;
  currentDateIndex: number;
  onDateChange: (index: number) => void;
  pinnedLeagues: string[];
  onTogglePinLeague: (leagueId: string) => void;
}

export interface DateEntry {
  id: string;
  dateText: string;
  badge?: string;
  label: string;
}

export const DATES: DateEntry[] = [
  // 7 derniers jours qui précèdent aujourd'hui
  { id: 'd-22', dateText: 'DIM. 22/02', label: 'DIM. 22/02' },
  { id: 'd-23', dateText: 'LUN. 23/02', label: 'LUN. 23/02' },
  { id: 'd-24', dateText: 'MAR. 24/02', label: 'MAR. 24/02' },
  { id: 'd-25', dateText: 'MER. 25/02', label: 'MER. 25/02' },
  { id: 'd-26', dateText: 'JEU. 26/02', label: 'JEU. 26/02' },
  { id: 'd-27', dateText: 'VEN. 27/02', label: 'VEN. 27/02' },
  { id: 'd-28', dateText: 'SAM. 28/02', badge: 'HIER', label: 'SAM. 28/02 HIER' },
  // Aujourd'hui (Index 7)
  { id: 'd-01', dateText: 'DIM. 01/03', badge: "AUJOURD'HUI", label: "DIM. 01/03 AUJOURD'HUI" },
  // 7 prochains jours qui suivront aujourd'hui
  { id: 'd-02', dateText: 'LUN. 02/03', badge: 'DEMAIN', label: 'LUN. 02/03 DEMAIN' },
  { id: 'd-03', dateText: 'MAR. 03/03', label: 'MAR. 03/03' },
  { id: 'd-04', dateText: 'MER. 04/03', label: 'MER. 04/03' },
  { id: 'd-05', dateText: 'JEU. 05/03', label: 'JEU. 05/03' },
  { id: 'd-06', dateText: 'VEN. 06/03', label: 'VEN. 06/03' },
  { id: 'd-07', dateText: 'SAM. 07/03', label: 'SAM. 07/03' },
  { id: 'd-08', dateText: 'DIM. 08/03', label: 'DIM. 08/03' },
];

/**
 * AnimatedMatchScore: composant avec transition fluide Framer Motion
 * lors des mises à jour des scores (défilement vertical + pop + badge panier flottant)
 */
interface AnimatedMatchScoreProps {
  score: number | string | undefined;
  isLeader: boolean;
  isLive?: boolean;
  isLight?: boolean;
}

export const AnimatedMatchScore: React.FC<AnimatedMatchScoreProps> = ({
  score,
  isLeader,
  isLive,
  isLight = false,
}) => {
  const prevScoreRef = useRef<number | string | undefined>(score);
  const [delta, setDelta] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const prev = prevScoreRef.current;
    if (
      typeof prev === 'number' &&
      typeof score === 'number' &&
      score !== prev
    ) {
      const diff = score - prev;
      if (diff > 0) {
        setDelta(diff);
      }
      setIsFlashing(true);
      const timer = setTimeout(() => {
        setIsFlashing(false);
        setDelta(null);
      }, 1600);
      prevScoreRef.current = score;
      return () => clearTimeout(timer);
    }
    prevScoreRef.current = score;
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-end font-mono">
      {/* Floating basket points animation (e.g. +2 or +3) */}
      <AnimatePresence>
        {delta !== null && (
          <motion.span
            key={`delta-${score}-${delta}`}
            initial={{ opacity: 0, y: 4, scale: 0.6 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -18,
              scale: [0.6, 1.25, 1, 0.85],
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute -top-1.5 -right-1 pointer-events-none font-mono text-[10px] sm:text-xs font-black text-emerald-400 bg-emerald-500/25 border border-emerald-500/40 px-1.5 py-0.2 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.7)] z-20 whitespace-nowrap select-none"
          >
            +{delta}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Ripple ring animation on score change */}
      {isFlashing && (
        <motion.span
          initial={{ scale: 0.7, opacity: 0.9 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          className="absolute inset-0 rounded-lg bg-orange-500/35 pointer-events-none z-0"
        />
      )}

      {/* Fluid animated score transition container with spring physics */}
      <motion.div
        animate={
          isFlashing
            ? {
                scale: [1, 1.32, 0.95, 1],
              }
            : { scale: 1 }
        }
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`relative z-10 font-mono text-sm sm:text-base font-black px-1.5 py-0.5 rounded-md transition-colors duration-200 overflow-hidden ${
          isFlashing
            ? isLight
              ? 'bg-orange-100/95 text-orange-600 shadow-[0_0_12px_rgba(234,88,12,0.35)]'
              : 'bg-orange-500/30 text-orange-300 shadow-[0_0_16px_rgba(249,115,22,0.5)]'
            : isLeader
            ? isLight
              ? 'text-orange-600'
              : 'text-orange-400'
            : isLight
            ? 'text-slate-800'
            : 'text-slate-200'
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={score !== undefined ? String(score) : 'empty'}
            initial={{ y: -16, opacity: 0, scale: 1.25, filter: 'blur(1.5px)' }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ y: 16, opacity: 0, scale: 0.8, filter: 'blur(1.5px)', position: 'absolute' }}
            transition={{ type: 'spring', stiffness: 450, damping: 26 }}
            className="inline-block min-w-[1.25rem] text-right"
          >
            {score !== undefined ? score : '-'}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  filter,
  onFilterChange,
  onOpenMatch,
  onNavigateToStandings,
  currentDateIndex,
  onDateChange,
  pinnedLeagues,
  onTogglePinLeague
}) => {
  const { isLight } = useTheme();
  const [n1Collapsed, setN1Collapsed] = useState(false);
  const [n2Collapsed, setN2Collapsed] = useState(false);

  const currentDate = DATES[currentDateIndex] || DATES[7];

  // Group matches by league
  const n1Matches = matches.filter(m => m.leagueId === 'n1');
  const n2Matches = matches.filter(m => m.leagueId === 'n2');

  const filteredN1 = n1Matches.filter(m => filter === 'all' || m.statusType === filter);
  const filteredN2 = n2Matches.filter(m => filter === 'all' || m.statusType === filter);

  const totalLive = matches.filter(m => m.statusType === 'live').length;
  const totalFinished = matches.filter(m => m.statusType === 'finished').length;
  const totalUpcoming = matches.filter(m => m.statusType === 'upcoming').length;

  const isN1Pinned = pinnedLeagues.includes('n1');
  const isN2Pinned = pinnedLeagues.includes('n2');

  // Dynamic sort: Pinned leagues appear first; if both or neither are pinned, preserve default order ('n1', 'n2')
  const leagueOrder = ['n1', 'n2'].sort((a, b) => {
    const aPinned = pinnedLeagues.includes(a);
    const bPinned = pinnedLeagues.includes(b);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  const renderLeagueN1 = () => (
    <div 
      key="n1"
      id="league-card-n1"
      className={`backdrop-blur-xl border rounded-3xl overflow-hidden shadow-md transition-all duration-300 ${
        isLight
          ? 'bg-white border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
          : 'bg-slate-900/70 border-white/10'
      }`}
    >
      <div className={`flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-4 border-b ${
        isLight ? 'bg-slate-50/80 border-slate-200/80' : 'bg-white/[0.02] border-white/5'
      }`}>
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <span
            role="button"
            id="pin-league-n1"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePinLeague('n1');
            }}
            className={`p-1 -ml-1 rounded-lg active:scale-95 cursor-pointer transition-all flex items-center justify-center group/pin select-none shrink-0 ${
              isLight ? 'hover:bg-slate-200/60' : 'hover:bg-white/10'
            }`}
            title={isN1Pinned ? "Désépingler N1_H FIBB" : "Épingler N1_H FIBB en tête des championnats"}
            aria-label="Épingler le championnat N1_H FIBB"
          >
            <Pin
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                isN1Pinned
                  ? 'fill-[#FFBE1A] text-[#FF9E00] drop-shadow-[0_0_8px_rgba(255,190,26,0.6)] -rotate-45 scale-110'
                  : isLight ? 'text-slate-400 group-hover/pin:text-amber-500' : 'text-slate-400 group-hover/pin:text-amber-300'
              }`}
            />
          </span>
          <div className="min-w-0">
            <span className={`font-black text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 truncate ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              CÔTE D'IVOIRE: N1_H FIBB
              {isN1Pinned && (
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-500 border border-amber-400/30 shrink-0">
                  ÉPINGLÉ
                </span>
              )}
            </span>
            <span className={`text-[11px] sm:text-xs font-medium ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>(Journée 14)</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={onNavigateToStandings}
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-bold transition ${
              isLight ? 'text-orange-600 hover:text-orange-700' : 'text-orange-400 hover:text-orange-300'
            }`}
          >
            Classement
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setN1Collapsed(!n1Collapsed)}
            className={`p-1.5 rounded-lg transition ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
            title={n1Collapsed ? 'Dérouler' : 'Réduire'}
          >
            {n1Collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!n1Collapsed && (
        <div className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-white/5'}`}>
          {filteredN1.length === 0 ? (
            <div className={`p-6 text-center text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              Aucun match correspondant au filtre dans cette ligue.
            </div>
          ) : (
            filteredN1.map((match) => (
              <div
                key={match.id}
                id={`match-row-${match.id}`}
                onClick={() => onOpenMatch(match.id)}
                className={`p-3 sm:p-4 cursor-pointer transition flex items-center justify-between gap-2.5 sm:gap-4 group ${
                  isLight ? 'hover:bg-slate-50/90' : 'hover:bg-white/[0.04]'
                }`}
              >
                {/* Status & Venue */}
                <div className="w-20 sm:w-28 shrink-0 text-left">
                  {match.statusType === 'live' ? (
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-mono font-bold text-red-500">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
                      <span className="truncate">{match.status}</span>
                    </div>
                  ) : match.statusType === 'finished' ? (
                    <div className={`text-[11px] sm:text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Terminé</div>
                  ) : (
                    <div className={`text-[11px] sm:text-xs font-bold ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>{match.status}</div>
                  )}
                  <span className={`text-[9px] sm:text-[10px] block truncate ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>{match.venue}</span>
                </div>

                {/* Teams & Scores with fluid Framer Motion animations */}
                <div className="flex-1 space-y-1 sm:space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs sm:text-sm font-bold transition flex items-center gap-1.5 sm:gap-2 truncate ${
                      isLight ? 'text-slate-900 group-hover:text-orange-600' : 'text-slate-100 group-hover:text-orange-300'
                    }`}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 shrink-0"></span>
                      <span className="truncate">{match.homeTeam.name}</span>
                    </span>
                    <AnimatedMatchScore
                      score={match.homeScore}
                      isLeader={
                        typeof match.homeScore === 'number' &&
                        typeof match.awayScore === 'number' &&
                        match.homeScore > match.awayScore
                      }
                      isLive={match.statusType === 'live'}
                      isLight={isLight}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs sm:text-sm font-bold transition flex items-center gap-1.5 sm:gap-2 truncate ${
                      isLight ? 'text-slate-900 group-hover:text-orange-600' : 'text-slate-100 group-hover:text-orange-300'
                    }`}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="truncate">{match.awayTeam.name}</span>
                    </span>
                    <AnimatedMatchScore
                      score={match.awayScore}
                      isLeader={
                        typeof match.homeScore === 'number' &&
                        typeof match.awayScore === 'number' &&
                        match.awayScore > match.homeScore
                      }
                      isLive={match.statusType === 'live'}
                      isLight={isLight}
                    />
                  </div>
                </div>

                {/* Badges / Actions */}
                <div className="shrink-0 flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3">
                  {match.statusType === 'live' && (
                    <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${
                      isLight
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      LIVE
                    </span>
                  )}
                  <span className={`text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl transition ${
                    isLight
                      ? 'text-slate-600 group-hover:text-slate-900 bg-slate-100 border border-slate-200'
                      : 'text-slate-400 group-hover:text-white bg-white/5 border border-white/5'
                  }`}>
                    {match.statusType === 'upcoming' ? 'AVANT' : 'BOX'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderLeagueN2 = () => (
    <div 
      key="n2"
      id="league-card-n2"
      className={`backdrop-blur-xl border rounded-3xl overflow-hidden shadow-md transition-all duration-300 ${
        isLight
          ? 'bg-white border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
          : 'bg-slate-900/70 border-white/10'
      }`}
    >
      <div className={`flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-4 border-b ${
        isLight ? 'bg-slate-50/80 border-slate-200/80' : 'bg-white/[0.02] border-white/5'
      }`}>
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <span
            role="button"
            id="pin-league-n2"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePinLeague('n2');
            }}
            className={`p-1 -ml-1 rounded-lg active:scale-95 cursor-pointer transition-all flex items-center justify-center group/pin select-none shrink-0 ${
              isLight ? 'hover:bg-slate-200/60' : 'hover:bg-white/10'
            }`}
            title={isN2Pinned ? "Désépingler N2_H FIBB" : "Épingler N2_H FIBB en tête des championnats"}
            aria-label="Épingler le championnat N2_H FIBB"
          >
            <Pin
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                isN2Pinned
                  ? 'fill-[#FFBE1A] text-[#FF9E00] drop-shadow-[0_0_8px_rgba(255,190,26,0.6)] -rotate-45 scale-110'
                  : isLight ? 'text-slate-400 group-hover/pin:text-amber-500' : 'text-slate-400 group-hover/pin:text-amber-300'
              }`}
            />
          </span>
          <div className="min-w-0">
            <span className={`font-black text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 truncate ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              CÔTE D'IVOIRE: N2_H FIBB
              {isN2Pinned && (
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-500 border border-amber-400/30 shrink-0">
                  ÉPINGLÉ
                </span>
              )}
            </span>
            <span className={`text-[11px] sm:text-xs font-medium ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>(Poule A - J10)</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => setN2Collapsed(!n2Collapsed)}
            className={`p-1.5 rounded-lg transition ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
            title={n2Collapsed ? 'Dérouler' : 'Réduire'}
          >
            {n2Collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!n2Collapsed && (
        <div className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-white/5'}`}>
          {filteredN2.length === 0 ? (
            <div className={`p-6 text-center text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              Aucun match correspondant au filtre dans cette ligue.
            </div>
          ) : (
            filteredN2.map((match) => (
              <div
                key={match.id}
                id={`match-row-${match.id}`}
                onClick={() => onOpenMatch(match.id)}
                className={`p-3 sm:p-4 cursor-pointer transition flex items-center justify-between gap-2.5 sm:gap-4 group ${
                  isLight ? 'hover:bg-slate-50/90' : 'hover:bg-white/[0.04]'
                }`}
              >
                {/* Status & Venue */}
                <div className="w-20 sm:w-28 shrink-0 text-left">
                  {match.statusType === 'live' ? (
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-mono font-bold text-red-500">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
                      <span className="truncate">{match.status}</span>
                    </div>
                  ) : match.statusType === 'finished' ? (
                    <div className={`text-[11px] sm:text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Terminé</div>
                  ) : (
                    <div className={`text-[11px] sm:text-xs font-bold ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>{match.status}</div>
                  )}
                  <span className={`text-[9px] sm:text-[10px] block truncate ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{match.venue}</span>
                </div>

                {/* Teams & Scores with fluid Framer Motion animations */}
                <div className="flex-1 space-y-1 sm:space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs sm:text-sm font-semibold transition truncate ${
                      isLight ? 'text-slate-900 group-hover:text-orange-600' : 'text-slate-100 group-hover:text-orange-300'
                    }`}>
                      {match.homeTeam.name}
                    </span>
                    <AnimatedMatchScore
                      score={match.homeScore}
                      isLeader={
                        typeof match.homeScore === 'number' &&
                        typeof match.awayScore === 'number' &&
                        match.homeScore > match.awayScore
                      }
                      isLive={match.statusType === 'live'}
                      isLight={isLight}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs sm:text-sm font-semibold transition truncate ${
                      isLight ? 'text-slate-700 group-hover:text-orange-600' : 'text-slate-300 group-hover:text-orange-300'
                    }`}>
                      {match.awayTeam.name}
                    </span>
                    <AnimatedMatchScore
                      score={match.awayScore}
                      isLeader={
                        typeof match.homeScore === 'number' &&
                        typeof match.awayScore === 'number' &&
                        match.awayScore > match.homeScore
                      }
                      isLive={match.statusType === 'live'}
                      isLight={isLight}
                    />
                  </div>
                </div>

                {/* Badges / Actions */}
                <div className="shrink-0 flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3">
                  {match.statusType === 'live' && (
                    <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${
                      isLight
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      LIVE
                    </span>
                  )}
                  <span className={`text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl transition ${
                    isLight
                      ? 'text-slate-600 group-hover:text-slate-900 bg-slate-100 border border-slate-200'
                      : 'text-slate-400 group-hover:text-white bg-white/5 border border-white/5'
                  }`}>
                    BOX
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <div id="match-list-container" className="space-y-6">
      {/* Calendar & Status Filter Bar */}
      <div 
        id="match-filter-bar"
        className={`flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 backdrop-blur-xl border p-2.5 sm:p-3 rounded-2xl shadow-md ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-slate-900'
            : 'bg-slate-900/60 border-white/10 text-white'
        }`}
      >
        {/* Date Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-between md:justify-start">
          <button
            id="btn-prev-date"
            onClick={() => onDateChange(Math.max(0, currentDateIndex - 1))}
            disabled={currentDateIndex === 0}
            className={`p-1.5 sm:p-2 rounded-xl border transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0 ${
              isLight
                ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative group flex-1 md:flex-initial">
            {/* Custom display rendering the date in pure bold and the precision badge in orange */}
            <div className={`flex items-center justify-center md:justify-start gap-1.5 backdrop-blur-md px-3 sm:px-4 py-2 pr-8 sm:pr-9 rounded-xl border transition shadow-inner select-none pointer-events-none w-full ${
              isLight
                ? 'bg-slate-50 border-orange-500/40 group-hover:border-orange-500/70 text-slate-900'
                : 'bg-slate-800/90 border-orange-500/35 group-hover:border-orange-500/60 text-white'
            }`}>
              <span className={`font-black text-xs md:text-sm tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {currentDate.dateText}
              </span>
              {currentDate.badge && (
                <span className="text-[#FF6500] font-extrabold text-[10px] md:text-xs tracking-wider bg-orange-500/15 px-1.5 py-0.5 rounded border border-orange-500/30 whitespace-nowrap">
                  {currentDate.badge}
                </span>
              )}
            </div>

            {/* Native Select overlaid with absolute positioning and opacity-0 so user can click/tap to choose */}
            <select
              id="date-select"
              value={currentDateIndex}
              onChange={(e) => onDateChange(Number(e.target.value))}
              aria-label="Sélectionner une date de match"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 font-black"
            >
              {DATES.map((d, idx) => (
                <option key={d.id} value={idx} className={isLight ? 'bg-white text-slate-900 font-bold py-1' : 'bg-slate-900 text-white font-bold py-1'}>
                  {d.dateText} {d.badge ? `(${d.badge})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-orange-500 absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none z-0" />
          </div>

          <button
            id="btn-next-date"
            onClick={() => onDateChange(Math.min(DATES.length - 1, currentDateIndex + 1))}
            disabled={currentDateIndex === DATES.length - 1}
            className={`p-1.5 sm:p-2 rounded-xl border transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0 ${
              isLight
                ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Match Status Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar touch-pan-x">
          <button
            id="filter-all"
            onClick={() => onFilterChange('all')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold tracking-wide whitespace-nowrap transition-all shrink-0 ${
              filter === 'all'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            TOUS ({matches.length})
          </button>

          <button
            id="filter-live"
            onClick={() => onFilterChange('live')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${
              filter === 'live'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {/* Soft slow scintillating red beacon */}
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400/40 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-[pulse_3.5s_ease-in-out_infinite]"></span>
            </span>
            EN DIRECT ({totalLive})
          </button>

          <button
            id="filter-finished"
            onClick={() => onFilterChange('finished')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold tracking-wide whitespace-nowrap transition-all shrink-0 ${
              filter === 'finished'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            TERMINÉS ({totalFinished})
          </button>

          <button
            id="filter-upcoming"
            onClick={() => onFilterChange('upcoming')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold tracking-wide whitespace-nowrap transition-all shrink-0 ${
              filter === 'upcoming'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            À VENIR ({totalUpcoming})
          </button>
        </div>
      </div>

      {/* Dynamic sorted rendering of leagues based on pinned status */}
      {leagueOrder.map((leagueId) => (leagueId === 'n1' ? renderLeagueN1() : renderLeagueN2()))}
    </div>
  );
};
