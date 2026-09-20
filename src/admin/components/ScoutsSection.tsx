import React, { useState } from 'react';
import { Radio, UserPlus, Key, Shield, CheckCircle, AlertCircle, Copy, Check, Search, Trash2, Edit3, Smartphone, ExternalLink } from 'lucide-react';
import { ScoutUser, Match } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ScoutsSectionProps {
  scouts: ScoutUser[];
  matches: Match[];
  onAddScout: (newScout: Omit<ScoutUser, 'id' | 'createdAt' | 'apiKey'>) => void;
  onUpdateScout: (updatedScout: ScoutUser) => void;
  onDeleteScout: (scoutId: string) => void;
}

export const ScoutsSection: React.FC<ScoutsSectionProps> = ({
  scouts,
  matches,
  onAddScout,
  onUpdateScout,
  onDeleteScout
}) => {
  const { isLight } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScout, setEditingScout] = useState<ScoutUser | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedMatchId, setAssignedMatchId] = useState('');
  const [role, setRole] = useState<'scout_lead' | 'scout_operator' | 'scout_assistant'>('scout_operator');
  const [status, setStatus] = useState<'active' | 'inactive' | 'on_duty'>('active');

  const filteredScouts = scouts.filter((scout) =>
    scout.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scout.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (scout.assignedMatchLabel && scout.assignedMatchLabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAddModal = () => {
    setEditingScout(null);
    setFullName('');
    setUsername(`scout.${Math.floor(100 + Math.random() * 900)}`);
    setEmail('');
    setPhone('');
    setAssignedMatchId(matches[0]?.id || '');
    setRole('scout_operator');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (scout: ScoutUser) => {
    setEditingScout(scout);
    setFullName(scout.fullName);
    setUsername(scout.username);
    setEmail(scout.email);
    setPhone(scout.phone || '');
    setAssignedMatchId(scout.assignedMatchId || '');
    setRole(scout.role);
    setStatus(scout.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedMatch = matches.find((m) => m.id === assignedMatchId);
    const assignedMatchLabel = assignedMatch 
      ? `${assignedMatch.homeTeam.shortName} vs ${assignedMatch.awayTeam.shortName} (${assignedMatch.leagueId.toUpperCase()})` 
      : 'Aucun match assigné';

    if (editingScout) {
      onUpdateScout({
        ...editingScout,
        fullName,
        username,
        email,
        phone,
        assignedMatchId,
        assignedMatchLabel,
        role,
        status
      });
    } else {
      onAddScout({
        fullName,
        username,
        email,
        phone,
        assignedMatchId,
        assignedMatchLabel,
        role,
        status
      });
    }
    setIsModalOpen(false);
  };

  const copyApiKey = (apiKey: string, id: string) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Fournisseurs d'accès & Scouts Live
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-orange-500/10 text-orange-500 border border-orange-500/30">
              {scouts.length} Opérateurs
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Gérez les identifiants des scouts de terrain chargés de transmettre les scores et événements en direct (Application Scout FIBB).
          </p>
        </div>

        <button
          id="admin-btn-add-scout"
          onClick={handleOpenAddModal}
          className="py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Créer un compte Scout</span>
        </button>
      </div>

      {/* Information Banner on upcoming Scout App */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        isLight ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
      }`}>
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Passerelle Scout Live :</span> Les scouts utilisent l'application mobile terrain pour pousser paniers, fautes, rebonds et temps-morts. Leurs données alimentent instantanément le tableau public des matchs et sont prêtes à être persistées dans PostgreSQL.
          </div>
        </div>
        <div className="shrink-0 font-mono text-[11px] font-bold px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-center">
          Prochaine Page : Application Scout
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <input
            type="text"
            placeholder="Rechercher par nom, identifiant ou match assigné..."
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

      {/* Scouts Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/10'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-mono font-bold uppercase tracking-wider ${
                isLight ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-white/[0.02] text-slate-400 border-white/10'
              }`}>
                <th className="py-3 px-4">Scout / Opérateur</th>
                <th className="py-3 px-4">Match Assigné</th>
                <th className="py-3 px-4">Rôle</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Clé de Diffusion</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
              {filteredScouts.map((scout) => (
                <tr key={scout.id} className={`transition ${
                  isLight ? 'hover:bg-slate-50/80' : 'hover:bg-white/[0.02]'
                }`}>
                  {/* Name + Username */}
                  <td className="py-3 px-4">
                    <div className="font-bold flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-orange-500/15 text-orange-500 border border-orange-500/30 flex items-center justify-center font-black text-xs">
                        {scout.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className={isLight ? 'text-slate-900' : 'text-white'}>{scout.fullName}</div>
                        <div className={`text-[11px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                          @{scout.username} • {scout.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Match assignment */}
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-md text-[11px] font-medium border ${
                      isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-slate-300'
                    }`}>
                      {scout.assignedMatchLabel || 'Aucun match assigné'}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    <span className="text-xs font-mono font-bold capitalize">
                      {scout.role === 'scout_lead' ? 'Chef Scout' : scout.role === 'scout_operator' ? 'Opérateur Live' : 'Assistant'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      scout.status === 'on_duty'
                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                        : scout.status === 'active'
                        ? 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                        : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        scout.status === 'on_duty' ? 'bg-emerald-500 animate-pulse' : scout.status === 'active' ? 'bg-blue-500' : 'bg-slate-400'
                      }`} />
                      {scout.status === 'on_duty' ? 'En Direct' : scout.status === 'active' ? 'Prêt / Actif' : 'Inactif'}
                    </span>
                  </td>

                  {/* API Key */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => copyApiKey(scout.apiKey, scout.id)}
                      className={`px-2 py-1 rounded border text-[11px] font-mono flex items-center gap-1.5 transition ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                      title="Copier le jeton d'authentification Scout"
                    >
                      <Key className="w-3 h-3 text-orange-500" />
                      <span>{scout.apiKey.slice(0, 12)}...</span>
                      {copiedKeyId === scout.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(scout)}
                        className={`p-1.5 rounded-lg border transition ${
                          isLight ? 'border-slate-200 text-slate-600 hover:bg-slate-100' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                        title="Modifier le compte scout"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer le compte de scout de ${scout.fullName} ?`)) {
                            onDeleteScout(scout.id);
                          }
                        }}
                        className={`p-1.5 rounded-lg border transition text-red-500 ${
                          isLight ? 'border-red-200 hover:bg-red-50' : 'border-red-500/20 hover:bg-red-500/10'
                        }`}
                        title="Supprimer le scout"
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

      {/* Modal Add / Edit Scout */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-inherit">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-500" />
                <span>{editingScout ? 'Modifier le Compte Scout' : 'Nouveau Compte Scout Terrain'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Bakary Diabaté"
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Identifiant (login)</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="scout.abidjan"
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scout@fibb.ci"
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 07 00 00 00 00"
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Match Assigné en Direct</label>
                <select
                  value={assignedMatchId}
                  onChange={(e) => setAssignedMatchId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                  }`}
                >
                  <option value="">-- Aucun match assigné pour le moment --</option>
                  {matches.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.homeTeam.shortName} vs {m.awayTeam.shortName} ({m.leagueId.toUpperCase()} • {m.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Rôle d'opérateur</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  >
                    <option value="scout_lead">Chef Scout / Lead</option>
                    <option value="scout_operator">Opérateur Match Live</option>
                    <option value="scout_assistant">Assistant Statistique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Statut d'activité</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  >
                    <option value="active">Actif & Autorisé</option>
                    <option value="on_duty">En mission / Sur le terrain</option>
                    <option value="inactive">Suspendu / Inactif</option>
                  </select>
                </div>
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
                  {editingScout ? 'Enregistrer les modifications' : 'Créer le compte Scout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
