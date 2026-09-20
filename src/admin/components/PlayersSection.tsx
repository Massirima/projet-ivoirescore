import React, { useState } from 'react';
import { Plus, Edit2, Trash2, User, Search, Filter } from 'lucide-react';
import { PlayerStat, Team } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { MATCH_PLAYERS_BOX } from '../../data/mockData';

interface PlayersSectionProps {
  teams: Record<string, Team>;
}

export const PlayersSection: React.FC<PlayersSectionProps> = ({ teams }) => {
  const { isLight } = useTheme();
  const [players, setPlayers] = useState<PlayerStat[]>(MATCH_PLAYERS_BOX);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerStat | null>(null);

  // Form
  const [name, setName] = useState('');
  const [number, setNumber] = useState(10);
  const [position, setPosition] = useState('Arrière');
  const [teamId, setTeamId] = useState('abc');
  const [flag, setFlag] = useState('🇨🇮');
  const [pts, setPts] = useState(14);
  const [reb, setReb] = useState(5);
  const [ast, setAst] = useState(4);
  const [isStarter, setIsStarter] = useState(true);

  const teamList: Team[] = Object.values(teams);

  const filteredPlayers = players.filter((p) => {
    if (selectedTeamId !== 'all' && p.teamId !== selectedTeamId) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || String(p.number).includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingPlayer(null);
    setName('');
    setNumber(Math.floor(Math.random() * 90) + 1);
    setPosition('Meneur');
    setTeamId(teamList[0]?.id || 'abc');
    setFlag('🇨🇮');
    setPts(12);
    setReb(4);
    setAst(3);
    setIsStarter(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: PlayerStat) => {
    setEditingPlayer(p);
    setName(p.name);
    setNumber(p.number);
    setPosition(p.position);
    setTeamId(p.teamId);
    setFlag(p.flag);
    setPts(p.pts);
    setReb(p.reb);
    setAst(p.ast);
    setIsStarter(p.isStarter);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teamObj = teams[teamId] || teamList[0];

    if (editingPlayer) {
      setPlayers(players.map((p) =>
        p.id === editingPlayer.id
          ? {
              ...p,
              name,
              number,
              position,
              teamId,
              team: teamObj.name,
              flag,
              pts,
              reb,
              ast,
              isStarter
            }
          : p
      ));
    } else {
      const newP: PlayerStat = {
        id: `player-${Date.now()}`,
        name,
        number,
        position,
        teamId,
        team: teamObj.name,
        flag,
        pts,
        reb,
        ast,
        stl: 1,
        blk: 0,
        min: 24,
        fg: '5/10',
        threePt: '2/4',
        ft: '2/2',
        fouls: 2,
        isStarter
      };
      setPlayers([newP, ...players]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce joueur de l'effectif ?")) {
      setPlayers(players.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Effectifs & Gestion des Joueurs
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-orange-500/10 text-orange-500 border border-orange-500/30">
              {players.length} Joueurs
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Fiches sportives des athlètes, numéros de maillots, postes et statistiques individuelles.
          </p>
        </div>

        <button
          id="admin-btn-add-player"
          onClick={handleOpenAdd}
          className="py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un joueur</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm border ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/10 text-white'
            }`}
          >
            <option value="all">Tous les clubs</option>
            {teamList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative min-w-[240px]">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <input
            type="text"
            placeholder="Nom ou numéro de maillot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                : 'bg-slate-900/80 border-white/10 text-white placeholder:text-slate-500'
            }`}
          />
        </div>
      </div>

      {/* Players Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/10'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-mono font-bold uppercase tracking-wider ${
                isLight ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-white/[0.02] text-slate-400 border-white/10'
              }`}>
                <th className="py-3 px-4">Joueur</th>
                <th className="py-3 px-4">Club</th>
                <th className="py-3 px-4">Poste</th>
                <th className="py-3 px-4">Statut 5 Majeur</th>
                <th className="py-3 px-4 font-mono">PTS</th>
                <th className="py-3 px-4 font-mono">REB</th>
                <th className="py-3 px-4 font-mono">AST</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
              {filteredPlayers.map((p) => (
                <tr key={p.id} className={`transition ${
                  isLight ? 'hover:bg-slate-50/80' : 'hover:bg-white/[0.02]'
                }`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/30 flex items-center justify-center font-mono font-black text-xs">
                        #{p.number}
                      </div>
                      <div>
                        <div className="font-bold">{p.name} {p.flag}</div>
                        <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                          ID: {p.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-medium">
                    {p.team}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-xs">{p.position}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.isStarter
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {p.isStarter ? 'Titulaire' : 'Banc'}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-orange-500">{p.pts}</td>
                  <td className="py-3 px-4 font-mono">{p.reb}</td>
                  <td className="py-3 px-4 font-mono">{p.ast}</td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className={`p-1.5 rounded-lg border transition ${
                          isLight ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                        title="Modifier le joueur"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition"
                        title="Supprimer le joueur"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Player */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <h3 className="text-base font-black tracking-tight">
                {editingPlayer ? 'Modifier le Joueur' : 'Nouveau Joueur'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Nom & Prénom</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Stéphane Dieng"
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Numéro Maillot</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="99"
                    value={number}
                    onChange={(e) => setNumber(parseInt(e.target.value, 10) || 0)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Poste de Jeu</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  >
                    <option value="Meneur">Meneur (Point Guard)</option>
                    <option value="Arrière">Arrière (Shooting Guard)</option>
                    <option value="Ailier">Ailier (Small Forward)</option>
                    <option value="Ailier Fort">Ailier Fort (Power Forward)</option>
                    <option value="Pivot">Pivot (Center)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Club Assigné</label>
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                  }`}
                >
                  {teamList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Points (Moy)</label>
                  <input
                    type="number"
                    min="0"
                    value={pts}
                    onChange={(e) => setPts(parseInt(e.target.value, 10) || 0)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Rebonds</label>
                  <input
                    type="number"
                    min="0"
                    value={reb}
                    onChange={(e) => setReb(parseInt(e.target.value, 10) || 0)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Passes Déc.</label>
                  <input
                    type="number"
                    min="0"
                    value={ast}
                    onChange={(e) => setAst(parseInt(e.target.value, 10) || 0)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="starter-player-chk"
                  type="checkbox"
                  checked={isStarter}
                  onChange={(e) => setIsStarter(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500"
                />
                <label htmlFor="starter-player-chk" className="text-xs font-bold cursor-pointer">
                  Membre du 5 Majeur (Titulaire)
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold transition hover:bg-white/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black tracking-wide shadow-md transition"
                >
                  {editingPlayer ? 'Enregistrer' : 'Créer le joueur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
