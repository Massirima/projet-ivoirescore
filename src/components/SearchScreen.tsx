import React, { useState, useMemo } from 'react';
import { 
  Search, X, Clock, Flame, Trophy, Building2, Globe2, Award, 
  MapPin, ChevronRight, User, Users, Shield, ArrowRight, ArrowLeft, CheckCircle2,
  SlidersHorizontal, Calendar, Navigation
} from 'lucide-react';
import { Match } from '../types';
import { ClubLogo } from './ClubLogo';
import { useTheme } from '../context/ThemeContext';

interface SearchScreenProps {
  matches: Match[];
  onOpenMatch: (matchId: string) => void;
  onNavigateToStandings: () => void;
  onNavigateToCalendar: () => void;
  onBack?: () => void;
}

type FilterCategory = 'all' | 'championships' | 'teams' | 'players' | 'venues';

interface RecentSearch {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: 'team' | 'player' | 'standings' | 'venue';
}

interface TrendingTeam {
  name: string;
  code: string;
  badgeBg: string;
  badgeBorder: string;
  city: string;
  division: string;
  badgeDotColor: string;
}

interface CompetitionItem {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  badge: string;
  badgeColor?: string;
  meta: string;
  accentColor: string;
  icon: 'basketball' | 'player' | 'women' | 'trophy' | 'building' | 'globe' | 'supercup';
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  matches,
  onOpenMatch,
  onNavigateToStandings,
  onNavigateToCalendar,
  onBack
}) => {
  const { isLight } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [venueModalOpen, setVenueModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<{
    name: string;
    commune: string;
    capacity: string;
    address: string;
    matchesCount: string;
  } | null>(null);

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    {
      id: 'rec-1',
      title: 'ABC Fighters',
      subtitle: 'Club de Basket • N1 Hommes',
      category: 'teams',
      icon: 'team'
    },
    {
      id: 'rec-2',
      title: 'Junior Cissé JCA',
      subtitle: 'Arrière #7 - Moy. 19.4 pts',
      category: 'players',
      icon: 'player'
    },
    {
      id: 'rec-3',
      title: 'Classement N1_H',
      subtitle: 'Saison régulière 2025/2026',
      category: 'championships',
      icon: 'standings'
    },
    {
      id: 'rec-4',
      title: 'Palais des Sports',
      subtitle: 'Treichville, Abidjan - 3 500 places',
      category: 'venues',
      icon: 'venue'
    }
  ]);

  // Trending teams at Abidjan (from image)
  const trendingTeams: TrendingTeam[] = [
    {
      name: 'ABC Fighters',
      code: 'ABC',
      badgeBg: 'from-red-950 to-red-900',
      badgeBorder: 'border-red-600/40',
      city: 'Abidjan',
      division: 'N1 Hommes',
      badgeDotColor: 'bg-emerald-400'
    },
    {
      name: 'JCA',
      code: 'JCA',
      badgeBg: 'from-slate-900 via-blue-950 to-slate-900',
      badgeBorder: 'border-blue-500/40',
      city: 'Treichville',
      division: 'Treichville',
      badgeDotColor: 'bg-emerald-400'
    },
    {
      name: 'SOA',
      code: 'SOA',
      badgeBg: 'from-orange-950 to-amber-950',
      badgeBorder: 'border-orange-500/40',
      city: 'Yamoussoukro',
      division: 'Armée / Yamoussoukro',
      badgeDotColor: 'bg-amber-400'
    },
    {
      name: 'Azur Basket',
      code: 'AZUR',
      badgeBg: 'from-cyan-950 to-blue-950',
      badgeBorder: 'border-cyan-500/40',
      city: 'Abidjan',
      division: 'N1 Hommes',
      badgeDotColor: 'bg-emerald-400'
    },
    {
      name: 'Hypersonic',
      code: 'HPS',
      badgeBg: 'from-purple-950 to-rose-950',
      badgeBorder: 'border-purple-500/40',
      city: 'Yopougon',
      division: 'Yopougon',
      badgeDotColor: 'bg-rose-400'
    },
    {
      name: 'Sewé Sport',
      code: 'SEWE',
      badgeBg: 'from-emerald-950 to-teal-950',
      badgeBorder: 'border-emerald-500/40',
      city: 'San-Pédro',
      division: 'Élite N1',
      badgeDotColor: 'bg-emerald-400'
    }
  ];

  // Competitions list directly from the image
  const competitions: CompetitionItem[] = [
    {
      id: 'comp-n1-h',
      code: 'N1_H FIBB',
      name: 'N1_H FIBB',
      subtitle: 'Championnat National 1 Hommes',
      badge: 'EN COURS',
      meta: '12 équipes • Journée 14',
      accentColor: '#FF6B00',
      icon: 'basketball'
    },
    {
      id: 'comp-n2-h',
      code: 'N2_H FIBB',
      name: 'N2_H FIBB',
      subtitle: 'Championnat National 2 Hommes',
      badge: 'POULE A & B',
      meta: '12 équipes • Journée 10',
      accentColor: '#10B981',
      icon: 'player'
    },
    {
      id: 'comp-n1-d',
      code: 'N1_D FIBB',
      name: 'N1_D FIBB',
      subtitle: 'Championnat National 1 Dames',
      badge: 'EN COURS',
      meta: '10 équipes • Playoffs Prévus',
      accentColor: '#EC4899',
      icon: 'women'
    },
    {
      id: 'comp-coupe-nat',
      code: 'Coupe Nationale',
      name: 'Coupe Nationale',
      subtitle: 'Coupe FIBB Côte d\'Ivoire 2025/2026',
      badge: '1/4 FINALES',
      meta: 'Élimination Directe',
      accentColor: '#06B6D4',
      icon: 'trophy'
    },
    {
      id: 'comp-cosibef',
      code: 'COSIBEF Basketball',
      name: 'COSIBEF Basketball',
      subtitle: 'Championnat Corporatif & Banques',
      badge: 'ENTREPRISES',
      meta: 'SGCI, BNI, Port Autonome...',
      accentColor: '#10B981',
      icon: 'building'
    },
    {
      id: 'comp-bal',
      code: 'BAL - Basket Africa',
      name: 'BAL - Basket Africa',
      subtitle: 'Conférence Sahara & Représentant CI',
      badge: 'PANAFRICAIN',
      meta: 'Équipes Ivoiriennes Qualifiées',
      accentColor: '#F59E0B',
      icon: 'globe'
    }
  ];

  // Super Coupe prestige competition
  const superCupCompetition = {
    name: 'Super Coupe Félix Houphouët-Boigny',
    badge: 'PRESTIGE FIBB',
    subtitle: 'Choc d\'ouverture de saison : Champion N1 vs Vainqueur Coupe Nationale',
    meta: 'Édition Annuelle',
    accentColor: '#EAB308'
  };

  // Players list for rich query matching
  const knownPlayers = [
    { id: 'p1', name: 'Souleymane Dieng', team: 'ABC Fighters', role: 'Meneur #4', stats: '24.2 pts, 6.8 ast' },
    { id: 'p2', name: 'Junior Cissé', team: 'JCA Abidjan', role: 'Arrière #7', stats: '19.4 pts, 4.2 reb' },
    { id: 'p3', name: 'Stéphane Konaté', team: 'ABC Fighters', role: 'Arrière #10', stats: '18.1 pts, 3.5 reb' },
    { id: 'p4', name: 'Moussa Touré', team: 'SOA', role: 'Pivot #15', stats: '14.5 pts, 11.2 reb' },
    { id: 'p5', name: 'Amadou Bamba', team: 'CBA Abidjan', role: 'Ailier #9', stats: '16.7 pts, 5.8 reb' },
    { id: 'p6', name: 'Yves N\'Goran', team: 'Hypersonic', role: 'Meneur #3', stats: '15.3 pts, 7.1 ast' }
  ];

  // Venues list
  const knownVenues = [
    {
      id: 'v1',
      name: 'Palais des Sports de Treichville',
      commune: 'Treichville, Abidjan',
      capacity: '3 500 places',
      address: 'Boulevard de Marseille, Treichville',
      matchesCount: '4 matchs programmés ce week-end'
    },
    {
      id: 'v2',
      name: 'Forum de l\'Université Félix Houphouët-Boigny',
      commune: 'Cocody, Abidjan',
      capacity: '1 200 places',
      address: 'Campus Universitaire de Cocody',
      matchesCount: '2 matchs N2 programmés'
    },
    {
      id: 'v3',
      name: 'Terrain Municipal Agora Koumassi',
      commune: 'Koumassi, Abidjan',
      capacity: '800 places',
      address: 'Complexe Sportif Agora, Koumassi',
      matchesCount: 'Matchs de quartier & jeunes'
    }
  ];

  // Filtering logic based on input query
  const query = searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!query) return null;

    const matchedCompetitions = competitions.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.subtitle.toLowerCase().includes(query) ||
        c.badge.toLowerCase().includes(query)
    );

    const matchedMatches = matches.filter(
      (m) =>
        m.homeTeam.name.toLowerCase().includes(query) ||
        m.awayTeam.name.toLowerCase().includes(query) ||
        m.homeTeam.code.toLowerCase().includes(query) ||
        m.awayTeam.code.toLowerCase().includes(query) ||
        m.venue.toLowerCase().includes(query) ||
        m.city.toLowerCase().includes(query)
    );

    const matchedPlayers = knownPlayers.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.team.toLowerCase().includes(query) ||
        p.role.toLowerCase().includes(query)
    );

    const matchedVenues = knownVenues.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.commune.toLowerCase().includes(query) ||
        v.address.toLowerCase().includes(query)
    );

    return {
      competitions: matchedCompetitions,
      matches: matchedMatches,
      players: matchedPlayers,
      venues: matchedVenues,
      total:
        matchedCompetitions.length +
        matchedMatches.length +
        matchedPlayers.length +
        matchedVenues.length
    };
  }, [query, matches]);

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const handleRemoveRecentItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSelectRecent = (title: string) => {
    setSearchQuery(title);
  };

  const handleOpenVenueModal = (venueName?: string) => {
    const venue = knownVenues.find((v) => v.name.includes(venueName || 'Palais des Sports')) || knownVenues[0];
    setSelectedVenue(venue);
    setVenueModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* 0. PETITE BALISE NAV EN HAUT À GAUCHE AVEC FLÈCHE RETOUR & TEXTE RETOUR */}
      <nav id="search-nav-back" aria-label="Navigation retour" className="flex items-center justify-start pt-0.5">
        <button
          type="button"
          id="btn-search-back"
          onClick={onBack}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors text-xs font-medium cursor-pointer shadow-sm select-none ${
            isLight
              ? 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200'
              : 'bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-400 hover:text-white border border-white/10'
          }`}
          title="Retour en arrière"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-orange-500" />
          <span className={`text-[11px] sm:text-xs lowercase ${
            isLight ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
          }`}>retour</span>
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* 1. SEARCH INPUT TEXTFIELD (Zone de saisie avec loupe & affichage dynamique) */}
      {/* ========================================================================= */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-amber-500/20 rounded-2xl blur-sm group-hover:opacity-100 transition duration-300 opacity-70"></div>
        <div className={`relative border rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 backdrop-blur-xl transition-all ${
          isLight
            ? 'bg-white border-slate-200/90 focus-within:border-orange-500/80 focus-within:ring-2 focus-within:ring-orange-500/20 shadow-sm'
            : 'bg-[#0F172A]/90 border-white/15 focus-within:border-orange-500/60 focus-within:ring-2 focus-within:ring-orange-500/25 shadow-2xl'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5 text-[#FF6B00]" />
          </div>

          <input
            id="search-input-field"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une équipe, un joueur, un championnat, un stade (ex: ABC, JCA, Souleymane Dieng, Treichville...)"
            className={`w-full bg-transparent border-none outline-none text-sm sm:text-base font-medium tracking-wide ${
              isLight
                ? 'text-slate-900 placeholder:text-slate-400'
                : 'text-white placeholder-slate-400'
            }`}
            autoFocus
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`p-1.5 rounded-lg transition ${
                isLight
                  ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono shrink-0 select-none ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-500'
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}>
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTER CHIPS ROW (FILTRER : Tous, Championnats, Équipes N1/N2...) */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <div className={`flex items-center gap-1.5 font-extrabold uppercase tracking-wider pl-1 shrink-0 ${
          isLight ? 'text-emerald-700' : 'text-emerald-400'
        }`}>
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>FILTRER :</span>
        </div>

        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 ${
            activeFilter === 'all'
              ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/30'
              : isLight
              ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          Tous
        </button>

        <button
          onClick={() => setActiveFilter('championships')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 ${
            activeFilter === 'championships'
              ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/30'
              : isLight
              ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          Championnats
        </button>

        <button
          onClick={() => setActiveFilter('teams')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 ${
            activeFilter === 'teams'
              ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/30'
              : isLight
              ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          Équipes N1/N2
        </button>

        <button
          onClick={() => setActiveFilter('players')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 ${
            activeFilter === 'players'
              ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/30'
              : isLight
              ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          Joueurs & Talents
        </button>

        <button
          onClick={() => setActiveFilter('venues')}
          className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 ${
            activeFilter === 'venues'
              ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/30'
              : isLight
              ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          Stades & Salles
        </button>
      </div>

      {/* ========================================================================= */}
      {/* DYNAMIC RESULTS VIEW (Quand l'utilisateur tape du texte) */}
      {/* ========================================================================= */}
      {searchResults && (
        <div className="space-y-6 pt-2 animate-fadeIn">
          <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <span>
              Résultats pour <span className="text-orange-500 font-bold">"{searchQuery}"</span>
            </span>
            <span className={`font-mono px-2 py-0.5 rounded border ${
              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white/5 text-slate-300 border-white/10'
            }`}>
              {searchResults.total} résultat{searchResults.total > 1 ? 's' : ''}
            </span>
          </div>

          {searchResults.total === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/5'
            }`}>
              <Search className={`w-10 h-10 mx-auto mb-3 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
              <h3 className={`text-base font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Aucun résultat trouvé</h3>
              <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Essayez avec un nom de club ("ABC", "JCA", "SOA"), un joueur ("Dieng") ou un stade ("Treichville").
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Match Results */}
              {searchResults.matches.length > 0 && (
                <div className="space-y-3">
                  <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
                    isLight ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    <Trophy className="w-3.5 h-3.5 text-orange-500" />
                    Matchs Correspondants ({searchResults.matches.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.matches.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => onOpenMatch(m.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between group ${
                          isLight
                            ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-orange-400 shadow-xs'
                            : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-orange-500/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center overflow-hidden shrink-0 ${
                            isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/10'
                          }`}>
                            <ClubLogo code={m.homeTeam.code} name={m.homeTeam.name} />
                          </div>
                          <div>
                            <div className={`text-sm font-bold transition ${
                              isLight ? 'text-slate-900 group-hover:text-orange-600' : 'text-white group-hover:text-orange-300'
                            }`}>
                              {m.homeTeam.shortName} <span className={isLight ? 'text-slate-400 font-normal' : 'text-slate-500 font-normal'}>vs</span> {m.awayTeam.shortName}
                            </div>
                            <div className={`text-xs flex items-center gap-2 mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                              <span>{m.leagueName}</span>
                              <span>•</span>
                              <span className={isLight ? 'text-emerald-700 font-semibold' : 'text-emerald-400 font-semibold'}>{m.status}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className={`w-4 h-4 transition ${
                          isLight ? 'text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1' : 'text-slate-500 group-hover:text-white group-hover:translate-x-1'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Players Results */}
              {searchResults.players.length > 0 && (
                <div className="space-y-3">
                  <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
                    isLight ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    Joueurs & Talents ({searchResults.players.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {searchResults.players.map((player) => (
                      <div
                        key={player.id}
                        className={`p-3 rounded-xl border flex items-center gap-3 ${
                          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-white/[0.03] border-white/10'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                          isLight ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        }`}>
                          {player.name.charAt(0)}
                        </div>
                        <div>
                          <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{player.name}</div>
                          <div className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{player.team} • {player.role}</div>
                          <div className={`text-[11px] font-mono mt-0.5 ${isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400'}`}>{player.stats}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Competitions Results */}
              {searchResults.competitions.length > 0 && (
                <div className="space-y-3">
                  <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
                    isLight ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    Championnats & Ligues ({searchResults.competitions.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.competitions.map((comp) => (
                      <div
                        key={comp.id}
                        onClick={onNavigateToStandings}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                          isLight
                            ? 'bg-white border-slate-200 hover:border-emerald-500 shadow-xs'
                            : 'bg-white/[0.03] border-white/10 hover:border-emerald-500/40'
                        }`}
                      >
                        <div>
                          <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{comp.name}</div>
                          <div className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{comp.subtitle}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isLight
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {comp.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEFAULT SCREEN CONTENT (Strictement conforme à la capture image.png) */}
      {/* ========================================================================= */}
      {!searchQuery && (
        <div className="space-y-8 animate-fadeIn">
          {/* ------------------------------------------------------------- */}
          {/* SECTION A: RECHERCHES RÉCENTES & ÉQUIPES TENDANCES (2 COLUMNS) */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Colonne Gauche: Recherches Récentes */}
            <div className={`border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all ${
              isLight
                ? 'bg-white border-slate-200/90 shadow-sm'
                : 'bg-[#0D1424]/70 border-white/10 backdrop-blur-md shadow-xl'
            }`}>
              <div>
                <div className={`flex items-center justify-between mb-3.5 pb-2 border-b ${
                  isLight ? 'border-slate-100' : 'border-white/5'
                }`}>
                  <div className={`flex items-center gap-2 font-bold text-sm ${
                    isLight ? 'text-slate-900' : 'text-slate-300'
                  }`}>
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Recherches Récentes</span>
                  </div>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={handleClearRecent}
                      className={`text-[11px] font-extrabold uppercase tracking-wider transition ${
                        isLight ? 'text-slate-500 hover:text-orange-600' : 'text-slate-400 hover:text-orange-400'
                      }`}
                    >
                      TOUT EFFACER
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {recentSearches.length === 0 ? (
                    <div className={`text-xs py-6 text-center ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                      Aucune recherche récente enregistrée
                    </div>
                  ) : (
                    recentSearches.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectRecent(item.title)}
                        className={`group flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                          isLight
                            ? 'hover:bg-slate-50 border-transparent hover:border-slate-200'
                            : 'hover:bg-white/5 border-transparent hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition ${
                            isLight
                              ? 'bg-slate-100 border-slate-200 text-slate-600 group-hover:text-orange-600 group-hover:bg-orange-50'
                              : 'bg-white/5 border-white/10 text-slate-400 group-hover:text-orange-400'
                          }`}>
                            {item.icon === 'team' && <Users className="w-4 h-4" />}
                            {item.icon === 'player' && <User className="w-4 h-4" />}
                            {item.icon === 'standings' && <Trophy className="w-4 h-4" />}
                            {item.icon === 'venue' && <MapPin className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <div className={`text-xs sm:text-sm font-bold transition truncate ${
                              isLight ? 'text-slate-900 group-hover:text-orange-600' : 'text-slate-200 group-hover:text-white'
                            }`}>
                              {item.title}
                            </div>
                            <div className={`text-[11px] truncate ${
                              isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
                            }`}>
                              {item.subtitle}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleRemoveRecentItem(item.id, e)}
                          className={`p-1 rounded-md transition shrink-0 ml-2 ${
                            isLight
                              ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              : 'text-slate-500 hover:text-slate-200 hover:bg-white/10'
                          }`}
                          title="Retirer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Colonne Droite: Équipes Tendances à Abidjan */}
            <div className={`border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all ${
              isLight
                ? 'bg-white border-slate-200/90 shadow-sm'
                : 'bg-[#0D1424]/70 border-white/10 backdrop-blur-md shadow-xl'
            }`}>
              <div className={`flex items-center justify-between mb-4 pb-2 border-b ${
                isLight ? 'border-slate-100' : 'border-white/5'
              }`}>
                <div className={`flex items-center gap-2 font-bold text-sm ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}>
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                  <span>Équipes Tendances à Abidjan</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  TOP FRÉQUENTATION
                </span>
              </div>

              {/* 3x2 Grid des équipes tendances */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {trendingTeams.map((team) => (
                  <div
                    key={team.name}
                    onClick={() => setSearchQuery(team.name)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex flex-col items-center text-center group ${
                      isLight
                        ? 'bg-slate-50 hover:bg-orange-50/50 border-slate-200 hover:border-orange-400/60 shadow-2xs'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/10 hover:border-orange-500/40'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center overflow-hidden mb-2 group-hover:scale-105 transition-transform ${
                      isLight
                        ? 'bg-white border-slate-200 shadow-xs'
                        : 'bg-gradient-to-br from-slate-900 to-black border-white/15 shadow-lg'
                    }`}>
                      <ClubLogo code={team.code} name={team.name} />
                    </div>
                    <div className={`text-xs font-black transition truncate w-full ${
                      isLight ? 'text-slate-900 group-hover:text-orange-600' : 'text-white group-hover:text-orange-300'
                    }`}>
                      {team.name}
                    </div>
                    <div className={`flex items-center gap-1.5 mt-1 text-[10px] ${
                      isLight ? 'text-slate-600 font-semibold' : 'text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${team.badgeDotColor}`}></span>
                      <span className="truncate">{team.division}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION B: CHAMPIONNATS & COMPÉTITIONS (ACCÈS RAPIDE & DIRECT) */}
          {/* ------------------------------------------------------------- */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
              <div>
                <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-1 ${
                  isLight ? 'text-orange-600' : 'text-orange-400'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  ACCÈS RAPIDE & DIRECT
                </div>
                <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Championnats & Compétitions
                </h2>
              </div>
              <p className={`text-xs max-w-md ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                Sélectionnez une ligue pour voir scores en direct, calendrier et classements
              </p>
            </div>

            {/* Grille des 6 compétitions avec barre d'accent gauche */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {competitions.map((comp) => (
                <div
                  key={comp.id}
                  onClick={onNavigateToStandings}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-300 p-4 cursor-pointer group hover:-translate-y-0.5 ${
                    isLight
                      ? 'bg-white border-slate-200/90 hover:border-orange-400/60 shadow-sm hover:shadow-md'
                      : 'bg-[#0D1424]/80 border-white/10 hover:border-white/25 shadow-xl'
                  }`}
                >
                  {/* Bordure d'accent latérale gauche */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2"
                    style={{ backgroundColor: comp.accentColor }}
                  />

                  <div className="pl-2 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                          isLight
                            ? 'bg-slate-100 border-slate-200 text-slate-700 group-hover:bg-orange-50'
                            : 'bg-white/5 border-white/10 text-slate-300 group-hover:text-white'
                        }`}>
                          {comp.icon === 'basketball' && <Trophy className="w-4 h-4 text-orange-500" />}
                          {comp.icon === 'player' && <Users className="w-4 h-4 text-emerald-500" />}
                          {comp.icon === 'women' && <Award className="w-4 h-4 text-rose-500" />}
                          {comp.icon === 'trophy' && <Trophy className="w-4 h-4 text-cyan-500" />}
                          {comp.icon === 'building' && <Building2 className="w-4 h-4 text-emerald-500" />}
                          {comp.icon === 'globe' && <Globe2 className="w-4 h-4 text-amber-500" />}
                        </div>
                        <div>
                          <h3 className={`font-extrabold text-sm sm:text-base transition ${
                            isLight ? 'text-slate-900 group-hover:text-orange-600' : 'text-white group-hover:text-orange-300'
                          }`}>
                            {comp.name}
                          </h3>
                          <p className={`text-[11px] ${
                            isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
                          }`}>
                            {comp.subtitle}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${
                        isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-slate-300'
                      }`}>
                        {comp.badge}
                      </span>
                    </div>

                    <div className={`flex items-center justify-between pt-2 border-t text-[11px] ${
                      isLight ? 'border-slate-100 text-slate-600 font-medium' : 'border-white/5 text-slate-400'
                    }`}>
                      <span className="flex items-center gap-1.5">
                        <Users className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`} />
                        {comp.meta}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition ${
                        isLight ? 'text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1' : 'text-slate-500 group-hover:text-white group-hover:translate-x-1'
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carte Full Width: Super Coupe Félix Houphouët-Boigny */}
            <div
              onClick={onNavigateToStandings}
              className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 cursor-pointer group transition-all duration-300 ${
                isLight
                  ? 'bg-gradient-to-r from-amber-50/90 via-white to-amber-50/60 border-amber-300/80 shadow-sm hover:shadow-md hover:border-amber-400'
                  : 'bg-[#0D1424]/90 border-white/10 hover:border-amber-500/40 shadow-xl'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 group-hover:w-2 transition-all"></div>
              
              <div className="pl-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                    isLight
                      ? 'bg-amber-100 border-amber-300 text-amber-800'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-base font-black transition ${
                        isLight ? 'text-slate-900 group-hover:text-amber-800' : 'text-white group-hover:text-amber-300'
                      }`}>
                        {superCupCompetition.name}
                      </h3>
                      <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isLight
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {superCupCompetition.badge}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${
                      isLight ? 'text-slate-600 font-medium' : 'text-slate-400'
                    }`}>
                      {superCupCompetition.subtitle}
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 text-xs font-bold shrink-0 self-end sm:self-center ${
                  isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-400 group-hover:text-white'
                }`}>
                  <span>{superCupCompetition.meta}</span>
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition ${
                    isLight
                      ? 'bg-amber-100 border-amber-300 text-amber-800 group-hover:bg-amber-500 group-hover:text-white'
                      : 'bg-white/5 border-white/10 group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-400'
                  }`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION C: STADES & TERRAINS PARTENAIRES (Où voir les matchs) */}
          {/* ------------------------------------------------------------- */}
          <div className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all ${
            isLight
              ? 'bg-gradient-to-br from-emerald-50/90 via-white to-slate-50 border-emerald-300/80 shadow-sm'
              : 'bg-gradient-to-br from-[#0D1424] via-[#101B2E] to-[#0A101C] border-emerald-500/20 shadow-2xl'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${
                  isLight ? 'text-emerald-800' : 'text-emerald-400'
                }`}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>STADES & TERRAINS PARTENAIRES</span>
                </div>
                <h3 className={`text-lg sm:text-xl font-black tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Où voir les matchs ce week-end ?
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isLight ? 'text-slate-700 font-medium' : 'text-slate-300'
                }`}>
                  Retrouvez les affluences, adresses et horaires d'accès pour le Palais des Sports de Treichville, le Forum de l'Université Félix Houphouët-Boigny et les terrains municipaux.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleOpenVenueModal('Palais des Sports')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase border transition shadow-sm ${
                    isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border-white/10'
                  }`}
                >
                  PALAIS DES SPORTS
                </button>
                <button
                  onClick={() => handleOpenVenueModal()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black tracking-wider uppercase shadow-md shadow-orange-500/25 transition cursor-pointer"
                >
                  VOIR LA CARTE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENUE MODAL (Palais des sports / Carte interactive) */}
      {/* ========================================================================= */}
      {venueModalOpen && selectedVenue && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn ${
          isLight ? 'bg-slate-900/50' : 'bg-black/80'
        }`}>
          <div className={`border rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0D1424] border-white/15 text-white'
          }`}>
            <button
              onClick={() => setVenueModalOpen(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  isLight ? 'text-emerald-700' : 'text-emerald-400'
                }`}>
                  STADE OFFICIEL FIBB
                </span>
                <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedVenue.name}</h3>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-transparent'
              }`}>
                <span className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}>Localisation</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedVenue.commune}</span>
              </div>
              <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-transparent'
              }`}>
                <span className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}>Capacité</span>
                <span className={`font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{selectedVenue.capacity}</span>
              </div>
              <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-transparent'
              }`}>
                <span className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}>Adresse</span>
                <span className={`font-bold text-right ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedVenue.address}</span>
              </div>
              <div className={`p-2.5 rounded-xl border font-medium ${
                isLight ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-orange-500/10 border-orange-500/20 text-orange-300'
              }`}>
                {selectedVenue.matchesCount}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setVenueModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md shadow-orange-500/20"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
