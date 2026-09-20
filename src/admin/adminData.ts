import { ScoutUser, ScoutFeedEvent } from '../types';

export const DEFAULT_SCOUTS: ScoutUser[] = [
  {
    id: 'scout-1',
    fullName: 'Mamadou Koné',
    username: 'scout.abidjan1',
    email: 'm.kone.scout@fibb.ci',
    phone: '+225 07 08 12 34 56',
    assignedMatchId: 'm1',
    assignedMatchLabel: 'ABC Fighters vs JCA Abidjan (N1_H)',
    role: 'scout_lead',
    status: 'on_duty',
    apiKey: 'fibb_sct_live_9a87d612e4f04c99',
    createdAt: '2026-01-15T08:30:00Z',
    lastActive: 'Il y a 30 secondes (Dôme Palais des Sports)'
  },
  {
    id: 'scout-2',
    fullName: 'Patrick Bamba Yao',
    username: 'scout.treichville',
    email: 'p.bamba.scout@fibb.ci',
    phone: '+225 05 44 23 89 01',
    assignedMatchId: 'm2',
    assignedMatchLabel: 'CBA Abidjan vs Fusion BC (N1_H)',
    role: 'scout_operator',
    status: 'active',
    apiKey: 'fibb_sct_live_3c21a445b8e72d11',
    createdAt: '2026-02-01T10:15:00Z',
    lastActive: 'Il y a 12 minutes'
  },
  {
    id: 'scout-3',
    fullName: 'Eric Ange Kouamé',
    username: 'scout.sanpedro',
    email: 'e.kouame.scout@fibb.ci',
    phone: '+225 01 22 99 77 55',
    assignedMatchId: 'm5',
    assignedMatchLabel: 'Séwé Sport vs Hypersonic BC (N2_H)',
    role: 'scout_assistant',
    status: 'inactive',
    apiKey: 'fibb_sct_live_77b4d99812cc33ea',
    createdAt: '2026-02-10T14:00:00Z',
    lastActive: 'Hier à 19:40'
  },
  {
    id: 'scout-4',
    fullName: 'Aminata Traoré',
    username: 'scout.yamoussoukro',
    email: 'a.traore.scout@fibb.ci',
    phone: '+225 07 90 11 33 22',
    assignedMatchId: 'm4',
    assignedMatchLabel: 'SOA (Armée) vs SGCI Basket (N1_H)',
    role: 'scout_operator',
    status: 'active',
    apiKey: 'fibb_sct_live_55fa110099bb44cd',
    createdAt: '2026-02-18T09:00:00Z',
    lastActive: 'Il y a 2 heures'
  }
];

export const INITIAL_SCOUT_FEED_EVENTS: ScoutFeedEvent[] = [
  {
    id: 'sfe-101',
    matchId: 'm1',
    matchLabel: 'ABC Fighters vs JCA Abidjan',
    scoutId: 'scout-1',
    scoutName: 'Mamadou Koné',
    timestamp: '19:48:12',
    quarter: 'Q4',
    gameClock: '02:45',
    type: 'score_2',
    team: 'home',
    teamName: 'ABC Fighters',
    playerId: 'p1',
    playerName: 'S. Dieng #10',
    pointsAdded: 2,
    syncedToPostgres: false
  },
  {
    id: 'sfe-102',
    matchId: 'm1',
    matchLabel: 'ABC Fighters vs JCA Abidjan',
    scoutId: 'scout-1',
    scoutName: 'Mamadou Koné',
    timestamp: '19:47:30',
    quarter: 'Q4',
    gameClock: '03:10',
    type: 'foul',
    team: 'away',
    teamName: 'JCA Abidjan',
    playerId: 'p7',
    playerName: 'A. Konontsuk #14',
    syncedToPostgres: false
  },
  {
    id: 'sfe-103',
    matchId: 'm1',
    matchLabel: 'ABC Fighters vs JCA Abidjan',
    scoutId: 'scout-1',
    scoutName: 'Mamadou Koné',
    timestamp: '19:46:05',
    quarter: 'Q4',
    gameClock: '03:52',
    type: 'score_3',
    team: 'away',
    teamName: 'JCA Abidjan',
    playerId: 'p8',
    playerName: 'O. Klassen #33',
    pointsAdded: 3,
    syncedToPostgres: false
  },
  {
    id: 'sfe-104',
    matchId: 'm1',
    matchLabel: 'ABC Fighters vs JCA Abidjan',
    scoutId: 'scout-1',
    scoutName: 'Mamadou Koné',
    timestamp: '19:44:20',
    quarter: 'Q4',
    gameClock: '04:15',
    type: 'rebound',
    team: 'home',
    teamName: 'ABC Fighters',
    playerId: 'p3',
    playerName: 'K. Stephane #15',
    syncedToPostgres: true
  },
  {
    id: 'sfe-105',
    matchId: 'm2',
    matchLabel: 'CBA Abidjan vs Fusion BC',
    scoutId: 'scout-2',
    scoutName: 'Patrick Bamba Yao',
    timestamp: '18:50:00',
    quarter: 'Q4',
    gameClock: '00:00',
    type: 'score_2',
    team: 'home',
    teamName: 'CBA Abidjan',
    playerId: 'cba-p2',
    playerName: 'L. Touré #4',
    pointsAdded: 2,
    syncedToPostgres: true
  }
];

