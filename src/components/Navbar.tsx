import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Volume2, VolumeX, Bell, Settings, X, Shield, QrCode, Sun, Moon, Laptop } from 'lucide-react';
import { ScreenType } from '../types';
import { BrandLogo } from './BrandLogo';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentScreen?: ScreenType;
  onSelectScreen?: (screen: ScreenType) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  isLiveSimulating?: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTriggerRefresh?: () => void;
  onOpenUserModal?: () => void;
  onOpenSettingsModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onSelectScreen,
  unreadNotificationsCount,
  onOpenNotifications,
  soundEnabled,
  onToggleSound,
  onOpenUserModal,
  onOpenSettingsModal
}) => {
  const { theme, preference, isLight, isSystem, toggleTheme, setTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const isSearchActive = currentScreen === 'recherche';

  const handleSearchClick = () => {
    if (onSelectScreen) {
      if (isSearchActive) {
        onSelectScreen('matchs');
      } else {
        onSelectScreen('recherche');
      }
    }
  };

  return (
    <header 
      id="main-header" 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        isLight
          ? 'bg-white/95 border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-slate-800'
          : 'bg-[#090D14]/95 border-white/10 text-white'
      }`}
    >
      {/* Subtle glass radial gradient overlay interacting with background */}
      <div 
        className={`absolute inset-0 pointer-events-none rounded-none ${
          isLight
            ? 'bg-[radial-gradient(ellipse_80%_120%_at_50%_-20%,rgba(255,101,0,0.06)_0%,transparent_70%)]'
            : 'bg-[radial-gradient(ellipse_80%_120%_at_50%_-20%,rgba(255,255,255,0.06)_0%,rgba(255,101,0,0.04)_40%,transparent_80%)]'
        }`} 
      />
      <div id="header-main-container" className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Far Left: Brand Logo */}
        <div id="header-brand-wrapper" className="flex items-center justify-start shrink-0">
          <div 
            id="brand-logo"
            onClick={() => onSelectScreen && onSelectScreen('matchs')} 
            className="flex items-center cursor-pointer group select-none"
            title="voirScore - Accueil Matchs FIBB"
          >
            <BrandLogo />
          </div>
        </div>

        {/* Far Right: Action icons */}
        <div id="header-actions-wrapper" className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 relative">
          {/* Sound Toggle Button */}
          <button
            id="btn-sound-toggle"
            onClick={onToggleSound}
            title={soundEnabled ? 'Effets sonores activés' : 'Effets sonores muets'}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition shadow-sm ${
              isLight
                ? 'bg-slate-100/90 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/90'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-emerald-500" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-slate-400" />
            )}
          </button>

          {/* Search Loupe Button (Replaces old notifications button, with active selected effect) */}
          <button
            id="btn-notifications"
            data-action="search"
            onClick={handleSearchClick}
            title="Recherche générale (équipes, joueurs, compétitions)"
            className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer ${
              isSearchActive
                ? 'bg-gradient-to-br from-orange-500/25 to-amber-500/25 border-2 border-orange-500 text-orange-500 ring-4 ring-orange-500/25 shadow-[0_0_18px_rgba(255,107,0,0.35)] scale-105'
                : isLight
                  ? 'bg-slate-100/90 border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-200/90'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <Search className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 transition-transform ${isSearchActive ? 'scale-110 text-orange-500' : ''}`} />
          </button>

          {/* User Account Badge with Notification Point on Head */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              id="user-profile-badge"
              aria-label="Menu profil utilisateur et actions"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen((prev) => !prev);
              }}
              className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer select-none active:scale-95 ${
                userMenuOpen 
                  ? 'border-orange-500 ring-2 ring-orange-500/40 text-orange-500 shadow-[0_0_14px_rgba(255,101,0,0.25)]' 
                  : isLight
                    ? 'bg-gradient-to-br from-orange-500/15 to-emerald-500/15 border-orange-500/35 text-orange-600 hover:border-orange-500 hover:bg-orange-500/25'
                    : 'bg-gradient-to-br from-orange-500/20 to-emerald-500/20 border-orange-500/30 text-orange-400 hover:text-white hover:bg-orange-500/30 hover:border-orange-500/60'
              }`}
              title="Compte Supporter FIBB (Cliquez pour afficher les actions)"
            >
              {/* Person SVG */}
              <User className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />

              {/* Red notification dot placed right on the head of the person */}
              {unreadNotificationsCount > 0 && (
                <span 
                  id="user-head-notif-dot"
                  className={`absolute -top-0.5 right-0.5 sm:right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-600 ring-2 shadow-md shadow-red-600/50 animate-pulse pointer-events-none ${
                    isLight ? 'ring-white' : 'ring-[#090D14]'
                  }`}
                  title="Nouvelles notifications reçues"
                />
              )}
            </button>

            {/* Dropdown Menu when user clicks the account icon */}
            {userMenuOpen && (
              <div 
                id="user-account-menu"
                className={`absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)] backdrop-blur-2xl border rounded-2xl p-2.5 z-[60] animate-fadeIn divide-y transition-all duration-200 ${
                  isLight
                    ? 'bg-white/98 border-slate-200/90 shadow-[0_12px_30px_rgba(0,0,0,0.08),0_0_15px_rgba(255,101,0,0.04)] divide-slate-100 text-slate-900 ring-1 ring-slate-900/5'
                    : 'bg-[#0D1424]/98 border-white/20 shadow-[0_12px_30px_rgba(0,0,0,0.55),0_0_18px_rgba(255,101,0,0.12)] divide-white/10 text-white ring-1 ring-white/10'
                }`}
              >
                {/* 1er élément: Nom d'utilisateur devant l'icône, écrit 'User' */}
                <div 
                  id="menu-item-user-profile"
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenUserModal?.();
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer group mb-1 ${
                    isLight ? 'hover:bg-slate-100/80' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500/20 to-emerald-500/20 border border-orange-500/40 flex items-center justify-center text-orange-500 group-hover:scale-105 transition shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-black transition ${isLight ? 'text-slate-900 group-hover:text-orange-600' : 'text-white group-hover:text-orange-300'}`}>User</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Supporter FIBB Officiel</p>
                  </div>
                </div>

                {/* 2ème élément: QR Tickets */}
                <div className="py-1">
                  <div
                    id="menu-item-qr-tickets"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenUserModal?.();
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer group select-none ${
                      isLight ? 'hover:bg-slate-100/80' : 'hover:bg-white/5'
                    }`}
                    title="Ce service sera bientôt disponible"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition shrink-0 ${
                        isLight
                          ? 'bg-slate-100 border-slate-200 text-slate-500 group-hover:text-amber-600 group-hover:border-amber-500/40'
                          : 'bg-white/5 border-white/10 text-slate-400 group-hover:text-amber-400 group-hover:border-amber-500/30'
                      }`}>
                        <QrCode className="w-4 h-4 opacity-70" />
                      </div>
                      <div>
                        <div className={`text-sm font-bold transition filter blur-[2.5px] select-none opacity-50 ${
                          isLight ? 'text-slate-800' : 'text-slate-200'
                        }`}>
                          QR Tickets
                        </div>
                        <p className={`text-[11px] filter blur-[1.5px] select-none opacity-40 ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          Billetterie & Accès
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-tight whitespace-nowrap flex items-center gap-1 ${
                      isLight
                        ? 'bg-amber-100/90 text-amber-800 border-amber-300'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Bientôt disponible
                    </span>
                  </div>
                </div>

                {/* 3ème élément: Symbole de notification */}
                <div className="py-1">
                  <div
                    id="menu-item-notifications-list"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenNotifications();
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer group ${
                      isLight ? 'hover:bg-slate-100/80' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`relative w-9 h-9 rounded-full border flex items-center justify-center transition shrink-0 ${
                        isLight
                          ? 'bg-slate-100 border-slate-200 text-slate-600 group-hover:text-orange-600 group-hover:border-orange-500/40'
                          : 'bg-white/5 border-white/10 text-slate-300 group-hover:text-white group-hover:border-orange-500/40'
                      }`}>
                        <Bell className="w-4 h-4" />
                        {unreadNotificationsCount > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white dark:ring-[#0D1424] animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className={`text-sm font-bold transition ${isLight ? 'text-slate-800 group-hover:text-slate-950' : 'text-slate-200 group-hover:text-white'}`}>
                          Notifications
                        </div>
                        <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {unreadNotificationsCount > 0
                            ? `${unreadNotificationsCount} nouvelle${unreadNotificationsCount > 1 ? 's' : ''} alerte${unreadNotificationsCount > 1 ? 's' : ''}`
                            : 'Toutes les alertes lues'}
                        </div>
                      </div>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 text-[10px] font-bold font-mono">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* 4ème élément: Bascule directe Mode Auto (OS) / Sombre / Clair (3 possibilités) */}
                <div className="py-1">
                  <div
                    id="menu-item-theme-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTheme();
                    }}
                    className={`p-2.5 rounded-xl transition cursor-pointer group ${
                      isLight 
                        ? 'hover:bg-slate-100/90 bg-slate-50/70 border border-slate-200/60' 
                        : 'hover:bg-white/[0.07] bg-white/[0.02] border border-white/5'
                    }`}
                    title={
                      preference === 'system'
                        ? `Mode Auto (OS) actif (${isLight ? 'Clair détecté' : 'Sombre détecté'}) - Cliquez pour passer en Sombre`
                        : preference === 'dark'
                        ? 'Mode Sombre forcé - Cliquez pour passer en Clair'
                        : 'Mode Clair forcé - Cliquez pour passer en Auto (OS)'
                    }
                  >
                    {/* En-tête : Icône, Titre du mode actuel et Badge d'état */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition shrink-0 ${
                          preference === 'system'
                            ? isLight
                              ? 'bg-orange-500/15 border-orange-500/35 text-orange-600'
                              : 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                            : preference === 'dark'
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                        }`}>
                          {preference === 'system' ? (
                            <Laptop className="w-4 h-4" />
                          ) : preference === 'dark' ? (
                            <Moon className="w-4 h-4" />
                          ) : (
                            <Sun className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className={`text-sm font-bold transition flex items-center gap-1.5 ${
                            isLight ? 'text-slate-800 group-hover:text-slate-950' : 'text-slate-200 group-hover:text-white'
                          }`}>
                            <span>
                              {preference === 'system'
                                ? 'Mode Auto (OS)'
                                : preference === 'dark'
                                ? 'Mode Sombre'
                                : 'Mode Clair'}
                            </span>
                            {preference === 'system' && (
                              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-orange-500/15 text-orange-500 border border-orange-500/30">
                                SYNC OS
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {preference === 'system'
                              ? `Synchronisé OS (${isLight ? 'Clair' : 'Sombre'})`
                              : preference === 'dark'
                              ? 'Thème Sombre forcé'
                              : 'Thème Clair forcé'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 shrink-0 ${
                        preference === 'system'
                          ? isLight
                            ? 'bg-orange-100 text-orange-800 border border-orange-300'
                            : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : preference === 'dark'
                          ? 'bg-slate-800 text-slate-300 border border-white/10'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {preference === 'system' ? 'Auto OS' : preference === 'dark' ? 'Sombre' : 'Clair'}
                      </span>
                    </div>

                    {/* Sélecteur direct des 3 possibilités de base */}
                    <div 
                      className={`grid grid-cols-3 gap-1 mt-2.5 p-1 rounded-lg border ${
                        isLight ? 'bg-slate-200/70 border-slate-200' : 'bg-slate-950/70 border-white/10'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        id="menu-btn-theme-system"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTheme('system');
                        }}
                        className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-md text-[10px] font-black transition cursor-pointer ${
                          preference === 'system'
                            ? 'bg-orange-500 text-white shadow-sm'
                            : isLight
                            ? 'text-slate-600 hover:text-slate-950 hover:bg-white/70'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Mode Auto : synchronisé en temps réel avec votre système d'exploitation (OS)"
                      >
                        <Laptop className="w-3 h-3 shrink-0" />
                        <span>Auto OS</span>
                      </button>

                      <button
                        type="button"
                        id="menu-btn-theme-dark"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTheme('dark');
                        }}
                        className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-md text-[10px] font-black transition cursor-pointer ${
                          preference === 'dark'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : isLight
                            ? 'text-slate-600 hover:text-slate-950 hover:bg-white/70'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Mode Sombre permanent"
                      >
                        <Moon className="w-3 h-3 shrink-0" />
                        <span>Sombre</span>
                      </button>

                      <button
                        type="button"
                        id="menu-btn-theme-light"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTheme('light');
                        }}
                        className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-md text-[10px] font-black transition cursor-pointer ${
                          preference === 'light'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : isLight
                            ? 'text-slate-600 hover:text-slate-950 hover:bg-white/70'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Mode Clair permanent"
                      >
                        <Sun className="w-3 h-3 shrink-0" />
                        <span>Clair</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5ème élément: Icône de paramètre et inscription 'Paramètre' devant */}
                <div className="pt-1">
                  <div
                    id="menu-item-settings-page"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenSettingsModal?.();
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer group ${
                      isLight ? 'hover:bg-slate-100/80' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition shrink-0 ${
                      isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-600 group-hover:text-slate-950 group-hover:border-orange-500/40'
                        : 'bg-white/5 border-white/10 text-slate-300 group-hover:text-white group-hover:border-orange-500/40'
                    }`}>
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold transition ${isLight ? 'text-slate-800 group-hover:text-slate-950' : 'text-slate-200 group-hover:text-white'}`}>
                        Paramètre
                      </div>
                      <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Préférences, thèmes & son</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

