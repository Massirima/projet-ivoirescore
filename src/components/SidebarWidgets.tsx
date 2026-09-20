import React from 'react';
import { Trophy, Award, ExternalLink } from 'lucide-react';
import { StandingRow, TopScorer } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SidebarWidgetsProps {
  topStandings: StandingRow[];
  topScorers: TopScorer[];
  onNavigateToStandings: () => void;
  onSelectTeam?: (teamName: string) => void;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({
  topStandings,
  topScorers,
  onNavigateToStandings,
  onSelectTeam
}) => {
  const { isLight } = useTheme();

  return (
    <div className="space-y-6">
      {/* Top 5 Standings Preview Widget */}
      <div 
        id="widget-top5-standings"
        className={`${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm hover:border-slate-300'
            : 'bg-slate-900/70 border-white/10 shadow-md hover:border-white/15'
        } backdrop-blur-xl border rounded-3xl p-5 transition`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-black text-sm tracking-wide flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <span className="text-base">🏆</span>
            <span>Top 5 – N1_H FIBB</span>
          </h3>
          <button
            id="btn-standings-complet"
            onClick={onNavigateToStandings}
            className={`text-xs ${
              isLight ? 'text-orange-600 hover:text-orange-700' : 'text-orange-400 hover:text-orange-300'
            } font-extrabold tracking-wide transition flex items-center gap-1 group`}
          >
            COMPLET
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {topStandings.slice(0, 5).map((row) => (
            <div
              key={row.rank}
              onClick={() => onSelectTeam?.(row.team)}
              className={`flex items-center justify-between text-xs py-2 border-b ${
                isLight
                  ? 'border-slate-100 hover:bg-slate-50'
                  : 'border-white/5 hover:bg-white/[0.03]'
              } last:border-0 px-1 rounded-xl cursor-pointer transition`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-lg font-mono font-bold flex items-center justify-center text-[10px] ${
                  row.rank <= 2 
                    ? isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : row.rank <= 4 
                    ? isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400/80' 
                    : isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-slate-400'
                }`}>
                  {row.rank}
                </span>
                <span className={`font-bold ${
                  row.rank === 1 
                    ? (isLight ? 'text-slate-900 font-extrabold' : 'text-white') 
                    : (isLight ? 'text-slate-800' : 'text-slate-200')
                } hover:text-orange-500 transition`}>
                  {row.team}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}>{row.mj} MJ</span>
                <span className={`font-black ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>{row.pts} PTS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Scorers Widget */}
      <div 
        id="widget-top-scorers"
        className={`${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm hover:border-slate-300'
            : 'bg-slate-900/70 border-white/10 shadow-md hover:border-white/15'
        } backdrop-blur-xl border rounded-3xl p-5 transition`}
      >
        <div className="flex items-center justify-between mb-3.5">
          <h3 className={`font-black text-sm flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <span className="text-base">🎖️</span>
            <span>Top Scoréurs (Moy/m)</span>
          </h3>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
            isLight
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
          }`}>
            FIBB 2026
          </span>
        </div>

        <div className="space-y-3">
          {topScorers.map((scorer) => (
            <div
              key={scorer.rank}
              className={`flex items-center justify-between p-3 rounded-2xl border transition group ${
                isLight
                  ? 'bg-slate-50 border-slate-200/70 hover:bg-slate-100/80 hover:border-orange-500/30'
                  : 'bg-white/5 border-white/5 hover:border-orange-500/25'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl font-mono text-xs flex items-center justify-center font-black border ${
                  scorer.rank === 1
                    ? isLight
                      ? 'bg-orange-100 text-orange-700 border-orange-300 ring-1 ring-orange-200'
                      : 'bg-orange-500/20 text-orange-400 border-orange-500/30 ring-1 ring-orange-500/20'
                    : isLight
                      ? 'bg-white text-slate-700 border-slate-200 shadow-2xs'
                      : 'bg-white/5 text-slate-300 border-white/10'
                }`}>
                  {scorer.rank}
                </span>
                <div>
                  <div className={`text-xs font-bold transition ${
                    isLight 
                      ? 'text-slate-900 group-hover:text-orange-600' 
                      : 'text-white group-hover:text-orange-300'
                  }`}>
                    {scorer.name}
                  </div>
                  <div className={`text-[10px] ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
                    {scorer.team} • {scorer.position}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={`font-mono text-base font-extrabold ${
                  isLight ? 'text-orange-600' : 'text-orange-400'
                }`}>
                  {scorer.avgPts}
                </span>
                <span className={`text-[9px] block uppercase font-bold tracking-wider ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  pts/m
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FIBB Official Notice Box */}
      <div 
        id="widget-fibb-notice"
        className={`p-4 rounded-3xl border relative overflow-hidden shadow-sm ${
          isLight
            ? 'bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 border-emerald-200 text-slate-800'
            : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-emerald-500/20 text-slate-300 shadow-lg'
        }`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
        <div className={`flex items-center gap-2 mb-2 font-black text-xs tracking-wide ${
          isLight ? 'text-emerald-800' : 'text-emerald-400'
        }`}>
          <span className="text-base">🏀</span>
          <span>Fédération Ivoirienne de Basketball</span>
        </div>
        <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
          Tous les matchs N1 et N2 sont officiellement homologués par la commission technique FIBB. Retrouvez les feuilles officielles et statistiques FIBA LiveStats.
        </p>
      </div>
    </div>
  );
};