export const POSTGRES_TABLE_SCHEMAS = `-- Schéma SQL de la base de données PostgreSQL pour FIBB Score
-- Prêt pour exécution sur PostgreSQL / Cloud SQL

CREATE TABLE IF NOT EXISTS teams (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  short_name VARCHAR(50) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  city VARCHAR(100) NOT NULL,
  badge_bg VARCHAR(100) DEFAULT '',
  badge_text_color VARCHAR(50) DEFAULT '',
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
  id VARCHAR(32) PRIMARY KEY,
  league_id VARCHAR(32) NOT NULL,
  league_name VARCHAR(100) NOT NULL,
  league_sub VARCHAR(50),
  home_team_id VARCHAR(32) REFERENCES teams(id),
  away_team_id VARCHAR(32) REFERENCES teams(id),
  home_score INT DEFAULT 0,
  away_score INT DEFAULT 0,
  status VARCHAR(50) NOT NULL,
  status_type VARCHAR(20) NOT NULL CHECK (status_type IN ('live', 'finished', 'upcoming')),
  venue VARCHAR(150),
  city VARCHAR(100),
  fouls_home VARCHAR(10) DEFAULT '0/5',
  fouls_away VARCHAR(10) DEFAULT '0/5',
  timeouts_home INT DEFAULT 0,
  timeouts_away INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_tag VARCHAR(150),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scouts (
  id VARCHAR(32) PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30),
  role VARCHAR(30) DEFAULT 'scout_operator',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_duty')),
  api_key VARCHAR(100) UNIQUE,
  assigned_match_id VARCHAR(32) REFERENCES matches(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS match_events (
  id VARCHAR(64) PRIMARY KEY,
  match_id VARCHAR(32) REFERENCES matches(id) ON DELETE CASCADE,
  scout_id VARCHAR(32) REFERENCES scouts(id),
  quarter VARCHAR(10) NOT NULL,
  game_clock VARCHAR(20) NOT NULL,
  event_type VARCHAR(30) NOT NULL, -- 'score_2', 'score_3', 'free_throw', 'foul', 'rebound', 'turnover', 'timeout'
  team_side VARCHAR(10) CHECK (team_side IN ('home', 'away')),
  player_id VARCHAR(64),
  points_added INT DEFAULT 0,
  raw_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS standings (
  id SERIAL PRIMARY KEY,
  league_id VARCHAR(32) NOT NULL,
  team_id VARCHAR(32) REFERENCES teams(id),
  rank INT NOT NULL,
  mj INT DEFAULT 0,
  v INT DEFAULT 0,
  d INT DEFAULT 0,
  pp INT DEFAULT 0,
  pc INT DEFAULT 0,
  diff VARCHAR(20) DEFAULT '0',
  pts INT DEFAULT 0,
  zone VARCHAR(20) DEFAULT 'mid',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;
