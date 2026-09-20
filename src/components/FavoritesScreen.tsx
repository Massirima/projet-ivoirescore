import React from 'react';
import { Star, ChevronRight, Pin } from 'lucide-react';
import { Match } from '../types';
import { useTheme } from '../context/ThemeContext';

interface FavoritesScreenProps {
  matches: Match[];
  favorites: string[];
  pinnedLeagues?: string[];
  onToggleFavorite: (matchId: string) => void;
  onTogglePinLeague?: (leagueId: string) => void;
  onOpenMatch: (matchId: string) => void;
  onNavigateToMatches: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  matches,
  favorites,
  pinnedLeagues = [],
  onToggleFavorite,
  onTogglePinLeague,
  onOpenMatch,
  onNavigateToMatches
}) => {
  const { isLight } = useTheme();
  const favoriteMatches = matches.filter((m) => favorites.includes(m.id));
  const totalItemsCount = favoriteMatches.length + pinnedLeagues.length;

  const leagueLabels: Record<string, { title: string; sub: string }> = {
    n1: { title: "CÔTE D'IVOIRE: N1_H FIBB", sub: "National 1 Hommes FIBB • Journée 14" },
    n2: { title: "CÔTE D'IVOIRE: N2_H FIBB", sub: "National 2 Hommes FIBB • Poule A - J10" }
  };

  return (
    <div id="favorites-screen" className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl border backdrop-blur-xl ${
        isLight
          ? 'bg-gradient-to-r from-orange-500/10 via-white to-slate-50 border-orange-500/30 shadow-sm'
          : 'bg-gradient-to-r from-orange-500/15 via-slate-900/80 to-slate-900 border-orange-500/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isLight
              ? 'bg-orange-100 text-orange-600 border border-orange-300'
              : 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
          }`}>
            <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <h2 className={`text-lg sm:text-xl font-black tracking-tight flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Mes Favoris FIBB
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                isLight
                  ? 'bg-orange-100 text-orange-700 border-orange-300'
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}>
                {totalItemsCount} {totalItemsCount > 1 ? 'éléments' : 'élément'}
              </span>
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
              Suivi personnalisé de vos championnats épinglés, équipes et chocs avec alertes scores en temps réel
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToMatches}
          className={`self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-extrabold transition border ${
            isLight
              ? 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-2xs'
              : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
          }`}
        >
          Tous les matchs
        </button>
      </div>

      {/* Pinned Leagues Section (if user pinned any championships) */}
      {pinnedLeagues.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-amber-800' : 'text-amber-300'
            }`}>
              <Pin className="w-3.5 h-3.5 fill-[#FFBE1A] text-[#FF9E00] -rotate-45" />
              Championnats épinglés en tête ({pinnedLeagues.length})
            </h3>
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Placés en priorité sur votre fil des matchs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pinnedLeagues.map((leagueId) => {
              const info = leagueLabels[leagueId] || { title: leagueId, sub: '' };
              const leagueMatchCount = matches.filter((m) => m.leagueId === leagueId).length;

              return (
                <div
                  key={leagueId}
                  className={`flex items-center justify-between p-4 rounded-2xl border shadow-sm ${
                    isLight
                      ? 'bg-amber-50/70 border-amber-200/90 text-slate-900'
                      : 'bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-slate-900 border-amber-500/25 shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                      <Pin className="w-4 h-4 fill-[#FFBE1A] text-[#FF9E00] -rotate-45" />
                    </div>
                    <div>
                      <h4 className={`font-black text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {info.title}
                      </h4>
                      <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                        {info.sub} • {leagueMatchCount} matchs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToMatches()}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                        isLight
                          ? 'text-orange-700 bg-white border-orange-200 hover:bg-orange-50'
                          : 'text-orange-400 hover:text-orange-300 bg-white/5 border-white/10'
                      }`}
                    >
                      Voir
                    </button>
                    {onTogglePinLeague && (
                      <button
                        onClick={() => onTogglePinLeague(leagueId)}
                        title="Désépingler le championnat"
                        className={`p-1.5 rounded-lg transition ${
                          isLight
                            ? 'text-slate-500 hover:text-red-500 hover:bg-white'
                            : 'text-slate-400 hover:text-red-400 hover:bg-white/5'
                        }`}
                      >
                        <Pin className="w-4 h-4 fill-[#FFBE1A] text-[#FF9E00]" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Favorites List or Empty State */}
      {favoriteMatches.length === 0 && pinnedLeagues.length === 0 ? (
        <div className={`text-center py-16 px-4 rounded-3xl border backdrop-blur-md ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-slate-900/40 border-white/10'
        }`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
            isLight
              ? 'bg-orange-50 border-orange-200 text-orange-500'
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}>
            <Star className={`w-8 h-8 ${isLight ? 'text-orange-400' : 'text-slate-500'}`} />
          </div>
          <h3 className={`text-base font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Aucun favori sélectionné
          </h3>
          <p className={`text-xs max-w-md mx-auto mb-6 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
            Épinglez un championnat avec l'icône épingle pour le placer en tête de liste, ou cliquez sur l'étoile d'un match pour le suivre ici.
          </p>

          <div className="max-w-md mx-auto">
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              Ajouter rapidement un choc :
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {matches.slice(0, 3).map((m) => (
                <button
                  key={m.id}
                  onClick={() => onToggleFavorite(m.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 ${
                    isLight
                      ? 'bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 text-slate-800 border-slate-200'
                      : 'bg-white/5 hover:bg-orange-500/20 hover:text-orange-300 border-white/10 text-slate-200'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span>{m.homeTeam.code} vs {m.awayTeam.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {favoriteMatches.length > 0 && (
            <h3 className={`text-xs font-black uppercase tracking-wider ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              Matchs suivis ({favoriteMatches.length})
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteMatches.map((match) => (
              <div
                key={match.id}
                onClick={() => onOpenMatch(match.id)}
                className={`cursor-pointer group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 backdrop-blur-xl border ${
                  isLight
                    ? 'bg-white border-slate-200/90 hover:border-orange-500/50 shadow-sm hover:shadow-md'
                    : 'bg-slate-900/80 border-white/10 hover:border-orange-500/40 shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold tracking-wider uppercase ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {match.leagueSub}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(match.id);
                      }}
                      title="Retirer des favoris"
                      className="p-1 rounded-full text-orange-500 hover:text-slate-400 transition"
                    >
                      <Star className="w-4 h-4 fill-orange-500" />
                    </button>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        match.statusType === 'live'
                          ? 'bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse'
                          : match.statusType === 'finished'
                          ? isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                          : isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>
                </div>

                {/* Match Teams & Score */}
                <div className="space-y-2.5 py-2">
                  <div className="flex items-center justify-between">
                    <span className={`font-extrabold text-sm sm:text-base transition ${
                      isLight 
                        ? 'text-slate-900 group-hover:text-orange-600' 
                        : 'text-white group-hover:text-orange-400'
                    }`}>
                      {match.homeTeam.name}
                    </span>
                    <span className={`font-mono font-black text-base sm:text-lg ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {match.homeScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`font-extrabold text-sm sm:text-base transition ${
                      isLight 
                        ? 'text-slate-900 group-hover:text-orange-600' 
                        : 'text-white group-hover:text-orange-400'
                    }`}>
                      {match.awayTeam.name}
                    </span>
                    <span className={`font-mono font-black text-base sm:text-lg ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {match.awayScore}
                    </span>
                  </div>
                </div>

                {/* Match Footer */}
                <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs ${
                  isLight ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
                }`}>
                  <span>{match.venue}</span>
                  <span className="text-orange-500 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    LiveStats <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
