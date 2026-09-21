import React, { useState } from 'react';
import {
  Database,
  Key,
  Link,
  Layers,
  Table,
  Code,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Shield,
  Trophy,
  Users,
  Calendar,
  Radio,
  Bell,
  Activity,
  FileCode
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { POSTGRES_TABLE_SCHEMAS } from '../adminData';

interface EntityField {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkTarget?: string;
  description: string;
}

interface MCDEntity {
  id: string;
  name: string;
  code: string;
  category: 'core' | 'live' | 'admin' | 'user';
  icon: React.ReactNode;
  color: string;
  badgeBg: string;
  description: string;
  fields: EntityField[];
  relations: {
    target: string;
    cardinality: string;
    label: string;
  }[];
}

export const McdVisualSection: React.FC = () => {
  const { isLight } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'live' | 'admin' | 'user'>('all');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('MATCH');
  const [activeView, setActiveView] = useState<'diagram' | 'entities' | 'mld' | 'sql'>('diagram');
  const [copiedSql, setCopiedSql] = useState(false);

  const entities: MCDEntity[] = [
    {
      id: 'COMPETITION',
      name: 'Compétition / Ligue',
      code: 'LEAGUES',
      category: 'core',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/40 text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      description: 'Championnats et divisions FIBB (ex: N1_H, N2_H)',
      fields: [
        { name: 'id', type: 'VARCHAR(32)', isPk: true, description: 'Identifiant unique (ex: n1, n2)' },
        { name: 'name', type: 'VARCHAR(100)', description: 'Nom complet de la ligue' },
        { name: 'sub_league', type: 'VARCHAR(50)', description: 'Libellé de poule ou journée' },
        { name: 'category', type: 'VARCHAR(30)', description: 'Catégorie (Sénior Hommes, Dames)' }
      ],
      relations: [
        { target: 'MATCH', cardinality: '1,N', label: 'Contient plusieurs rencontres' },
        { target: 'STANDING', cardinality: '1,N', label: 'Possède un classement' }
      ]
    },
    {
      id: 'EQUIPE',
      name: 'Club / Équipe',
      code: 'TEAMS',
      category: 'core',
      icon: <Shield className="w-4 h-4 text-orange-400" />,
      color: 'border-orange-500/40 text-orange-400',
      badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      description: 'Clubs affiliés à la Fédération Ivoirienne de Basketball',
      fields: [
        { name: 'id', type: 'VARCHAR(32)', isPk: true, description: 'Identifiant unique (ex: abc, jca)' },
        { name: 'name', type: 'VARCHAR(100)', description: 'Nom complet du club' },
        { name: 'short_name', type: 'VARCHAR(50)', description: 'Nom court ou courant' },
        { name: 'code', type: 'VARCHAR(10)', description: 'Code trigramme unique (ex: ABC)' },
        { name: 'city', type: 'VARCHAR(100)', description: 'Ville du club (Abidjan, San Pedro)' },
        { name: 'badge_bg', type: 'VARCHAR(100)', description: 'Dégradé / Couleur de fond' },
        { name: 'badge_text_color', type: 'VARCHAR(50)', description: 'Couleur de texte associée' },
        { name: 'logo_url', type: 'TEXT', description: 'URL du logo vectoriel' }
      ],
      relations: [
        { target: 'PLAYER', cardinality: '1,N', label: 'Emploie les joueurs' },
        { target: 'MATCH', cardinality: '1,N', label: 'Joue à domicile / extérieur' },
        { target: 'STANDING', cardinality: '1,N', label: 'Figure au classement' }
      ]
    },
    {
      id: 'JOUEUR',
      name: 'Joueur / Athlète',
      code: 'PLAYERS',
      category: 'core',
      icon: <Users className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/40 text-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      description: 'Joueurs licenciés de la FIBB',
      fields: [
        { name: 'id', type: 'VARCHAR(32)', isPk: true, description: 'Identifiant unique joueur' },
        { name: 'team_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'TEAMS', description: 'Club du joueur' },
        { name: 'number', type: 'INT', description: 'Numéro de maillot' },
        { name: 'name', type: 'VARCHAR(100)', description: 'Nom complet ou usuel' },
        { name: 'position', type: 'VARCHAR(50)', description: 'Meneur, Ailier, Pivot, etc.' },
        { name: 'flag', type: 'VARCHAR(10)', description: 'Drapeau nationalité (🇨🇮, 🇫🇷)' },
        { name: 'avatar_url', type: 'TEXT', description: 'Photo de profil' }
      ],
      relations: [
        { target: 'EQUIPE', cardinality: '1,1', label: 'Appartient à un club' },
        { target: 'PLAYER_MATCH_STAT', cardinality: '0,N', label: 'Réalise des stats par match' }
      ]
    },
    {
      id: 'MATCH',
      name: 'Rencontre / Match',
      code: 'MATCHES',
      category: 'live',
      icon: <Calendar className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/40 text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      description: 'Matchs en direct, programmés ou terminés',
      fields: [
        { name: 'id', type: 'VARCHAR(32)', isPk: true, description: 'Identifiant unique rencontre' },
        { name: 'league_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'LEAGUES', description: 'Ligue associée' },
        { name: 'home_team_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'TEAMS', description: 'Équipe à domicile' },
        { name: 'away_team_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'TEAMS', description: 'Équipe à l\'extérieur' },
        { name: 'home_score', type: 'INT', description: 'Score actuel domicile' },
        { name: 'away_score', type: 'INT', description: 'Score actuel extérieur' },
        { name: 'status', type: 'VARCHAR(50)', description: 'Statut (ex: Q4 02:45, Terminé)' },
        { name: 'status_type', type: 'VARCHAR(20)', description: 'Type de statut (live, finished, upcoming)' },
        { name: 'venue', type: 'VARCHAR(150)', description: 'Salle / Complexe sportif' },
        { name: 'city', type: 'VARCHAR(100)', description: 'Ville de la rencontre' },
        { name: 'is_featured', type: 'BOOLEAN', description: 'Mis en avant (Choc)' }
      ],
      relations: [
        { target: 'PERIOD_SCORE', cardinality: '1,1', label: 'Détaille les scores par QT' },
        { target: 'PLAYER_MATCH_STAT', cardinality: '0,N', label: 'Engendre des BoxScores' },
        { target: 'MATCH_EVENT', cardinality: '0,N', label: 'Produit un fil Play-by-Play' },
        { target: 'SCOUT_FEED_EVENT', cardinality: '0,N', label: 'Reçoit le flux scout direct' }
      ]
    },
    {
      id: 'PERIOD_SCORE',
      name: 'Scores par Période',
      code: 'PERIOD_SCORES',
      category: 'live',
      icon: <Activity className="w-4 h-4 text-teal-400" />,
      color: 'border-teal-500/40 text-teal-400',
      badgeBg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      description: 'Scores par quart-temps Q1, Q2, Q3, Q4 et Prolongation',
      fields: [
        { name: 'id', type: 'VARCHAR(64)', isPk: true, description: 'Identifiant unique' },
        { name: 'match_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'MATCHES', description: 'Match associé' },
        { name: 'q1_home / q1_away', type: 'INT', description: 'Score 1er quart-temps' },
        { name: 'q2_home / q2_away', type: 'INT', description: 'Score 2ème quart-temps' },
        { name: 'q3_home / q3_away', type: 'INT', description: 'Score 3ème quart-temps' },
        { name: 'q4_home / q4_away', type: 'INT', description: 'Score 4ème quart-temps' },
        { name: 'ot_home / ot_away', type: 'INT', description: 'Score prolongation' }
      ],
      relations: [
        { target: 'MATCH', cardinality: '1,1', label: 'Rattaché à un match' }
      ]
    },
    {
      id: 'PLAYER_MATCH_STAT',
      name: 'Statistiques Joueur / Match',
      code: 'PLAYER_MATCH_STATS',
      category: 'live',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      color: 'border-cyan-500/40 text-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      description: 'BoxScore complet (PTS, REB, AST, STL, BLK, FG, 3PT, FT)',
      fields: [
        { name: 'id', type: 'VARCHAR(64)', isPk: true, description: 'Identifiant unique de la ligne' },
        { name: 'match_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'MATCHES', description: 'Match concerné' },
        { name: 'player_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'PLAYERS', description: 'Joueur concerné' },
        { name: 'pts', type: 'INT', description: 'Points marqués' },
        { name: 'reb', type: 'INT', description: 'Rebonds capturés' },
        { name: 'ast', type: 'INT', description: 'Passes décisives' },
        { name: 'stl', type: 'INT', description: 'Interceptions' },
        { name: 'blk', type: 'INT', description: 'Contres réalisés' },
        { name: 'fg / three_pt / ft', type: 'VARCHAR(20)', description: 'Tirs tentés et réussis' }
      ],
      relations: [
        { target: 'MATCH', cardinality: '1,1', label: 'Concerne une rencontre' },
        { target: 'JOUEUR', cardinality: '1,1', label: 'Établi pour un joueur' }
      ]
    },
    {
      id: 'MATCH_EVENT',
      name: 'Play-By-Play / Action',
      code: 'MATCH_EVENTS',
      category: 'live',
      icon: <Radio className="w-4 h-4 text-blue-400" />,
      color: 'border-blue-500/40 text-blue-400',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      description: 'Fil chronologique d\'événements de match',
      fields: [
        { name: 'id', type: 'VARCHAR(64)', isPk: true, description: 'Identifiant unique événement' },
        { name: 'match_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'MATCHES', description: 'Match associé' },
        { name: 'time', type: 'VARCHAR(20)', description: 'Chrono du match (ex: 02:45)' },
        { name: 'quarter', type: 'VARCHAR(10)', description: 'Quart-temps (Q1, Q2, Q3, Q4)' },
        { name: 'text', type: 'TEXT', description: 'Description lisible de l\'action' },
        { name: 'type', type: 'VARCHAR(30)', description: 'Catégorie (score, foul, timeout, sub)' },
        { name: 'current_score', type: 'VARCHAR(20)', description: 'Score après l\'action' }
      ],
      relations: [
        { target: 'MATCH', cardinality: '1,1', label: 'Événement de la rencontre' }
      ]
    },
    {
      id: 'STANDING',
      name: 'Classement Général',
      code: 'STANDINGS',
      category: 'core',
      icon: <Trophy className="w-4 h-4 text-yellow-400" />,
      color: 'border-yellow-500/40 text-yellow-400',
      badgeBg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      description: 'Positions, bilans, points et zones de qualification',
      fields: [
        { name: 'id', type: 'SERIAL', isPk: true, description: 'Identifiant de la ligne' },
        { name: 'league_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'LEAGUES', description: 'Championnat' },
        { name: 'team_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'TEAMS', description: 'Équipe' },
        { name: 'rank', type: 'INT', description: 'Rang au classement' },
        { name: 'mj / v / d', type: 'INT', description: 'Matchs Joués, Victoires, Défaites' },
        { name: 'pp / pc / diff', type: 'INT / VARCHAR', description: 'Points Pour, Contre, Différentiel' },
        { name: 'pts', type: 'INT', description: 'Points au classement général' },
        { name: 'zone', type: 'VARCHAR(20)', description: 'Zone (playoff, mid, relegation)' }
      ],
      relations: [
        { target: 'COMPETITION', cardinality: '1,1', label: 'Classement d\'un championnat' },
        { target: 'EQUIPE', cardinality: '1,1', label: 'Position d\'un club' }
      ]
    },
    {
      id: 'SCOUT',
      name: 'Scout / Opérateur Terrain',
      code: 'SCOUTS',
      category: 'admin',
      icon: <Radio className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/40 text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      description: 'Comptes scouts et clés d\'API de saisie terrain',
      fields: [
        { name: 'id', type: 'VARCHAR(32)', isPk: true, description: 'Identifiant unique du scout' },
        { name: 'full_name', type: 'VARCHAR(100)', description: 'Nom complet de l\'opérateur' },
        { name: 'username', type: 'VARCHAR(50)', description: 'Username d\'accès' },
        { name: 'api_key', type: 'VARCHAR(100)', description: 'Clé API d\'authentification unique' },
        { name: 'status', type: 'VARCHAR(20)', description: 'État (active, inactive, on_duty)' },
        { name: 'assigned_match_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'MATCHES', description: 'Match assigné actuel' }
      ],
      relations: [
        { target: 'SCOUT_FEED_EVENT', cardinality: '0,N', label: 'Émet les actions en direct' },
        { target: 'MATCH', cardinality: '0,1', label: 'Est affecté à un match' }
      ]
    },
    {
      id: 'SCOUT_FEED_EVENT',
      name: 'Flux Tampon Scout Live',
      code: 'SCOUT_FEED_EVENTS',
      category: 'admin',
      icon: <Database className="w-4 h-4 text-indigo-400" />,
      color: 'border-indigo-500/40 text-indigo-400',
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      description: 'File d\'attente temps réel synchronisée en base SQL',
      fields: [
        { name: 'id', type: 'VARCHAR(64)', isPk: true, description: 'Identifiant unique du signal' },
        { name: 'match_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'MATCHES', description: 'Match concerné' },
        { name: 'scout_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'SCOUTS', description: 'Scout émetteur' },
        { name: 'type', type: 'VARCHAR(30)', description: 'Action (score_2, score_3, foul, etc.)' },
        { name: 'points_added', type: 'INT', description: 'Points à créditer (+1, +2, +3)' },
        { name: 'synced_to_postgres', type: 'BOOLEAN', description: 'Statut de persistance SQL' }
      ],
      relations: [
        { target: 'SCOUT', cardinality: '1,1', label: 'Transmis par le scout' },
        { target: 'MATCH', cardinality: '1,1', label: 'Actualise le score du match' }
      ]
    },
    {
      id: 'ADMIN_USER',
      name: 'Administrateur FIBB',
      code: 'ADMIN_USERS',
      category: 'admin',
      icon: <Shield className="w-4 h-4 text-red-400" />,
      color: 'border-red-500/40 text-red-400',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
      description: 'Commissionnaires et éditeurs autorisés',
      fields: [
        { name: 'id', type: 'VARCHAR(32)', isPk: true, description: 'Identifiant unique admin' },
        { name: 'username', type: 'VARCHAR(50)', description: 'Nom d\'utilisateur' },
        { name: 'role', type: 'VARCHAR(30)', description: 'SUPER_ADMIN, COMMISSIONER, EDITOR' },
        { name: 'full_name', type: 'VARCHAR(100)', description: 'Nom et prénom' }
      ],
      relations: [
        { target: 'MATCH', cardinality: '0,N', label: 'Valide les scores officiels' }
      ]
    },
    {
      id: 'NOTIFICATION',
      name: 'Notification / Alerte',
      code: 'NOTIFICATIONS',
      category: 'user',
      icon: <Bell className="w-4 h-4 text-orange-400" />,
      color: 'border-orange-500/40 text-orange-400',
      badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      description: 'Poussée d\'alertes live pour les supporters',
      fields: [
        { name: 'id', type: 'VARCHAR(64)', isPk: true, description: 'Identifiant alerte' },
        { name: 'match_id', type: 'VARCHAR(32)', isFk: true, fkTarget: 'MATCHES', description: 'Match associé' },
        { name: 'title', type: 'VARCHAR(150)', description: 'Titre de l\'alerte' },
        { name: 'message', type: 'TEXT', description: 'Message explicatif' },
        { name: 'is_read', type: 'BOOLEAN', description: 'Statut de lecture' }
      ],
      relations: [
        { target: 'MATCH', cardinality: '1,1', label: 'Alerte générée par un match' }
      ]
    }
  ];

  const filteredEntities = entities.filter((e) => {
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  const selectedEntity = entities.find((e) => e.id === selectedEntityId) || entities[0];

  const handleCopySql = () => {
    navigator.clipboard.writeText(POSTGRES_TABLE_SCHEMAS);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-lg relative overflow-hidden transition ${
        isLight ? 'bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-slate-100 border-orange-500/20' : 'bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-950 border-orange-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modèle Conceptuel de Données (MCD Merise)</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Architecture MCD & Schéma de Base de Données
            </h2>
            <p className={`text-xs max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Vue d'ensemble visuelle des 12 entités métier, cardinalités, clés primaires/étrangères et schéma PostgreSQL complet d'IvoireScore / voirScore FIBB.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveView('diagram')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeView === 'diagram'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : isLight ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Diagramme Graphique</span>
            </button>
            <button
              onClick={() => setActiveView('entities')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeView === 'entities'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : isLight ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Détail Entités</span>
            </button>
            <button
              onClick={() => setActiveView('sql')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeView === 'sql'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : isLight ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Code SQL PostgreSQL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider mr-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Domaines :</span>
          {[
            { id: 'all', label: 'Toutes les Entités (12)', count: 12 },
            { id: 'core', label: 'Cœur Métier (4)', count: 4 },
            { id: 'live', label: 'LiveScore & BoxScore (4)', count: 4 },
            { id: 'admin', label: 'Admin & Scouts (3)', count: 3 },
            { id: 'user', label: 'Utilisateurs & Alertes (1)', count: 1 }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : isLight ? 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200' : 'bg-[#0f131a] text-slate-400 hover:bg-white/5 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Display */}
      {activeView === 'diagram' && (
        <div className="space-y-6">
          {/* Interactive Visual Graph Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEntities.map((ent) => {
              const isSelected = ent.id === selectedEntityId;
              return (
                <div
                  key={ent.id}
                  onClick={() => setSelectedEntityId(ent.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                    isSelected
                      ? `${ent.color} ${isLight ? 'bg-white shadow-xl' : 'bg-slate-900/90 shadow-2xl shadow-orange-500/10'} ring-2 ring-orange-500`
                      : isLight
                      ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                      : 'bg-[#0f131a] border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Card Top Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl border ${ent.badgeBg}`}>
                          {ent.icon}
                        </div>
                        <div>
                          <h3 className={`font-black text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {ent.name}
                          </h3>
                          <p className="font-mono text-[10px] font-bold text-orange-400">
                            TABLE: {ent.code}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${ent.badgeBg}`}>
                        {ent.fields.length} attr.
                      </span>
                    </div>

                    {/* Description */}
                    <p className={`text-xs line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {ent.description}
                    </p>

                    {/* Key Attributes List */}
                    <div className="space-y-1 pt-1 border-t border-white/5">
                      {ent.fields.slice(0, 4).map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-1.5 truncate pr-2">
                            {f.isPk && <Key className="w-3 h-3 text-amber-400 shrink-0" />}
                            {f.isFk && <Link className="w-3 h-3 text-blue-400 shrink-0" />}
                            <span className={f.isPk ? 'font-bold text-amber-400' : f.isFk ? 'text-blue-400' : isLight ? 'text-slate-700' : 'text-slate-300'}>
                              {f.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0">{f.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Relations */}
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Relations Merise :</span>
                    <span className="font-bold text-orange-400 flex items-center gap-1">
                      <span>{ent.relations.length} liaisons</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Entity Detail Panel */}
          {selectedEntity && (
            <div className={`p-6 rounded-3xl border shadow-xl space-y-6 transition ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/10'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border ${selectedEntity.badgeBg}`}>
                    {selectedEntity.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {selectedEntity.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        {selectedEntity.code}
                      </span>
                    </div>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {selectedEntity.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${selectedEntity.badgeBg}`}>
                    Domaine: {selectedEntity.category.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Attributes & Relations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columns / Fields Table (2 cols) */}
                <div className="lg:col-span-2 space-y-3">
                  <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>Attributs & Colonnes PostgreSQL ({selectedEntity.fields.length})</span>
                  </h4>

                  <div className={`rounded-2xl border overflow-hidden ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b text-[11px] font-mono uppercase ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-900/60 border-white/10 text-slate-400'
                        }`}>
                          <th className="py-2.5 px-3">Attribut</th>
                          <th className="py-2.5 px-3">Type de données</th>
                          <th className="py-2.5 px-3">Clé</th>
                          <th className="py-2.5 px-3">Rôle / Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {selectedEntity.fields.map((field, idx) => (
                          <tr key={idx} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                            <td className="py-2.5 px-3 font-mono font-bold text-orange-400">
                              {field.name}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-400">
                              {field.type}
                            </td>
                            <td className="py-2.5 px-3">
                              {field.isPk && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                  PK (Clé Prim.)
                                </span>
                              )}
                              {field.isFk && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  FK → {field.fkTarget}
                                </span>
                              )}
                              {!field.isPk && !field.isFk && (
                                <span className="text-slate-500 font-mono text-[10px]">-</span>
                              )}
                            </td>
                            <td className={`py-2.5 px-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                              {field.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Relations Panel (1 col) */}
                <div className="space-y-3">
                  <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <Link className="w-4 h-4 text-blue-400" />
                    <span>Associations & Cardinalités</span>
                  </h4>

                  <div className="space-y-2">
                    {selectedEntity.relations.map((rel, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border flex flex-col gap-1.5 transition ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-orange-400">
                            → {rel.target}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            Card. ({rel.cardinality})
                          </span>
                        </div>
                        <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {rel.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SQL Script View */}
      {activeView === 'sql' && (
        <div className={`p-6 rounded-3xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/10'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className={`text-lg font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <FileCode className="w-5 h-5 text-blue-400" />
                <span>Script DDL PostgreSQL Officiel</span>
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Script SQL prêt pour exécution sur PostgreSQL, Cloud SQL ou Supabase.
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="px-4 py-2 rounded-xl font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white shadow-md flex items-center gap-2 transition cursor-pointer shrink-0"
            >
              {copiedSql ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Copié dans le presse-papier !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copier le script SQL</span>
                </>
              )}
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-[#0a0d14] border border-white/10 p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[600px]">
            <pre>{POSTGRES_TABLE_SCHEMAS}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
