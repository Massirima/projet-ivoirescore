import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, CheckCircle2, Flame } from 'lucide-react';
import { Match } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CalendarScreenProps {
  onOpenMatch: (matchId: string) => void;
  matches: Match[];
}

interface CalendarRound {
  id: string;
  roundNumber: number;
  label: string;
  dates: string;
  status: 'past' | 'current' | 'upcoming';
  games: {
    id: string;
    home: string;
    homeCode: string;
    away: string;
    awayCode: string;
    time: string;
    date: string;
    venue: string;
    status: string;
    score?: string;
  }[];
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onOpenMatch, matches }) => {
  const { isLight } = useTheme();
  const [selectedRound, setSelectedRound] = useState<string>('j12');

  const rounds: CalendarRound[] = [
    {
      id: 'j11',
      roundNumber: 11,
      label: '11e Journée',
      dates: '22 - 23 Février 2026',
      status: 'past',
      games: [
        {
          id: 'g-11-1',
          home: 'ABC Fighters',
          homeCode: 'ABC',
          away: 'Warriors de Treichville',
          awayCode: 'WTC',
          time: '18:00',
          date: 'Samedi 22 Fév',
          venue: 'Palais des Sports, Treichville',
          status: 'Terminé',
          score: '92 - 68'
        },
        {
          id: 'g-11-2',
          home: 'JCA Abidjan',
          homeCode: 'JCA',
          away: 'SOA Basketball',
          awayCode: 'SOA',
          time: '20:15',
          date: 'Samedi 22 Fév',
          venue: 'Dôme Palais des Sports',
          status: 'Terminé',
          score: '84 - 79'
        },
        {
          id: 'g-11-3',
          home: 'Azur BC',
          homeCode: 'AZR',
          away: 'CBA Abidjan',
          awayCode: 'CBA',
          time: '16:00',
          date: 'Dimanche 23 Fév',
          venue: 'Complexe Jesse Jackson, Yopougon',
          status: 'Terminé',
          score: '71 - 75'
        }
      ]
    },
    {
      id: 'j12',
      roundNumber: 12,
      label: '12e Journée (En Cours)',
      dates: '01 - 02 Mars 2026',
      status: 'current',
      games: [
        {
          id: 'm1',
          home: 'ABC Fighters',
          homeCode: 'ABC',
          away: 'JCA Abidjan',
          awayCode: 'JCA',
          time: '18:30 (Live Q4)',
          date: 'Dimanche 01 Mars',
          venue: 'Dôme Palais des Sports, Treichville',
          status: 'En Direct',
          score: '98 - 94'
        },
        {
          id: 'm2',
          home: 'CBA Abidjan',
          homeCode: 'CBA',
          away: 'Fusion BC',
          awayCode: 'FUS',
          time: 'Terminé',
          date: 'Dimanche 01 Mars',
          venue: 'Palais des Sports, Treichville',
          status: 'Terminé',
          score: '108 - 105'
        },
        {
          id: 'm3',
          home: 'Hypersonic BC',
          homeCode: 'HBC',
          away: 'Abi-Snipers',
          awayCode: 'ASB',
          time: '20:45 (Live Q3)',
          date: 'Dimanche 01 Mars',
          venue: 'Salle Polyvalente, Treichville',
          status: 'En Direct',
          score: '82 - 76'
        },
        {
          id: 'm4',
          home: 'SOA Basketball',
          homeCode: 'SOA',
          away: 'Azur BC',
          awayCode: 'AZR',
          time: '21:30',
          date: 'Ce soir',
          venue: 'Complexe Jesse Jackson, Yopougon',
          status: 'À Venir'
        }
      ]
    },
    {
      id: 'j13',
      roundNumber: 13,
      label: '13e Journée',
      dates: '08 - 09 Mars 2026',
      status: 'upcoming',
      games: [
        {
          id: 'g-13-1',
          home: 'Warriors de Treichville',
          homeCode: 'WTC',
          away: 'CBA Abidjan',
          awayCode: 'CBA',
          time: '16:00',
          date: 'Samedi 08 Mars',
          venue: 'Palais des Sports, Treichville',
          status: 'À Venir'
        },
        {
          id: 'g-13-2',
          home: 'ABC Fighters',
          homeCode: 'ABC',
          away: 'SOA Basketball',
          awayCode: 'SOA',
          time: '18:30',
          date: 'Samedi 08 Mars',
          venue: 'Dôme Palais des Sports',
          status: 'Choc Attendu'
        },
        {
          id: 'g-13-3',
          home: 'JCA Abidjan',
          homeCode: 'JCA',
          away: 'Azur BC',
          awayCode: 'AZR',
          time: '20:45',
          date: 'Dimanche 09 Mars',
          venue: 'Palais des Sports, Treichville',
          status: 'À Venir'
        }
      ]
    },
    {
      id: 'playoffs',
      roundNumber: 14,
      label: 'Playoffs & Final Four',
      dates: 'Avril - Mai 2026',
      status: 'upcoming',
      games: [
        {
          id: 'po-1',
          home: '1er Saison Régulière',
          homeCode: 'TBD',
          away: '4e Saison Régulière',
          awayCode: 'TBD',
          time: '17:00',
          date: 'Samedi 18 Avril 2026',
          venue: 'Dôme Palais des Sports',
          status: 'Demi-Finale 1'
        },
        {
          id: 'po-2',
          home: '2e Saison Régulière',
          homeCode: 'TBD',
          away: '3e Saison Régulière',
          awayCode: 'TBD',
          time: '19:30',
          date: 'Samedi 18 Avril 2026',
          venue: 'Dôme Palais des Sports',
          status: 'Demi-Finale 2'
        }
      ]
    }
  ];

  const currentRoundData = rounds.find((r) => r.id === selectedRound) || rounds[1];

  return (
    <div id="calendar-screen" className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl border backdrop-blur-xl ${
        isLight
          ? 'bg-gradient-to-r from-emerald-500/10 via-white to-slate-50 border-emerald-500/30 shadow-sm'
          : 'bg-gradient-to-r from-emerald-500/15 via-slate-900/80 to-slate-900 border-emerald-500/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isLight
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
          }`}>
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg sm:text-xl font-black tracking-tight flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Calendrier Officiel FIBB
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                isLight
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                Saison 2026
              </span>
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
              Programme complet, horaires et salles des journées du championnat ivoirien
            </p>
          </div>
        </div>

        <div className={`text-xs flex items-center gap-2 ${isLight ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Phase Régulière N1</span>
        </div>
      </div>

      {/* Rounds Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {rounds.map((round) => {
          const isSelected = selectedRound === round.id;
          return (
            <button
              key={round.id}
              onClick={() => setSelectedRound(round.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-[#FF6500] text-white shadow-lg shadow-orange-500/30 scale-[1.02]'
                  : isLight
                  ? 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {round.label}
            </button>
          );
        })}
      </div>

      {/* Games in Selected Round */}
      <div className="space-y-3">
        <div className={`flex items-center justify-between text-xs px-1 ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          <span className={`font-bold uppercase tracking-wider ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {currentRoundData.label} • {currentRoundData.dates}
          </span>
          <span className="font-medium">{currentRoundData.games.length} rencontres</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentRoundData.games.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                const liveMatch = matches.find((m) => m.id === game.id);
                if (liveMatch) onOpenMatch(liveMatch.id);
              }}
              className={`group rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer backdrop-blur-xl border ${
                isLight
                  ? 'bg-white border-slate-200/90 hover:border-orange-500/50 shadow-sm hover:shadow-md'
                  : 'bg-slate-900/80 border-white/10 hover:border-orange-500/40 shadow-xl'
              }`}
            >
              <div className={`flex items-center justify-between gap-2 mb-3 pb-2.5 border-b text-xs ${
                isLight ? 'border-slate-100' : 'border-white/5'
              }`}>
                <div className={`flex items-center gap-2 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>{game.date} • {game.time}</span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    game.status === 'En Direct'
                      ? 'bg-red-500/20 text-red-500 border border-red-500/35 animate-pulse'
                      : game.status === 'Terminé'
                      ? isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                      : isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {game.status}
                </span>
              </div>

              {/* Match details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 font-black text-sm sm:text-base transition ${
                    isLight 
                      ? 'text-slate-900 group-hover:text-orange-600' 
                      : 'text-white group-hover:text-orange-400'
                  }`}>
                    <span className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-mono font-bold ${
                      isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-700'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}>
                      {game.homeCode}
                    </span>
                    <span>{game.home}</span>
                  </div>
                  {game.score && (
                    <span className={`font-mono font-black text-base ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {game.score.split('-')[0].trim()}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 font-black text-sm sm:text-base transition ${
                    isLight 
                      ? 'text-slate-900 group-hover:text-orange-600' 
                      : 'text-white group-hover:text-orange-400'
                  }`}>
                    <span className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-mono font-bold ${
                      isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-700'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}>
                      {game.awayCode}
                    </span>
                    <span>{game.away}</span>
                  </div>
                  {game.score && (
                    <span className={`font-mono font-black text-base ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {game.score.split('-')[1]?.trim() || ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Venue */}
              <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs ${
                isLight ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'
              }`}>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate">{game.venue}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
