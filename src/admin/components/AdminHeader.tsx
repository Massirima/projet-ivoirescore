import React from 'react';
import { Shield, Database, LogOut, Laptop, Moon, Sun, Radio, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../../components/BrandLogo';
import { AdminUser } from '../../types';

interface AdminHeaderProps {
  adminUser: AdminUser;
  onLogout: () => void;
  activeScoutsCount: number;
  liveMatchesCount: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminUser,
  onLogout,
  activeScoutsCount,
  liveMatchesCount
}) => {
  const { preference, isLight, setTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${
      isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-[#0b0e14]/90 border-white/10 shadow-lg shadow-black/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand + Admin Pill */}
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" />
          <div className="hidden sm:block h-6 w-px bg-slate-300 dark:bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white flex items-center gap-1 shadow-sm">
              <Shield className="w-3 h-3" />
              Console Admin
            </span>
            <span className={`text-xs font-bold hidden md:inline ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              FIBB Basketball CI
            </span>
          </div>
        </div>

        {/* Center: Live Indicators */}
        <div className="hidden lg:flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full border text-xs font-mono flex items-center gap-2 ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-slate-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{liveMatchesCount} Match(s) Live</span>
          </div>

          <div className={`px-3 py-1 rounded-full border text-xs font-mono flex items-center gap-2 ${
            isLight ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-orange-500/10 border-orange-500/20 text-orange-300'
          }`}>
            <Radio className="w-3.5 h-3.5 text-orange-500" />
            <span>{activeScoutsCount} Scout(s) Connecté(s)</span>
          </div>

          <div className={`px-2.5 py-1 rounded-full border text-[11px] font-mono flex items-center gap-1.5 ${
            isLight ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
          }`}>
            <Database className="w-3 h-3 text-blue-500" />
            <span>PostgreSQL: En attente</span>
          </div>
        </div>

        {/* Right: Theme Toggle + Admin Profile + Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 3-State Theme Cycler */}
          <div className={`flex items-center p-0.5 rounded-lg border text-xs ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <button
              onClick={() => setTheme('system')}
              className={`px-2 py-1 rounded-md transition text-[10px] font-bold flex items-center gap-1 ${
                preference === 'system'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
              title="Synchronisation automatique OS"
            >
              <Laptop className="w-3 h-3" />
              <span className="hidden sm:inline">Auto</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-2 py-1 rounded-md transition text-[10px] font-bold flex items-center gap-1 ${
                preference === 'dark'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
              title="Mode Sombre"
            >
              <Moon className="w-3 h-3" />
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-2 py-1 rounded-md transition text-[10px] font-bold flex items-center gap-1 ${
                preference === 'light'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
              title="Mode Clair"
            >
              <Sun className="w-3 h-3" />
            </button>
          </div>

          {/* Admin user info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
              AD
            </div>
            <div className="hidden md:block text-left">
              <div className={`text-xs font-bold leading-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                {adminUser.username}
              </div>
              <div className="text-[10px] text-orange-500 font-mono font-bold">
                {adminUser.role}
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            id="admin-logout-btn"
            onClick={onLogout}
            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                : 'border-white/10 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
            }`}
            title="Se déconnecter de la console"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </div>
    </header>
  );
};
