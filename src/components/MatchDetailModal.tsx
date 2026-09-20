import React, { useState } from 'react';
import { ArrowLeft, Star, Share2, MapPin, Check, Shield, Users, BarChart3, Clock } from 'lucide-react';
import { Match, PlayerStat, PlayByPlayEvent } from '../types';
import { MATCH_PLAYERS_BOX, PLAY_BY_PLAY, COACHES } from '../data/mockData';
import { ClubLogo } from './ClubLogo';

interface MatchDetailModalProps {
  match: Match;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onBack,
  isFavorite,
  onToggleFavorite
}) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'stats' | 'compos'>('resume');
  const [copiedToast, setCopiedToast] = useState(false);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<'all' | 'home' | 'away'>('all');

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const homePlayers = MATCH_PLAYERS_BOX.filter(p => p.teamId === 'abc');
  const awayPlayers = MATCH_PLAYERS_BOX.filter(p => p.teamId === 'jca');

  const displayedPlayers = MATCH_PLAYERS_BOX.filter(p => {
    if (selectedTeamFilter === 'home') return p.teamId === 'abc';
    if (selectedTeamFilter === 'away') return p.teamId === 'jca';
    return true;
  });

  return (
    <div id="screen-detail" className="space-y-6">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> Lien du match copié dans le presse-papier !
        </div>
      )}

      {/* Breadcrumb & Venue Header */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-matchs"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black text-slate-300 hover:text-white transition px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux matchs
        </button>
        <div id="detail-venue" className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span>{match.venue}</span>
        </div>
      </div>

      {/* Match Banner Scoreboard */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top bar with League & Actions */}
        <div className="flex items-center justify-between mb-6">
          <span 
            id="detail-league-tag" 
            className="px-3 py-1 rounded-xl bg-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-wider border border-orange-500/30"
          >
            {match.leagueName}
          </span>
          <div className="flex items-center gap-2.5">
            <button
              id="btn-favorite-match"
              onClick={onToggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                isFavorite 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
              {isFavorite ? 'Favori' : 'Favoris'}
            </button>

            <button
              id="btn-share-match"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              Partager
            </button>
          </div>
        </div>

        {/* Main Score Display */}
        <div className="grid grid-cols-3 items-center text-center">
          {/* Home Team */}
          <div>
            <span className="text-[11px] text-emerald-400 font-extrabold uppercase tracking-wider block mb-1">
              DOMICILE
            </span>
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${match.homeTeam.badgeBg} border ${match.homeTeam.badgeBorderColor} flex items-center justify-center overflow-hidden shadow-xl mb-2`}>
                <ClubLogo code={match.homeTeam.code} name={match.homeTeam.name} />
              </div>
              <h1 id="detail-home-name" className="text-lg md:text-2xl font-black text-white">
                {match.homeTeam.name}
              </h1>
              <span id="detail-home-stats" className="text-xs text-slate-400 font-mono mt-1 block">
                Fautes: {match.fouls.home} • TM: {match.timeouts.home}
              </span>
            </div>
          </div>

          {/* Big Score */}
          <div>
            <div className="font-mono text-5xl md:text-7xl font-black tracking-tight text-white flex items-center justify-center gap-4">
              <span id="detail-home-score" className="text-orange-500">
                {match.homeScore}
              </span>
              <span className="text-slate-700">:</span>
              <span id="detail-away-score" className="text-white">
                {match.awayScore}
              </span>
            </div>
            <div 
              id="detail-status" 
              className="mt-2 text-xs font-mono font-bold text-red-400 flex items-center justify-center gap-1.5"
            >
              {match.statusType === 'live' && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              )}
              {match.status} {match.statusType === 'live' && 'LIVE'}
            </div>
          </div>

          {/* Away Team */}
          <div>
            <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">
              EXTÉRIEUR
            </span>
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${match.awayTeam.badgeBg} border ${match.awayTeam.badgeBorderColor} flex items-center justify-center overflow-hidden shadow-xl mb-2`}>
                <ClubLogo code={match.awayTeam.code} name={match.awayTeam.name} />
              </div>
              <h1 id="detail-away-name" className="text-lg md:text-2xl font-black text-white">
                {match.awayTeam.name}
              </h1>
              <span id="detail-away-stats" className="text-xs text-slate-400 font-mono mt-1 block">
                Fautes: {match.fouls.away} • TM: {match.timeouts.away}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          id="dtab-resume"
          onClick={() => setActiveTab('resume')}
          className={`px-6 py-2 rounded-2xl text-xs md:text-sm font-black tracking-wider transition ${
            activeTab === 'resume'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/35'
              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          RÉSUMÉ
        </button>
        <button
          id="dtab-stats"
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-2 rounded-2xl text-xs md:text-sm font-black tracking-wider transition ${
            activeTab === 'stats'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/35'
              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          STATS JOUEURS
        </button>
        <button
          id="dtab-compos"
          onClick={() => setActiveTab('compos')}
          className={`px-6 py-2 rounded-2xl text-xs md:text-sm font-black tracking-wider transition ${
            activeTab === 'compos'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/35'
              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          COMPOSITION
        </button>
      </div>

      {/* TAB 1: RÉSUMÉ */}
      {activeTab === 'resume' && (
        <div id="dpanel-resume" className="space-y-6">
          {/* Quarter scores table */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300 mb-4">
              Score par quart-temps
            </h3>
            <table className="w-full text-center font-mono text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/5 pb-2 text-[11px]">
                  <th className="text-left font-sans py-2">ÉQUIPE</th>
                  <th>Q1</th>
                  <th>Q2</th>
                  <th>Q3</th>
                  <th>Q4</th>
                  <th className="font-bold text-white">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="text-left py-3 font-sans font-bold text-white">{match.homeTeam.name}</td>
                  <td>{match.periodScores.q1[0]}</td>
                  <td>{match.periodScores.q2[0]}</td>
                  <td>{match.periodScores.q3[0]}</td>
                  <td className="text-orange-400 font-bold">{match.periodScores.q4[0]}</td>
                  <td className="font-bold text-sm text-orange-400">{match.homeScore}</td>
                </tr>
                <tr>
                  <td className="text-left py-3 font-sans font-bold text-white">{match.awayTeam.name}</td>
                  <td>{match.periodScores.q1[1]}</td>
                  <td>{match.periodScores.q2[1]}</td>
                  <td>{match.periodScores.q3[1]}</td>
                  <td className="text-emerald-400 font-bold">{match.periodScores.q4[1]}</td>
                  <td className="font-bold text-sm text-white">{match.awayScore}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Key match performers */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-200">
                Meilleurs Performeurs du Match
              </h3>
              <button
                onClick={() => setActiveTab('stats')}
                className="text-xs text-orange-400 hover:underline font-bold"
              >
                Voir Box Score complet →
              </button>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 text-xs font-mono border border-white/5 hover:border-orange-500/20 transition">
                <div>
                  <span className="font-bold text-white font-sans text-sm block">S. Dieng</span>
                  <span className="text-slate-400 font-sans text-[11px]">{match.homeTeam.name} • Ailier</span>
                </div>
                <div className="flex items-center gap-5 text-slate-300">
                  <span className="font-black text-orange-400 text-sm">32 PTS</span>
                  <span>8 REB</span>
                  <span>1 AST</span>
                  <span className="text-slate-500">30 MIN</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 text-xs font-mono border border-white/5 hover:border-orange-500/20 transition">
                <div>
                  <span className="font-bold text-white font-sans text-sm block">J. Cissé</span>
                  <span className="text-slate-400 font-sans text-[11px]">{match.awayTeam.name} • Meneur</span>
                </div>
                <div className="flex items-center gap-5 text-slate-300">
                  <span className="font-black text-orange-400 text-sm">28 PTS</span>
                  <span>13 REB</span>
                  <span>4 AST</span>
                  <span className="text-slate-500">34 MIN</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 text-xs font-mono border border-white/5 hover:border-orange-500/20 transition">
                <div>
                  <span className="font-bold text-white font-sans text-sm block">K. Stephane</span>
                  <span className="text-slate-400 font-sans text-[11px]">{match.homeTeam.name} • Meneur</span>
                </div>
                <div className="flex items-center gap-5 text-slate-300">
                  <span className="font-black text-orange-400 text-sm">21 PTS</span>
                  <span>4 REB</span>
                  <span>9 AST</span>
                  <span className="text-slate-500">28 MIN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Play-by-Play timeline */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                Fil du match en direct (Play-by-play)
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                TEMPS RÉEL
              </span>
            </div>
            <div className="space-y-3">
              {PLAY_BY_PLAY.map((item) => (
                <div key={item.id} className="flex items-start gap-3 text-xs p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="font-mono text-orange-400 font-bold shrink-0 bg-white/5 px-2 py-1 rounded-lg">
                    {item.time} ({item.quarter})
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-white mr-2">{item.teamName}:</span>
                    <span className="text-slate-300">{item.text}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-400 shrink-0">
                    {item.currentScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STATS JOUEURS (BOX SCORE) */}
      {activeTab === 'stats' && (
        <div id="dpanel-stats" className="space-y-6">
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl overflow-x-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-300">
                  Box Score Complet des Joueurs
                </h3>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  ● Titulaires marqués d'un point orange
                </span>
              </div>

              {/* Team Filter */}
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setSelectedTeamFilter('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    selectedTeamFilter === 'all' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setSelectedTeamFilter('home')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    selectedTeamFilter === 'home' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {match.homeTeam.code}
                </button>
                <button
                  onClick={() => setSelectedTeamFilter('away')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    selectedTeamFilter === 'away' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {match.awayTeam.code}
                </button>
              </div>
            </div>

            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 font-sans">JOUEUR</th>
                  <th className="py-3 px-3 font-sans">ÉQUIPE</th>
                  <th className="py-3 px-3 text-center text-orange-400 font-black">PTS</th>
                  <th className="py-3 px-3 text-center">REB</th>
                  <th className="py-3 px-3 text-center">PASSE</th>
                  <th className="py-3 px-3 text-center">INT</th>
                  <th className="py-3 px-3 text-center">CTR</th>
                  <th className="py-3 px-3 text-center">TIRS (FG)</th>
                  <th className="py-3 px-3 text-center">3-PTS</th>
                  <th className="py-3 px-3 text-center">MIN</th>
                </tr>
              </thead>
              <tbody id="boxscore-tbody" className="divide-y divide-white/5">
                {displayedPlayers.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.04] transition">
                    <td className="py-3 px-3 font-sans font-semibold text-white flex items-center gap-2">
                      {p.isStarter ? (
                        <span className="w-2 h-2 rounded-full bg-orange-500" title="Titulaire"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-600" title="Remplaçant"></span>
                      )}
                      <span className="text-slate-400 text-xs">#{p.number}</span>
                      <span>{p.name}</span>
                      <span className="text-xs">{p.flag}</span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400">{p.team}</td>
                    <td className="py-3 px-3 text-center font-black text-orange-400 text-sm">{p.pts}</td>
                    <td className="py-3 px-3 text-center text-slate-200 font-bold">{p.reb}</td>
                    <td className="py-3 px-3 text-center text-slate-200 font-bold">{p.ast}</td>
                    <td className="py-3 px-3 text-center text-slate-400">{p.stl}</td>
                    <td className="py-3 px-3 text-center text-slate-400">{p.blk}</td>
                    <td className="py-3 px-3 text-center text-slate-300">{p.fg}</td>
                    <td className="py-3 px-3 text-center text-slate-300">{p.threePt}</td>
                    <td className="py-3 px-3 text-center text-slate-400">{p.min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COMPOSITION */}
      {activeTab === 'compos' && (
        <div id="dpanel-compos" className="space-y-6">
          {/* Interactive Basketball Half-Court Visualizer */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="font-extrabold text-xs uppercase tracking-widest text-center text-slate-400 mb-4">
              Tactique & Dispositions sur le Terrain
            </h3>
            
            {/* Visual Half Court SVG */}
            <div className="relative w-full max-w-2xl mx-auto h-64 md:h-80 bg-gradient-to-b from-[#141b2d] to-[#0c101d] rounded-2xl border-2 border-orange-500/30 overflow-hidden shadow-2xl p-4 flex flex-col justify-between">
              {/* Court Markings */}
              <div className="absolute inset-x-12 top-0 h-40 border-b-2 border-x-2 border-white/20 rounded-b-[60px] pointer-events-none"></div>
              <div className="absolute inset-x-28 top-0 h-28 border-b-2 border-x-2 border-white/20 pointer-events-none"></div>
              <div className="absolute left-1/2 -translate-x-1/2 top-28 w-24 h-24 border-2 border-white/20 rounded-full pointer-events-none"></div>
              <div className="absolute left-1/2 -translate-x-1/2 top-4 w-12 h-6 border-b-2 border-x-2 border-orange-500 rounded-b-full pointer-events-none"></div>

              {/* Five Starters positioned on court */}
              <div className="relative z-10 h-full flex flex-col justify-between py-2">
                {/* Pivot near basket */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center group cursor-pointer">
                    <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-110 transition">
                      #25
                    </span>
                    <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded mt-1">
                      M. Breunig (P)
                    </span>
                  </div>
                </div>

                {/* Forwards */}
                <div className="flex justify-between px-12 md:px-20">
                  <div className="flex flex-col items-center group cursor-pointer">
                    <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-110 transition">
                      #13
                    </span>
                    <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded mt-1">
                      S. Dieng (A)
                    </span>
                  </div>

                  <div className="flex flex-col items-center group cursor-pointer">
                    <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-110 transition">
                      #5
                    </span>
                    <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded mt-1">
                      Z. Zeigler (AF)
                    </span>
                  </div>
                </div>

                {/* Guards on perimeter */}
                <div className="flex justify-around px-8">
                  <div className="flex flex-col items-center group cursor-pointer">
                    <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-110 transition">
                      #55
                    </span>
                    <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded mt-1">
                      K. Stephane (M)
                    </span>
                  </div>

                  <div className="flex flex-col items-center group cursor-pointer">
                    <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-110 transition">
                      #3
                    </span>
                    <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded mt-1">
                      K. Ogbe (AR)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rosters comparison */}
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="font-extrabold text-xs uppercase tracking-widest text-center text-slate-400 mb-6">
              Compositions de Départ & Effectifs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {/* Home Starters & Bench */}
              <div className="space-y-4">
                <div className="font-black text-sm text-orange-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{match.homeTeam.name} (Domicile)</span>
                  <span className="text-xs text-slate-400 font-normal">Coach: J. Kouadio</span>
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">5 Majeur</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-sm">🇨🇮</span> #13 - S. Dieng
                    </span>
                    <span className="text-orange-400 font-semibold">Ailier</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-sm">🇨🇮</span> #55 - K. Stephane
                    </span>
                    <span className="text-orange-400 font-semibold">Meneur</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-sm">🇫🇷</span> #25 - M. Breunig
                    </span>
                    <span className="text-orange-400 font-semibold">Pivot</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-sm">🇨🇮</span> #3 - K. Ogbe
                    </span>
                    <span className="text-orange-400 font-semibold">Arrière</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-sm">🇺🇸</span> #5 - Z. Zeigler
                    </span>
                    <span className="text-orange-400 font-semibold">Ailier fort</span>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-slate-400 uppercase pt-2">Banc des Remplaçants</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] text-xs">
                    <span className="text-slate-200">#12 - J. Fatnassi 🇹🇳</span>
                    <span className="text-slate-500">Meneur</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] text-xs">
                    <span className="text-slate-200">#28 - M. Kangudia 🇨🇩</span>
                    <span className="text-slate-500">Pivot</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] text-xs">
                    <span className="text-slate-200">#15 - P. Kouassi 🇨🇮</span>
                    <span className="text-slate-500">Ailier</span>
                  </div>
                </div>
              </div>

              {/* Away Starters & Bench */}
              <div className="space-y-4 md:pl-6 pt-4 md:pt-0">
                <div className="font-black text-sm text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{match.awayTeam.name} (Extérieur)</span>
                  <span className="text-xs text-slate-400 font-normal">Coach: D. Bakayoko</span>
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">5 Majeur</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-sm">🇨🇮</span> #0 - J. Cissé
                    </span>
                    <span className="text-emerald-400 font-semibold">Meneur</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-sm">🇨🇦</span> #29 - O. Klassen
                    </span>
                    <span className="text-emerald-400 font-semibold">Pivot</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-sm">🇪🇪</span> #34 - A. Konontsuk
                    </span>
                    <span className="text-emerald-400 font-semibold">Ailier</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-sm">🇺🇸</span> #9 - D. Lansdowne
                    </span>
                    <span className="text-emerald-400 font-semibold">Arrière</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-sm">🇨🇮</span> #3 - D. Lockhart
                    </span>
                    <span className="text-emerald-400 font-semibold">Ailier fort</span>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-slate-400 uppercase pt-2">Banc des Remplaçants</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] text-xs">
                    <span className="text-slate-200">#15 - R. Amaize 🇩🇪</span>
                    <span className="text-slate-500">Arrière</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] text-xs">
                    <span className="text-slate-200">#4 - E. Baggette 🇫🇷</span>
                    <span className="text-slate-500">Meneur</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] text-xs">
                    <span className="text-slate-200">#21 - C. Okereke 🇳🇬</span>
                    <span className="text-slate-500">Pivot</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
