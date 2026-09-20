export type ScreenType = 'matchs' | 'classements' | 'favoris' | 'calendrier' | 'detail' | 'recherche';

export type MatchFilter = 'all' | 'live' | 'finished' | 'upcoming';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
  badgeBg: string;
  badgeTextColor: string;
  badgeBorderColor: string;
  logoUrl?: string;
  city: string;
}

export interface MatchPeriodScores {
  q1: [number, number];
  q2: [number, number];
  q3: [number, number];
  q4: [number, number];
  ot?: [number, number];
}

export interface Match {
  id: string;
  leagueId: string;
  leagueName: string;
  leagueSub: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | string;
  awayScore: number | string;
  status: string; // e.g. "Q4 02:45", "Terminé", "21:30 Ce soir"
  statusType: 'live' | 'finished' | 'upcoming';
  venue: string;
  city: string;
  fouls: {
    home: string; // "4/5"
    away: string; // "3/5"
  };
  timeouts: {
    home: number;
    away: number;
  };
  periodScores: MatchPeriodScores;
  isFeatured?: boolean;
  featuredTag?: string; // "CHOC DE LA JOURNÉE • DÔME PALAIS DES SPORTS"
}

export interface StandingRow {
  rank: number;
  team: string;
  shortName: string;
  code: string;
  badgeBg: string;
  badgeTextColor: string;
  note?: string; // "LEADER - DÉFENSE #1", "PLAYOFFS SÉCURISÉS", etc.
  mj: number;
  v: number;
  d: number;
  pp: number;
  pc: number;
  diff: string;
  pts: number;
  form: ('V' | 'D')[];
  zone: 'playoff' | 'mid' | 'relegation';
}

export interface PlayerStat {
  id: string;
  number: number;
  name: string;
  team: string;
  teamId: string;
  position: string;
  flag: string;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  min: number;
  fg: string; // "10/16"
  threePt: string; // "4/7"
  ft: string; // "8/9"
  fouls: number;
  isStarter: boolean;
  avatarUrl?: string;
}

export interface PlayByPlayEvent {
  id: string;
  time: string;
  quarter: string;
  teamId: string;
  teamName: string;
  text: string;
  type: 'score' | 'foul' | 'timeout' | 'sub';
  currentScore: string;
}

export interface TopScorer {
  rank: number;
  name: string;
  team: string;
  position: string;
  avgPts: number;
  games: number;
  avatarUrl?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'SUPER_ADMIN' | 'COMMISSIONER' | 'EDITOR' | string;
  token?: string;
  avatarUrl?: string;
}

export interface ScoutUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  assignedMatchId?: string;
  assignedMatchLabel?: string;
  role: 'scout_lead' | 'scout_operator' | 'scout_assistant';
  status: 'active' | 'inactive' | 'on_duty';
  apiKey: string;
  createdAt: string;
  lastActive?: string;
}

export interface ScoutFeedEvent {
  id: string;
  matchId: string;
  matchLabel: string;
  scoutId: string;
  scoutName: string;
  timestamp: string;
  quarter: string;
  gameClock: string;
  type: 'score_2' | 'score_3' | 'free_throw' | 'foul' | 'rebound' | 'turnover' | 'timeout';
  team: 'home' | 'away';
  teamName: string;
  playerId?: string;
  playerName?: string;
  pointsAdded?: number;
  syncedToPostgres: boolean;
}
