import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, Search, MapPin, Tag } from 'lucide-react';
import { Team } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { ClubLogo } from '../../components/ClubLogo';

interface TeamsSectionProps {
  teams: Record<string, Team>;
  onAddTeam: (team: Team) => void;
  onUpdateTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
}

export const TeamsSection: React.FC<TeamsSectionProps> = ({
  teams,
  onAddTeam,
  onUpdateTeam,
  onDeleteTeam
}) => {
  const { isLight } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Form fields
  const [teamName, setTeamName] = useState('');
  const [shortName, setShortName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('Abidjan');
  const [badgeBg, setBadgeBg] = useState('from-red-950 to-slate-900');
  const [badgeBorderColor, setBadgeBorderColor] = useState('border-red-500/40');
  const [badgeTextColor, setBadgeTextColor] = useState('text-white');
  const [logoUrl, setLogoUrl] = useState('');

  const teamList: Team[] = Object.values(teams);
  const filteredTeams = teamList.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingTeam(null);
    setTeamName('');
    setShortName('');
    setCode('');
    setCity('Abidjan');
    setBadgeBg('from-orange-950 to-slate-900');
    setBadgeBorderColor('border-orange-500/40');
    setBadgeTextColor('text-orange-400');
    setLogoUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Team) => {
    setEditingTeam(t);
    setTeamName(t.name);
    setShortName(t.shortName);
    setCode(t.code);
    setCity(t.city);
    setBadgeBg(t.badgeBg);
    setBadgeBorderColor(t.badgeBorderColor);
    setBadgeTextColor(t.badgeTextColor);
    setLogoUrl(t.logoUrl || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingTeam ? editingTeam.id : code.toLowerCase().replace(/[^a-z0-9]/g, '');

    const newOrUpdatedTeam: Team = {
      id,
      name: teamName,
      shortName: shortName || teamName,
      code: code.toUpperCase(),
      city,
      badgeBg,
      badgeBorderColor,
      badgeTextColor,
      logoUrl: logoUrl.trim() || undefined
    };

    if (editingTeam) {
      onUpdateTeam(newOrUpdatedTeam);
    } else {
      onAddTeam(newOrUpdatedTeam);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Gestion des Équipes & Clubs
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-orange-500/10 text-orange-500 border border-orange-500/30">
              {teamList.length} Clubs
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Configuration des clubs de basketball FIBB, codes officiels, armoiries et localisations.
          </p>
        </div>

        <button
          id="admin-btn-add-team"
          onClick={handleOpenAdd}
          className="py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une équipe</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
          isLight ? 'text-slate-400' : 'text-slate-500'
        }`} />
        <input
          type="text"
          placeholder="Rechercher par nom, code ou ville..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
              : 'bg-slate-900/80 border-white/10 text-white placeholder:text-slate-500'
          }`}
        />
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className={`p-4 rounded-2xl border transition shadow-sm flex flex-col justify-between ${
              isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-[#0f131a] border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <ClubLogo code={team.code} logoUrl={team.logoUrl} size="md" />
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/30">
                  {team.code}
                </span>
              </div>

              <h3 className="font-black text-sm">{team.name}</h3>
              <div className={`text-xs flex items-center gap-1.5 mt-1 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>{team.city}</span>
              </div>
            </div>

            <div className={`mt-4 pt-3 border-t flex items-center justify-between ${
              isLight ? 'border-slate-100' : 'border-white/5'
            }`}>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                ID: {team.id}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(team)}
                  className={`p-1.5 rounded-lg border transition ${
                    isLight ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Modifier l'équipe"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer l'équipe ${team.name} ?`)) {
                      onDeleteTeam(team.id);
                    }
                  }}
                  className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition"
                  title="Supprimer l'équipe"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Team */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <h3 className="text-base font-black tracking-tight">
                {editingTeam ? "Modifier l'Équipe" : "Ajouter une Équipe"}
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
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Nom Complet</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Ex: ABC Fighters"
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Code Trigrame</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ABC"
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono uppercase ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Ville</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Abidjan"
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">URL Logo Vectoriel (Optionnel)</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/assets/mon-logo.svg"
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                  }`}
                />
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
                  {editingTeam ? 'Enregistrer' : 'Créer le club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
