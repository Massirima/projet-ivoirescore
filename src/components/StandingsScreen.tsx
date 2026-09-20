import React, { useState } from 'react';
import { Search, Trophy, Shield, AlertTriangle, ArrowUpDown, ChevronRight } from 'lucide-react';
import { StandingRow } from '../types';
import { useTheme } from '../context/ThemeContext';

interface StandingsScreenProps {
  standings: StandingRow[];
  onSelectTeam?: (teamName: string) => void;
}

export const StandingsScreen: React.FC<StandingsScreenProps> = ({
  standings,
  onSelectTeam
}) => {
  const { isLight } = useTheme();
  const [activeCategory, setActiveCategory] = useState<'n1' | 'n2' | 'coupe'>('n1');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStandings = standings.filter(row => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.team.toLowerCase().includes(q) ||
      (row.note && row.note.toLowerCase().includes(q)) ||
      row.code.toLowerCase().includes(q)
    );
  });

  return (
    <div id="screen-classements" className="space-y-6">
      {/* League Category Selector & Search */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl border backdrop-blur-xl ${
        isLight
          ? 'bg-white/95 border-slate-200/90 shadow-sm'
          : 'bg-slate-900/60 border-white/10 shadow-xl'
      }`}>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            id="tab-league-n1"
            onClick={() => setActiveCategory('n1')}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all ${
              activeCategory === 'n1'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/70'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            N1_H FIBB (12 Équipes)
          </button>
          <button
            id="tab-league-n2"
            onClick={() => setActiveCategory('n2')}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all ${
              activeCategory === 'n2'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/70'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            N2_H FIBB (12 Équipes)
          </button>
          <button
            id="tab-league-coupe"
            onClick={() => setActiveCategory('coupe')}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all ${
              activeCategory === 'coupe'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : isLight
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/70'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            Coupe Nationale
          </button>
        </div>

        <div className="relative w-full sm:w-auto">
          <input
            id="search-standings"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Chercher un club..."
            className={`w-full sm:w-64 text-xs pl-9 pr-4 py-2 rounded-xl border focus:outline-none focus:border-orange-500 transition ${
              isLight
                ? 'bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400 focus:bg-white'
                : 'bg-white/5 text-slate-200 border-white/10 placeholder:text-slate-500 shadow-inner'
            }`}
          />
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
            isLight ? 'text-slate-400' : 'text-slate-400'
          }`} />
        </div>
      </div>

      {/* Legend */}
      <div className={`flex flex-wrap items-center gap-4 text-xs px-2 font-medium ${
        isLight ? 'text-slate-600' : 'text-slate-400'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/60"></span>
          <span>Places 1-4: Playoffs Titre</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}></span>
          <span>Places 5-10: Maintien assuré</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/60"></span>
          <span>Places 11-12: Zone Barrages / Relégation</span>
        </div>
      </div>

      {/* Standings Table Container */}
      <div className={`backdrop-blur-xl border rounded-3xl p-6 overflow-x-auto ${
        isLight
          ? 'bg-white border-slate-200/90 shadow-sm'
          : 'bg-slate-900/70 border-white/10 shadow-2xl'
      }`}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b font-black uppercase tracking-wider text-[11px] ${
              isLight ? 'border-slate-200 text-slate-700' : 'border-white/10 text-slate-400'
            }`}>
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Équipe</th>
              <th className="py-3 px-3 text-center">MJ</th>
              <th className={`py-3 px-3 text-center ${isLight ? 'text-emerald-700 font-black' : 'text-emerald-400'}`}>V</th>
              <th className={`py-3 px-3 text-center ${isLight ? 'text-red-700 font-black' : 'text-red-400'}`}>D</th>
              <th className="py-3 px-3 text-center">PP</th>
              <th className="py-3 px-3 text-center">PC</th>
              <th className="py-3 px-3 text-center">+/-</th>
              <th className={`py-3 px-3 text-center font-black text-sm ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>PTS</th>
              <th className="py-3 px-3 text-center">5 Derniers Matchs</th>
            </tr>
          </thead>
          <tbody id="standings-tbody" className={`divide-y font-mono ${
            isLight ? 'divide-slate-100' : 'divide-white/5'
          }`}>
            {filteredStandings.length === 0 ? (
              <tr>
                <td colSpan={10} className={`py-8 text-center font-sans ${
                  isLight ? 'text-slate-500 font-medium' : 'text-slate-500'
                }`}>
                  Aucun club trouvé pour "{searchQuery}"
                </td>
              </tr>
            ) : (
              filteredStandings.map((r) => {
                const isPlayoff = r.rank <= 4;
                const isRelegation = r.rank >= 11;

                return (
                  <tr
                    key={r.rank}
                    onClick={() => onSelectTeam?.(r.team)}
                    className={`transition cursor-pointer group ${
                      isLight ? 'hover:bg-slate-50/80' : 'hover:bg-white/[0.04]'
                    } ${
                      isPlayoff
                        ? (isLight ? 'bg-emerald-50/40' : 'bg-emerald-500/[0.03]')
                        : isRelegation
                        ? (isLight ? 'bg-red-50/40' : 'bg-red-500/[0.03]')
                        : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isPlayoff
                            ? isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/35'
                            : isRelegation
                            ? isLight ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-red-500/20 text-red-400 border border-red-500/35'
                            : isLight ? 'text-slate-700 bg-slate-100' : 'text-slate-400 bg-white/5'
                        }`}
                      >
                        {r.rank}
                      </span>
                    </td>

                    {/* Team */}
                    <td className={`py-3.5 px-3 font-sans font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`transition ${
                          isLight ? 'group-hover:text-orange-600' : 'group-hover:text-orange-400'
                        }`}>{r.team}</span>
                      </div>
                      {r.note && (
                        <div className={`text-[9px] font-normal mt-0.5 tracking-wide uppercase ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {r.note}
                        </div>
                      )}
                    </td>

                    {/* Stats */}
                    <td className={`py-3.5 px-3 text-center ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>{r.mj}</td>
                    <td className={`py-3.5 px-3 text-center font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{r.v}</td>
                    <td className={`py-3.5 px-3 text-center font-bold ${isLight ? 'text-red-700' : 'text-red-400'}`}>{r.d}</td>
                    <td className={`py-3.5 px-3 text-center ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{r.pp}</td>
                    <td className={`py-3.5 px-3 text-center ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{r.pc}</td>
                    <td className={`py-3.5 px-3 text-center font-bold ${
                      r.diff.startsWith('+') 
                        ? (isLight ? 'text-emerald-700' : 'text-emerald-400') 
                        : (isLight ? 'text-red-700' : 'text-red-400')
                    }`}>
                      {r.diff}
                    </td>

                    {/* Points */}
                    <td className={`py-3.5 px-3 text-center font-black text-sm ${
                      isLight ? 'text-orange-600 bg-orange-50' : 'text-orange-400 bg-orange-500/5'
                    }`}>
                      {r.pts}
                    </td>

                    {/* Form */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center justify-center gap-1">
                        {r.form.map((f, i) => (
                          <span
                            key={i}
                            className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                              f === 'V'
                                ? isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : isLight ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                            title={f === 'V' ? 'Victoire' : 'Défaite'}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
