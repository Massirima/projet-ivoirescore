import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Flame, Clock, Radio, Search, Filter, AlertTriangle, Calendar, Layers, Shield } from 'lucide-react';
import { Match, Team, PlayByPlayEvent } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { ClubLogo } from '../../components/ClubLogo';

interface MatchsSectionProps {
  matches: Match[];
  teams: Record<string, Team>;
  onAddMatch: (match: Match) => void;
  onUpdateMatch: (match: Match) => void;
  onDeleteMatch: (matchId: string) => void;
  onValidateFinalScore: (matchId: string) => void;
}

export const MatchsSection: React.FC<MatchsSectionProps> = ({
  matches,
  teams,
  onAddMatch,
  onUpdateMatch,
  onDeleteMatch,
  onValidateFinalScore
}) => {
  const { isLight } = useTheme();
  const [filterType, setFilterType] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<'all' | 'n1' | 'n2'>('all');

  // Modals state
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [activeEventsMatch, setActiveEventsMatch] = useState<Match | null>(null);

  // Match Form state
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [leagueId, setLeagueId] = useState<'n1' | 'n2'>('n1');
  const [venue, setVenue] = useState('Dôme Palais des Sports, Treichville');
  const [city, setCity] = useState('Abidjan');
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [statusType, setStatusType] = useState<'live' | 'upcoming' | 'finished'>('upcoming');
  const [statusText, setStatusText] = useState('20:00 Demain');
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredTag, setFeaturedTag] = useState('');

  // Sample play-by-play event state for modal
  const [sampleEvents, setSampleEvents] = useState<PlayByPlayEvent[]>([
    {
      id: 'pbe-1',
      time: '02:45',
      quarter: 'Q4',
      teamId: 'abc',
      teamName: 'ABC Fighters',
      text: 'Panier crucial à mi-distance de S. Dieng',
      type: 'score',
      currentScore: '98 - 94'
    },
    {
      id: 'pbe-2',
      time: '03:12',
      quarter: 'Q4',
      teamId: 'jca',
      teamName: 'JCA Abidjan',
      text: 'Faute personnelle de A. Konontsuk sur pénétration',
      type: 'foul',
      currentScore: '96 - 94'
    }
  ]);
  const [newEventText, setNewEventText] = useState('');
  const [newEventType, setNewEventType] = useState<'score' | 'foul' | 'timeout' | 'sub'>('score');

  const teamList: Team[] = Object.values(teams);

  // Filtered matches
  const filteredMatches = matches.filter((m) => {
    if (filterType !== 'all' && m.statusType !== filterType) return false;
    if (selectedLeague !== 'all' && m.leagueId !== selectedLeague) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.homeTeam.name.toLowerCase().includes(q) ||
        m.awayTeam.name.toLowerCase().includes(q) ||
        m.venue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingMatch(null);
    setHomeTeamId(teamList[0]?.id || '');
    setAwayTeamId(teamList[1]?.id || '');
    setLeagueId('n1');
    setVenue('Dôme Palais des Sports, Treichville');
    setCity('Abidjan');
    setHomeScore(0);
    setAwayScore(0);
    setStatusType('upcoming');
    setStatusText('21:30 Ce soir');
    setIsFeatured(false);
    setFeaturedTag('CHOC DE LA JOURNÉE');
    setIsMatchModalOpen(true);
  };

  const handleOpenEditModal = (match: Match) => {
    setEditingMatch(match);
    setHomeTeamId(match.homeTeam.id);
    setAwayTeamId(match.awayTeam.id);
    setLeagueId((match.leagueId as 'n1' | 'n2') || 'n1');
    setVenue(match.venue);
    setCity(match.city);
    setHomeScore(typeof match.homeScore === 'number' ? match.homeScore : 0);
    setAwayScore(typeof match.awayScore === 'number' ? match.awayScore : 0);
    setStatusType(match.statusType);
    setStatusText(match.status);
    setIsFeatured(!!match.isFeatured);
    setFeaturedTag(match.featuredTag || '');
    setIsMatchModalOpen(true);
  };

  const handleSaveMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const homeTeam = teams[homeTeamId] || teamList[0];
    const awayTeam = teams[awayTeamId] || teamList[1];

    if (editingMatch) {
      onUpdateMatch({
        ...editingMatch,
        leagueId,
        leagueName: leagueId === 'n1' ? "CÔTE D'IVOIRE: N1_H FIBB" : "CÔTE D'IVOIRE: N2_H FIBB",
        homeTeam,
        awayTeam,
        homeScore: statusType === 'upcoming' ? '-' : homeScore,
        awayScore: statusType === 'upcoming' ? '-' : awayScore,
        status: statusText,
        statusType,
        venue,
        city,
        isFeatured,
        featuredTag: isFeatured ? featuredTag : undefined
      });
    } else {
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        leagueId,
        leagueName: leagueId === 'n1' ? "CÔTE D'IVOIRE: N1_H FIBB" : "CÔTE D'IVOIRE: N2_H FIBB",
        leagueSub: 'Journée 15',
        homeTeam,
        awayTeam,
        homeScore: statusType === 'upcoming' ? '-' : homeScore,
        awayScore: statusType === 'upcoming' ? '-' : awayScore,
        status: statusText,
        statusType,
        venue,
        city,
        fouls: { home: '0/5', away: '0/5' },
        timeouts: { home: 3, away: 3 },
        periodScores: {
          q1: [0, 0],
          q2: [0, 0],
          q3: [0, 0],
          q4: [0, 0]
        },
        isFeatured,
        featuredTag: isFeatured ? featuredTag : undefined
      };
      onAddMatch(newMatch);
    }
    setIsMatchModalOpen(false);
  };

  const handleOpenEventsModal = (match: Match) => {
    setActiveEventsMatch(match);
    setIsEventsModalOpen(true);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventText.trim() || !activeEventsMatch) return;

    const newEv: PlayByPlayEvent = {
      id: `pbe-${Date.now()}`,
      time: '01:30',
      quarter: 'Q4',
      teamId: activeEventsMatch.homeTeam.id,
      teamName: activeEventsMatch.homeTeam.shortName,
      text: newEventText,
      type: newEventType,
      currentScore: `${activeEventsMatch.homeScore} - ${activeEventsMatch.awayScore}`
    };

    setSampleEvents([newEv, ...sampleEvents]);
    setNewEventText('');
  };

  const handleDeleteEvent = (id: string) => {
    setSampleEvents(sampleEvents.filter((ev) => ev.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Gestion des Matchs & Rencontres
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-orange-500/10 text-orange-500 border border-orange-500/30">
              {matches.length} Matchs
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Créez des rencontres, modifiez les scores en direct, validez les scores finaux ou éditez les faits de jeu.
          </p>
        </div>

        <button
          id="admin-btn-add-match"
          onClick={handleOpenAddModal}
          className="py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une rencontre</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter pills */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'
          }`}>
            {(['all', 'live', 'upcoming', 'finished'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition capitalize ${
                  filterType === type
                    ? 'bg-orange-500 text-white shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'Tous' : type === 'live' ? 'En Direct' : type === 'upcoming' ? 'À Venir' : 'Terminés'}
              </button>
            ))}
          </div>

          {/* League filter */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'
          }`}>
            <button
              onClick={() => setSelectedLeague('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedLeague === 'all'
                  ? 'bg-slate-800 text-white dark:bg-white/20'
                  : isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Toutes ligues
            </button>
            <button
              onClick={() => setSelectedLeague('n1')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedLeague === 'n1'
                  ? 'bg-orange-500 text-white'
                  : isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              N1_H FIBB
            </button>
            <button
              onClick={() => setSelectedLeague('n2')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedLeague === 'n2'
                  ? 'bg-orange-500 text-white'
                  : isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              N2_H
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <input
            type="text"
            placeholder="Chercher une équipe, salle..."
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

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className={`rounded-2xl border p-4 sm:p-5 transition shadow-sm relative overflow-hidden ${
              isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-[#0f131a] border-white/10 hover:border-white/20'
            }`}
          >
            {/* Top Bar: League + Status */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-orange-500/10 text-orange-500 border border-orange-500/30">
                  {match.leagueId.toUpperCase()}
                </span>
                {match.isFeatured && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" />
                    Choc
                  </span>
                )}
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                match.statusType === 'live'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5'
                  : match.statusType === 'finished'
                  ? 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                  : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
              }`}>
                {match.statusType === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
                {match.status}
              </span>
            </div>

            {/* Teams and Scores Display */}
            <div className="space-y-2 mb-3">
              {/* Home Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ClubLogo code={match.homeTeam.code} logoUrl={match.homeTeam.logoUrl} size="sm" />
                  <div>
                    <span className="font-bold text-sm">{match.homeTeam.name}</span>
                    <span className={`text-[11px] ml-2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      (Dom)
                    </span>
                  </div>
                </div>
                <div className="font-mono text-xl font-black">
                  {match.homeScore}
                </div>
              </div>

              {/* Away Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ClubLogo code={match.awayTeam.code} logoUrl={match.awayTeam.logoUrl} size="sm" />
                  <div>
                    <span className="font-bold text-sm">{match.awayTeam.name}</span>
                    <span className={`text-[11px] ml-2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      (Ext)
                    </span>
                  </div>
                </div>
                <div className="font-mono text-xl font-black">
                  {match.awayScore}
                </div>
              </div>
            </div>

            {/* Match Venue info */}
            <div className={`text-[11px] pt-2 border-t flex items-center justify-between ${
              isLight ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
            }`}>
              <span>{match.venue} • {match.city}</span>
              <span className="font-mono">Fautes: {match.fouls.home} / {match.fouls.away}</span>
            </div>

            {/* Action Buttons Bar */}
            <div className={`mt-3 pt-3 border-t flex items-center justify-between gap-2 ${
              isLight ? 'border-slate-100' : 'border-white/5'
            }`}>
              {/* Quick validate score */}
              {match.statusType !== 'finished' ? (
                <button
                  onClick={() => onValidateFinalScore(match.id)}
                  className="px-2.5 py-1.5 rounded-lg border text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/30 transition flex items-center gap-1 cursor-pointer"
                  title="Valider définitivement le score et clore le match"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valider Score Final</span>
                </button>
              ) : (
                <span className="text-[11px] font-mono text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Score validé
                </span>
              )}

              <div className="flex items-center gap-1.5 ml-auto">
                {/* Play-by-play events manager */}
                <button
                  onClick={() => handleOpenEventsModal(match)}
                  className={`p-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                    isLight ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Gérer les faits de jeu (paniers, fautes, temps-morts)"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Faits de jeu</span>
                </button>

                {/* Edit Match */}
                <button
                  onClick={() => handleOpenEditModal(match)}
                  className={`p-1.5 rounded-lg border transition ${
                    isLight ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Modifier le match"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Delete Match */}
                <button
                  onClick={() => {
                    if (confirm(`Voulez-vous supprimer le match ${match.homeTeam.shortName} vs ${match.awayTeam.shortName} ?`)) {
                      onDeleteMatch(match.id);
                    }
                  }}
                  className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition"
                  title="Supprimer la rencontre"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Match Add / Edit Modal */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 shadow-2xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <h3 className="text-lg font-black tracking-tight">
                {editingMatch ? 'Modifier la Rencontre' : 'Ajouter une Nouvelle Rencontre'}
              </h3>
              <button
                onClick={() => setIsMatchModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMatch} className="space-y-4">
              {/* League & Status Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Championnat</label>
                  <select
                    value={leagueId}
                    onChange={(e) => setLeagueId(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  >
                    <option value="n1">N1_H FIBB (Élite Hommes)</option>
                    <option value="n2">N2_H FIBB (Deuxième Division)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">État du Match</label>
                  <select
                    value={statusType}
                    onChange={(e) => {
                      const newType = e.target.value as any;
                      setStatusType(newType);
                      if (newType === 'finished') setStatusText('Terminé');
                      else if (newType === 'live') setStatusText('Q4 02:45');
                      else setStatusText('20:00 Demain');
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  >
                    <option value="upcoming">À venir (Programmé)</option>
                    <option value="live">En Direct (Live)</option>
                    <option value="finished">Terminé (Validé)</option>
                  </select>
                </div>
              </div>

              {/* Home Team & Score */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl border border-inherit">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Équipe Domicile</label>
                  <select
                    value={homeTeamId}
                    onChange={(e) => setHomeTeamId(e.target.value)}
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
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Score Dom.</label>
                  <input
                    type="number"
                    min="0"
                    value={homeScore}
                    onChange={(e) => setHomeScore(parseInt(e.target.value, 10) || 0)}
                    disabled={statusType === 'upcoming'}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono font-bold ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
              </div>

              {/* Away Team & Score */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl border border-inherit">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Équipe Extérieur</label>
                  <select
                    value={awayTeamId}
                    onChange={(e) => setAwayTeamId(e.target.value)}
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
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Score Ext.</label>
                  <input
                    type="number"
                    min="0"
                    value={awayScore}
                    onChange={(e) => setAwayScore(parseInt(e.target.value, 10) || 0)}
                    disabled={statusType === 'upcoming'}
                    className={`w-full px-3 py-2 rounded-xl text-xs border font-mono font-bold ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
              </div>

              {/* Status text & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Libellé Chrono / Heure</label>
                  <input
                    type="text"
                    required
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    placeholder="Ex: Q4 02:45, Terminé, 21:30"
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Salle / Complexe</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Dôme Palais des Sports"
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-inherit">
                <input
                  id="featured-match-chk"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="featured-match-chk" className="text-xs font-bold cursor-pointer">
                  Mettre en Match à la Une (Hero Match sur l'accueil public)
                </label>
              </div>

              {isFeatured && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">Tag du match à la une</label>
                  <input
                    type="text"
                    value={featuredTag}
                    onChange={(e) => setFeaturedTag(e.target.value)}
                    placeholder="CHOC DE LA JOURNÉE • DÔME PALAIS DES SPORTS"
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                    }`}
                  />
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setIsMatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold transition hover:bg-white/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black tracking-wide shadow-md transition"
                >
                  {editingMatch ? 'Enregistrer les modifications' : 'Créer la rencontre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events / Play-by-Play Manager Modal */}
      {isEventsModalOpen && activeEventsMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border p-6 shadow-2xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <div>
                <h3 className="text-base font-black tracking-tight">
                  Faits de Jeu & Événements en Direct
                </h3>
                <p className="text-xs text-slate-400">
                  {activeEventsMatch.homeTeam.shortName} vs {activeEventsMatch.awayTeam.shortName}
                </p>
              </div>
              <button
                onClick={() => setIsEventsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Add event form */}
            <form onSubmit={handleAddEvent} className="flex items-center gap-2 mb-4">
              <select
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value as any)}
                className={`px-2.5 py-2 rounded-xl text-xs border ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                }`}
              >
                <option value="score">Panier (Score)</option>
                <option value="foul">Faute</option>
                <option value="timeout">Temps-mort</option>
                <option value="sub">Remplacement</option>
              </select>

              <input
                type="text"
                required
                value={newEventText}
                onChange={(e) => setNewEventText(e.target.value)}
                placeholder="Description du fait de jeu..."
                className={`flex-1 px-3 py-2 rounded-xl text-xs border ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/15'
                }`}
              />

              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shrink-0"
              >
                Ajouter
              </button>
            </form>

            {/* List of events */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {sampleEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div>
                    <div className="font-mono text-[10px] text-orange-500 font-bold">
                      {ev.quarter} • {ev.time} ({ev.currentScore})
                    </div>
                    <div className="font-semibold mt-0.5">{ev.text}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded transition ml-2"
                    title="Supprimer l'événement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-inherit text-right">
              <button
                onClick={() => setIsEventsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
