import React, { useState } from 'react';
import { Activity, Database, Radio, Send, Play, CheckCircle2, Clock, Zap, Download, Code, Layers, ShieldCheck } from 'lucide-react';
import { ScoutFeedEvent, ScoutUser, Match } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { POSTGRES_TABLE_SCHEMAS } from '../adminData';

interface ScoutFeedBufferSectionProps {
  feedEvents: ScoutFeedEvent[];
  scouts: ScoutUser[];
  matches: Match[];
  onTriggerSimulatedScoutAction: (event: Omit<ScoutFeedEvent, 'id' | 'timestamp'>) => void;
  onClearBuffer: () => void;
}

export const ScoutFeedBufferSection: React.FC<ScoutFeedBufferSectionProps> = ({
  feedEvents,
  scouts,
  matches,
  onTriggerSimulatedScoutAction,
  onClearBuffer
}) => {
  const { isLight } = useTheme();
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedScoutId, setSelectedScoutId] = useState(scouts[0]?.id || '');
  const [selectedActionType, setSelectedActionType] = useState<ScoutFeedEvent['type']>('score_2');
  const [copiedSql, setCopiedSql] = useState(false);

  const pendingCount = feedEvents.filter((e) => !e.syncedToPostgres).length;

  const handleSimulateEvent = () => {
    setIsSimulating(true);
    const scout = scouts.find((s) => s.id === selectedScoutId) || scouts[0];
    const match = matches.find((m) => m.id === scout?.assignedMatchId) || matches[0];

    setTimeout(() => {
      setIsSimulating(false);
      const isHome = Math.random() > 0.45;
      const points = selectedActionType === 'score_2' ? 2 : selectedActionType === 'score_3' ? 3 : selectedActionType === 'free_throw' ? 1 : 0;

      onTriggerSimulatedScoutAction({
        matchId: match.id,
        matchLabel: `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`,
        scoutId: scout.id,
        scoutName: scout.fullName,
        quarter: 'Q4',
        gameClock: '02:15',
        type: selectedActionType,
        team: isHome ? 'home' : 'away',
        teamName: isHome ? match.homeTeam.name : match.awayTeam.name,
        playerName: isHome ? `${match.homeTeam.code} Player #10` : `${match.awayTeam.code} Player #7`,
        pointsAdded: points > 0 ? points : undefined,
        syncedToPostgres: false
      });
    }, 300);
  };

  const copySql = () => {
    navigator.clipboard.writeText(POSTGRES_TABLE_SCHEMAS);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Espace Flux Scout & File d'attente PostgreSQL
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Pipeline v1.0
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Tampon temps réel recueillant les actions transmises par l'application Scout (paniers, fautes, rebonds) avant insertion dans PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSchemaModal(true)}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Code className="w-4 h-4 text-blue-400" />
            <span>Schéma PostgreSQL</span>
          </button>

          <button
            onClick={onClearBuffer}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isLight ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span>Vider le flux</span>
          </button>
        </div>
      </div>

      {/* Pipeline Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Scout Status */}
        <div className={`p-4 rounded-2xl border transition ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/10'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Émetteurs Terrain</span>
            <Radio className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black font-mono">
            {scouts.filter((s) => s.status === 'on_duty').length} / {scouts.length}
          </div>
          <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Scouts en mission active avec session temps réel
          </p>
        </div>

        {/* Card 2: Buffer Queue */}
        <div className={`p-4 rounded-2xl border transition ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/10'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Événements en File (Tampon)</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-500">
            {feedEvents.length}
          </div>
          <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Dont {pendingCount} en attente de synchronisation BD
          </p>
        </div>

        {/* Card 3: PostgreSQL Connector Readiness */}
        <div className={`p-4 rounded-2xl border transition ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/10'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Base de Données PostgreSQL</span>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-sm font-black font-mono text-blue-400 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            STANDBY / PRÊT À CONNECTER
          </div>
          <p className={`text-[11px] mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Tables <code className="font-mono text-orange-400">matches</code>, <code className="font-mono text-orange-400">match_events</code> prêtes
          </p>
        </div>
      </div>

      {/* Simulator Card: Test Scout Live Signal */}
      <div className={`p-5 rounded-2xl border transition ${
        isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/60 border-white/10'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-black tracking-tight uppercase">
            Simulateur de Transmission Scout en Direct
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono border border-orange-500/20">
            Test de télémétrie
          </span>
        </div>
        <p className={`text-xs mb-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Simulez l'envoi d'une action depuis l'application mobile du scout pour voir le résultat arriver dans ce flux et mettre à jour le match en temps réel :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1">Scout Émetteur</label>
            <select
              value={selectedScoutId}
              onChange={(e) => setSelectedScoutId(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs border ${
                isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-white/15'
              }`}
            >
              {scouts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.username})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1">Action de Jeu</label>
            <select
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value as any)}
              className={`w-full px-3 py-2 rounded-xl text-xs border ${
                isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-white/15'
              }`}
            >
              <option value="score_2">Panier à 2 points réussi (+2)</option>
              <option value="score_3">Tir primé à 3 points réussi (+3)</option>
              <option value="free_throw">Lancer franc réussi (+1)</option>
              <option value="foul">Faute personnelle signalée</option>
              <option value="rebound">Rebond capté</option>
              <option value="turnover">Perte de balle / Turnover</option>
              <option value="timeout">Temps-mort d'équipe</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSimulateEvent}
              disabled={isSimulating}
              className="w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer au flux</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Event Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/10'
      }`}>
        <div className={`p-4 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" />
            <h3 className="text-xs sm:text-sm font-bold tracking-tight uppercase">
              Historique des paquets reçus (Flux entrant Scout)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {feedEvents.length} paquets enregistrés
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className={`border-b text-[11px] font-mono font-bold uppercase tracking-wider ${
                isLight ? 'bg-slate-50/50 text-slate-500 border-slate-200' : 'bg-white/[0.01] text-slate-400 border-white/10'
              }`}>
                <th className="py-2.5 px-4">Heure / Chrono</th>
                <th className="py-2.5 px-4">Rencontre</th>
                <th className="py-2.5 px-4">Scout Émetteur</th>
                <th className="py-2.5 px-4">Événement Terrain</th>
                <th className="py-2.5 px-4">Joueur / Équipe</th>
                <th className="py-2.5 px-4 text-right">Destination BD</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
              {feedEvents.map((evt) => (
                <tr key={evt.id} className={`transition ${
                  isLight ? 'hover:bg-slate-50/80' : 'hover:bg-white/[0.02]'
                }`}>
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-xs">{evt.timestamp}</div>
                    <div className="text-[10px] text-orange-500 font-bold">{evt.quarter} • {evt.gameClock}</div>
                  </td>

                  <td className="py-3 px-4 font-medium">
                    {evt.matchLabel}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-xs">{evt.scoutName}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      evt.type.startsWith('score')
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : evt.type === 'foul'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : evt.type === 'rebound'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {evt.type === 'score_2' && 'Panier +2 pts'}
                      {evt.type === 'score_3' && 'Tir 3 pts (+3)'}
                      {evt.type === 'free_throw' && 'Lancer franc (+1)'}
                      {evt.type === 'foul' && 'Faute personnelle'}
                      {evt.type === 'rebound' && 'Rebond'}
                      {evt.type === 'turnover' && 'Turnover'}
                      {evt.type === 'timeout' && 'Temps mort'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-xs font-bold">{evt.teamName}</div>
                    {evt.playerName && (
                      <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {evt.playerName}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      evt.syncedToPostgres
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      <Database className="w-3 h-3" />
                      <span>{evt.syncedToPostgres ? 'INSERTÉ PG' : 'BUFFER PG'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PostgreSQL Schema Viewer Modal */}
      {showSchemaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border p-6 shadow-2xl transition ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-black tracking-tight">
                  Schéma PostgreSQL FIBB Basketball
                </h3>
              </div>
              <button
                onClick={() => setShowSchemaModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className={`text-xs mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Ce schéma SQL comprend les tables pour les équipes, rencontres, opérateurs scouts, événements play-by-play et classements, avec toutes les contraintes de clés étrangères.
            </p>

            <div className="flex-1 overflow-y-auto rounded-xl bg-slate-950 p-4 border border-white/10 font-mono text-xs text-slate-300">
              <pre className="whitespace-pre-wrap">{POSTGRES_TABLE_SCHEMAS}</pre>
            </div>

            <div className="pt-4 mt-3 flex items-center justify-between border-t border-inherit">
              <span className="text-[11px] text-slate-400">
                Prêt pour <code className="text-blue-400 font-mono">psql / Cloud SQL</code>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copySql}
                  className="px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 bg-white/5 hover:bg-white/10"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{copiedSql ? 'Copié !' : 'Copier le script SQL'}</span>
                </button>
                <button
                  onClick={() => setShowSchemaModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
