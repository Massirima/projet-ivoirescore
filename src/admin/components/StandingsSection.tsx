import React, { useState } from 'react';
import { Trophy, Edit2, RefreshCw, CheckCircle2, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { StandingRow } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { STANDINGS_N1 } from '../../data/mockData';

export const StandingsSection: React.FC = () => {
  const { isLight } = useTheme();
  const [standings, setStandings] = useState<StandingRow[]>(STANDINGS_N1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<StandingRow | null>(null);

  // Form
  const [rank, setRank] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [mj, setMj] = useState(14);
  const [v, setV] = useState(12);
  const [d, setD] = useState(2);
  const [pp, setPp] = useState(1150);
  const [pc, setPc] = useState(990);
  const [pts, setPts] = useState(26);
  const [zone, setZone] = useState<'playoff' | 'mid' | 'relegation'>('playoff');
  const [note, setNote] = useState('');

  const handleOpenEdit = (row: StandingRow) => {
    setEditingRow(row);
    setRank(row.rank);
    setTeamName(row.team);
    setMj(row.mj);
    setV(row.v);
    setD(row.d);
    setPp(row.pp);
    setPc(row.pc);
    setPts(row.pts);
    setZone(row.zone);
    setNote(row.note || '');
    setIsEditModalOpen(true);
  };

  // Auto calculate FIBB basketball points: Win = 2 pts, Loss = 1 pt (ou 0 si forfait)
  const handleAutoCalculate = () => {
    setStandings(
      standings
        .map((row) => {
          const calculatedPts = row.v * 2 + row.d;
          const diffNumber = row.pp - row.pc;
          const diffStr = diffNumber > 0 ? `+${diffNumber}` : `${diffNumber}`;
          return {
            ...row,
            pts: calculatedPts,
            diff: diffStr
          };
        })
        .sort((a, b) => b.pts - a.pts || (b.pp - b.pc) - (a.pp - a.pc))
        .map((row, index) => ({
          ...row,
          rank: index + 1,
          zone: index < 4 ? 'playoff' : index >= standings.length - 2 ? 'relegation' : 'mid'
        }))
    );
  };

  const handleSaveRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;

    const diffNumber = pp - pc;
    const diffStr = diffNumber > 0 ? `+${diffNumber}` : `${diffNumber}`;

    setStandings(
      standings.map((r) =>
        r.code === editingRow.code
          ? {
              ...r,
              rank,
              mj,
              v,
              d,
              pp,
              pc,
              diff: diffStr,
              pts,
              zone,
              note: note.trim() || undefined
            }
          : r
      )
    );
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Gestion des Classements Officiels
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-orange-500/10 text-orange-500 border border-orange-500/30">
              N1_H Élite
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Ajustez les victoires/défaites, les points marqués, les zones de playoffs et appliquez les règles de calculs FIBB.
          </p>
        </div>

        <button
          id="admin-btn-recalc-standings"
          onClick={handleAutoCalculate}
          className="py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          title="Recalcule les points (V=2, D=1) et ordonne le tableau"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Recalculer & Trier le Classement</span>
        </button>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/10'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-mono font-bold uppercase tracking-wider ${
                isLight ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-white/[0.02] text-slate-400 border-white/10'
              }`}>
                <th className="py-3 px-3 text-center">Rang</th>
                <th className="py-3 px-4">Équipe / Club</th>
                <th className="py-3 px-3 text-center font-mono">MJ</th>
                <th className="py-3 px-3 text-center font-mono text-emerald-500">V</th>
                <th className="py-3 px-3 text-center font-mono text-red-500">D</th>
                <th className="py-3 px-3 text-center font-mono">PP</th>
                <th className="py-3 px-3 text-center font-mono">PC</th>
                <th className="py-3 px-3 text-center font-mono">DIFF</th>
                <th className="py-3 px-3 text-center font-mono font-black text-orange-500">PTS</th>
                <th className="py-3 px-3">Zone</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
              {standings.map((row) => (
                <tr key={row.code} className={`transition ${
                  isLight ? 'hover:bg-slate-50/80' : 'hover:bg-white/[0.02]'
                }`}>
                  <td className="py-3 px-3 text-center font-mono font-black">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                      row.rank <= 4
                        ? 'bg-orange-500/15 text-orange-500 font-black'
                        : row.zone === 'relegation'
                        ? 'bg-red-500/15 text-red-500'
                        : isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      {row.rank}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-orange-500">{row.code}</span>
                      <span>{row.team}</span>
                    </div>
                    {row.note && (
                      <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-0.5">
                        {row.note}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3 text-center font-mono">{row.mj}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-500">{row.v}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-red-400">{row.d}</td>
                  <td className="py-3 px-3 text-center font-mono">{row.pp}</td>
                  <td className="py-3 px-3 text-center font-mono">{row.pc}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold">{row.diff}</td>
                  <td className="py-3 px-3 text-center font-mono font-black text-base text-orange-500">{row.pts}</td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      row.zone === 'playoff'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : row.zone === 'relegation'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                    }`}>
                      {row.zone === 'playoff' ? 'Playoffs' : row.zone === 'relegation' ? 'Relégation' : 'Maintien'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(row)}
                      className={`p-1.5 rounded-lg border transition ${
                        isLight ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                      title="Modifier les statistiques de l'équipe"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Standings Row */}
      {isEditModalOpen && editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <h3 className="text-base font-black tracking-tight">
                Modifier le Rang : {editingRow.team} ({editingRow.code})
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRow} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Rang</label>
                  <input
                    type="number"
                    min="1"
                    value={rank}
                    onChange={(e) => setRank(parseInt(e.target.value, 10) || 1)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Matchs Joués</label>
                  <input
                    type="number"
                    min="0"
                    value={mj}
                    onChange={(e) => setMj(parseInt(e.target.value, 10) || 0)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Points (PTS)</label>
                  <input
                    type="number"
                    min="0"
                    value={pts}
                    onChange={(e) => setPts(parseInt(e.target.value, 10) || 0)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono font-black text-orange-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-emerald-500">Victoires (V)</label>
                  <input
                    type="number"
                    min="0"
                    value={v}
                    onChange={(e) => {
                      const newV = parseInt(e.target.value, 10) || 0;
                      setV(newV);
                      setPts(newV * 2 + d);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-red-500">Défaites (D)</label>
                  <input
                    type="number"
                    min="0"
                    value={d}
                    onChange={(e) => {
                      const newD = parseInt(e.target.value, 10) || 0;
                      setD(newD);
                      setPts(v * 2 + newD);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Points Pour (PP)</label>
                  <input
                    type="number"
                    min="0"
                    value={pp}
                    onChange={(e) => setPp(parseInt(e.target.value, 10) || 0)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Points Contre (PC)</label>
                  <input
                    type="number"
                    min="0"
                    value={pc}
                    onChange={(e) => setPc(parseInt(e.target.value, 10) || 0)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Zone Tableau</label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                  }`}
                >
                  <option value="playoff">Zone Playoffs (Top 4)</option>
                  <option value="mid">Maintien Assuré</option>
                  <option value="relegation">Zone Relégation N2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Note / Distinctions</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: LEADER • DÉFENSE #1"
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                  }`}
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold transition hover:bg-white/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black tracking-wide shadow-md transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
