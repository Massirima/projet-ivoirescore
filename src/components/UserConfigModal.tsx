import React from 'react';
import { User, Settings, X, Check, Bell, Volume2, ShieldCheck, Sparkles, Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface UserConfigModalProps {
  mode: 'user' | 'settings';
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const UserConfigModal: React.FC<UserConfigModalProps> = ({
  mode,
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound
}) => {
  const { theme, preference, isLight, isSystem, toggleTheme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        id="user-config-modal-card"
        className={`border rounded-3xl max-w-md w-full p-6 space-y-5 relative transition-all duration-300 ${
          isLight
            ? 'bg-white border-slate-200/90 text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.1)]'
            : 'bg-[#0D1424] border-white/15 text-white shadow-xl'
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Fermer la boîte de dialogue"
          className={`absolute top-4 right-4 p-2 rounded-full transition ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {mode === 'user' ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-emerald-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                  COMPTE SUPPORTER
                </span>
                <h3 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Profil User</h3>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
              isLight ? 'bg-orange-50/80 border-orange-200 text-orange-950' : 'bg-orange-500/10 border-orange-500/20 text-orange-200'
            }`}>
              <Sparkles className="w-5 h-5 text-orange-500 shrink-0" />
              <p className="text-xs">
                Écran supporter FIBB prêt pour personnalisation complète du profil, avatar et clubs favoris.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-white/5 border-white/10'
              }`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Nom d'affichage</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>User</span>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-white/5 border-white/10'
              }`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Rôle FIBB</span>
                <span className="font-bold text-emerald-500">Supporter Officiel N1</span>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-white/5 border-white/10'
              }`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Statut</span>
                <span className={`flex items-center gap-1.5 font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Connecté
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
                isLight ? 'bg-orange-500/10 border-orange-500/25 text-orange-600' : 'bg-white/10 border-white/20 text-slate-200'
              }`}>
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">
                  PRÉFÉRENCES SYSTÈME
                </span>
                <h3 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Paramètres</h3>
              </div>
            </div>

            {/* THEME TOGGLE HERO CARD */}
            <div 
              id="theme-settings-toggle-card"
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 ${
                isLight
                  ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-orange-200/90 shadow-sm'
                  : 'bg-gradient-to-r from-orange-500/15 to-amber-500/15 border-orange-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  {isSystem ? (
                    <Laptop className="w-5 h-5 text-orange-500" />
                  ) : isLight ? (
                    <Sun className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-blue-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        Thème d'affichage
                      </h4>
                      {isSystem && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-500 border border-orange-500/30">
                          AUTO OS
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {preference === 'system'
                        ? `Détection automatique OS (actuellement ${isLight ? 'Clair' : 'Sombre'})`
                        : preference === 'light'
                        ? 'Mode Clair forcé (Porcelaine Sport)'
                        : 'Mode Sombre forcé (Obsidienne Sport)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Segmented Triple Switch (Auto OS / Sombre / Clair) */}
              <div className={`grid grid-cols-3 p-1 rounded-xl border gap-1 ${
                isLight ? 'bg-white border-slate-200' : 'bg-black/40 border-white/10'
              }`}>
                <button
                  type="button"
                  id="btn-theme-system"
                  onClick={() => setTheme('system')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    preference === 'system'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                      : isLight 
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Détecter automatiquement la préférence du système d'exploitation"
                >
                  <Laptop className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Auto</span>
                </button>

                <button
                  type="button"
                  id="btn-theme-dark"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    preference === 'dark'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                      : isLight 
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Sombre</span>
                </button>

                <button
                  type="button"
                  id="btn-theme-light"
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    preference === 'light'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                      : isLight 
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Clair</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center gap-2 font-medium">
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Sons des paniers & buzzer</span>
                </div>
                <button
                  type="button"
                  onClick={onToggleSound}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    soundEnabled
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  {soundEnabled ? 'Activé' : 'Désactivé'}
                </button>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center gap-2 font-medium">
                  <Bell className="w-4 h-4 text-orange-500" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Alertes scores en direct</span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Instantané</span>
              </div>
            </div>
          </>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
