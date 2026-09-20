import React from 'react';
import { ChevronRight, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Match } from '../types';
import { ClubLogo } from './ClubLogo';
import { useTheme } from '../context/ThemeContext';

interface HeroMatchProps {
  match: Match;
  onOpenMatch: (matchId: string) => void;
  recentScoreFlash?: 'home' | 'away' | null;
}

export const HeroMatch: React.FC<HeroMatchProps> = ({
  match,
  onOpenMatch,
  recentScoreFlash
}) => {
  const { isLight } = useTheme();
  const homeScoreNum = typeof match.homeScore === 'number' ? match.homeScore : 0;
  const awayScoreNum = typeof match.awayScore === 'number' ? match.awayScore : 0;
  const leadDiff = homeScoreNum - awayScoreNum;

  return (
    <div
      id="hero-featured-match"
      onClick={() => onOpenMatch(match.id)}
      className={`cursor-pointer group relative overflow-hidden rounded-none border-0 transition-all duration-500 select-none p-4 sm:p-6 md:p-8 ${
        isLight
          ? 'bg-gradient-to-b from-white via-slate-50 to-slate-100/95 shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)]'
          : 'bg-gradient-to-b from-[#0C1220] via-[#080D18] to-[#050811] shadow-[0_10px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_38px_rgba(0,0,0,0.6)]'
      }`}
    >
      {/* Top Accent Energy Line - Subtle glowing interactive gradient without border */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent group-hover:via-orange-500 group-hover:shadow-[0_0_12px_#FF6500] transition-all duration-500 pointer-events-none" />

      {/* Atmospheric Soft Lighting */}
      <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        isLight
          ? 'bg-orange-500/[0.05] group-hover:bg-orange-500/[0.09]'
          : 'bg-orange-500/[0.07] group-hover:bg-orange-500/[0.12]'
      }`} />
      <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        isLight
          ? 'bg-emerald-500/[0.03] group-hover:bg-emerald-500/[0.06]'
          : 'bg-emerald-500/[0.05] group-hover:bg-emerald-500/[0.09]'
      }`} />

      {/* Subtle Court Texture Grid Overlay */}
      <div className={`absolute inset-0 bg-[size:32px_32px] pointer-events-none opacity-60 ${
        isLight
          ? 'bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)]'
          : 'bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)]'
      }`} />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className={`flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest min-w-0 ${
          isLight ? 'text-orange-600' : 'text-orange-400'
        }`}>
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 animate-pulse fill-orange-500 shrink-0" />
          <span className="truncate">{match.featuredTag || 'CHOC DE LA JOURNÉE • DÔME PALAIS DES SPORTS'}</span>
        </div>

        <div 
          id="hero-live-badge"
          className={`px-2.5 sm:px-3 py-1 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
            isLight
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-red-500/15 text-red-400'
          }`}
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-ping" />
          <span>{match.status}</span>
          {match.statusType === 'live' && <span className="text-red-500 font-black">LIVE</span>}
        </div>
      </div>

      {/* Scoreboard Arena Display */}
      <div className="relative z-10 grid grid-cols-3 items-center text-center my-4 sm:my-7 gap-2 sm:gap-4">
        {/* Home Team */}
        <div className="flex flex-col items-center group/home">
          <div className="relative group-hover:scale-105 transition-transform duration-300 ease-out">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${match.homeTeam.badgeBg} flex items-center justify-center overflow-hidden shadow-lg mb-2 sm:mb-3 group-hover/home:shadow-orange-500/20 transition-all duration-300`}>
              <ClubLogo code={match.homeTeam.code} name={match.homeTeam.name} />
            </div>
          </div>
          <span className={`font-extrabold text-sm sm:text-base md:text-xl transition-colors duration-200 line-clamp-2 px-1 leading-snug ${
            isLight ? 'text-slate-900 group-hover:text-orange-600' : 'text-white group-hover:text-orange-300'
          }`}>
            {match.homeTeam.name}
          </span>
          <span className={`text-[10px] sm:text-xs font-mono mt-1 tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            F: <strong className={isLight ? 'text-slate-700' : 'text-slate-300'}>{match.fouls.home}</strong> • TM: <strong className={isLight ? 'text-slate-700' : 'text-slate-300'}>{match.timeouts.home}</strong>
          </span>
        </div>

        {/* Central High-Impact Score */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2 sm:gap-4 font-mono text-4xl sm:text-6xl md:text-7xl font-black tracking-tight select-none">
            <div className="relative inline-flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={`hero-home-${match.homeScore}`}
                  initial={{ y: -24, opacity: 0, scale: 1.2, filter: 'blur(2px)' }}
                  animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ y: 24, opacity: 0, scale: 0.8, filter: 'blur(2px)', position: 'absolute' }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className={`inline-block transition-all duration-300 ${
                    recentScoreFlash === 'home' 
                      ? 'text-amber-500 scale-110 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]' 
                      : isLight ? 'text-orange-500' : 'text-orange-400'
                  }`}
                >
                  {match.homeScore}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className={`font-light opacity-60 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>:</span>
            <div className="relative inline-flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={`hero-away-${match.awayScore}`}
                  initial={{ y: -24, opacity: 0, scale: 1.2, filter: 'blur(2px)' }}
                  animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ y: 24, opacity: 0, scale: 0.8, filter: 'blur(2px)', position: 'absolute' }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className={`inline-block transition-all duration-300 ${
                    recentScoreFlash === 'away' 
                      ? 'text-emerald-500 scale-110 drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]' 
                      : isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {match.awayScore}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Lead Indicator Tag - Modern Rectilinear */}
          <div className="mt-2 sm:mt-3">
            {leadDiff > 0 ? (
              <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 tracking-wider uppercase inline-block whitespace-nowrap ${
                isLight ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-emerald-400 bg-emerald-500/10'
              }`}>
                +{leadDiff} {match.homeTeam.code || match.homeTeam.name}
              </span>
            ) : leadDiff < 0 ? (
              <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 tracking-wider uppercase inline-block whitespace-nowrap ${
                isLight ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-emerald-400 bg-emerald-500/10'
              }`}>
                +{Math.abs(leadDiff)} {match.awayTeam.code || match.awayTeam.name}
              </span>
            ) : (
              <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 tracking-wider uppercase inline-block ${
                isLight ? 'text-slate-700 bg-slate-100 border border-slate-200' : 'text-slate-300 bg-white/10'
              }`}>
                Égalité
              </span>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center group/away">
          <div className="relative group-hover:scale-105 transition-transform duration-300 ease-out">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${match.awayTeam.badgeBg} flex items-center justify-center overflow-hidden shadow-lg mb-2 sm:mb-3 group-hover/away:shadow-orange-500/20 transition-all duration-300`}>
              <ClubLogo code={match.awayTeam.code} name={match.awayTeam.name} />
            </div>
          </div>
          <span className={`font-extrabold text-sm sm:text-base md:text-xl transition-colors duration-200 line-clamp-2 px-1 leading-snug ${
            isLight ? 'text-slate-900 group-hover:text-orange-600' : 'text-white group-hover:text-orange-300'
          }`}>
            {match.awayTeam.name}
          </span>
          <span className={`text-[10px] sm:text-xs font-mono mt-1 tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            F: <strong className={isLight ? 'text-slate-700' : 'text-slate-300'}>{match.fouls.away}</strong> • TM: <strong className={isLight ? 'text-slate-700' : 'text-slate-300'}>{match.timeouts.away}</strong>
          </span>
        </div>
      </div>

      {/* Quarter Breakdown Matrix - Rectilinear Architectural Layout */}
      <div className={`relative z-10 grid grid-cols-4 gap-0 text-center text-xs py-2.5 sm:py-3.5 font-mono mb-3 sm:mb-4 transition-colors duration-300 ${
        isLight 
          ? 'bg-slate-100/80 hover:bg-slate-200/60 text-slate-800' 
          : 'bg-white/[0.025] hover:bg-white/[0.04] text-slate-200'
      }`}>
        <div className={`border-r px-2 ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
          <span className={`block text-[9px] sm:text-[10px] font-sans font-semibold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Q1</span>
          <span className={`font-bold text-xs sm:text-sm ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{match.periodScores.q1[0]} - {match.periodScores.q1[1]}</span>
        </div>
        <div className={`border-r px-2 ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
          <span className={`block text-[9px] sm:text-[10px] font-sans font-semibold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Q2</span>
          <span className={`font-bold text-xs sm:text-sm ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{match.periodScores.q2[0]} - {match.periodScores.q2[1]}</span>
        </div>
        <div className={`border-r px-2 ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
          <span className={`block text-[9px] sm:text-[10px] font-sans font-semibold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Q3</span>
          <span className={`font-bold text-xs sm:text-sm ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{match.periodScores.q3[0]} - {match.periodScores.q3[1]}</span>
        </div>
        <div className="px-2">
          <span className="text-orange-500 block text-[9px] sm:text-[10px] font-sans font-black tracking-wider uppercase">Q4 LIVE</span>
          <span className="text-orange-500 font-extrabold text-xs sm:text-sm">{match.periodScores.q4[0]} - {match.periodScores.q4[1]}</span>
        </div>
      </div>

      {/* Interactive CTA Bar */}
      <div className={`relative z-10 flex items-center justify-between pt-2 border-t ${isLight ? 'border-slate-200' : 'border-white/[0.04]'}`}>
        <span className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
          Match Center • Box Score
        </span>
        <span className={`text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors duration-200 ${
          isLight ? 'text-orange-600 group-hover:text-orange-700' : 'text-orange-400 group-hover:text-orange-300'
        }`}>
          Détails & Statistiques
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
        </span>
      </div>
    </div>
  );
};
