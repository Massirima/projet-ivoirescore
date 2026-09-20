import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Star, Calendar } from 'lucide-react';
import { ScreenType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LiquidGlassNavProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  favoritesCount?: number;
}

export const LiquidGlassNav: React.FC<LiquidGlassNavProps> = ({
  currentScreen,
  onSelectScreen,
  favoritesCount = 0
}) => {
  const { isLight } = useTheme();
  const tabs = [
    {
      id: 'matchs' as ScreenType,
      label: 'MATCHS',
      mobileLabel: 'Matchs',
      icon: Flame,
      badge: 'LIVE'
    },
    {
      id: 'classements' as ScreenType,
      label: 'CLASSEMENTS',
      mobileLabel: 'Classement',
      icon: Trophy
    },
    {
      id: 'favoris' as ScreenType,
      label: 'FAVORIS',
      mobileLabel: 'Favoris',
      icon: Star,
      count: favoritesCount
    },
    {
      id: 'calendrier' as ScreenType,
      label: 'CALENDRIER',
      mobileLabel: 'Calendrier',
      icon: Calendar
    }
  ];

  // Modern scroll detection with futuristic dynamic HUD morphing
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      id="liquid-glass-nav-container"
      className="sticky top-[50px] sm:top-[56px] z-40 w-full flex justify-center items-center pt-1.5 pb-2 sm:pt-2 sm:pb-2.5 px-2 sm:px-4 pointer-events-none transition-all duration-300 ease-out"
    >
      {/* Futuristic Dynamic HUD Dock: Morphs into an aerodynamic floating capsule on vertical scroll */}
      <nav
        id="nav-tabs"
        aria-label="Navigation principale"
        className={`relative w-full select-none pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? isLight
              ? 'max-w-[340px] sm:max-w-fit rounded-full py-1 px-1 sm:px-2.5 sm:py-1 bg-white/92 backdrop-blur-2xl border border-slate-200/90 shadow-[0_8px_20px_rgba(0,0,0,0.06),0_0_14px_rgba(255,101,0,0.08)] ring-1 ring-orange-500/20 grid grid-cols-4 gap-0.5 sm:flex sm:items-center sm:gap-1.5'
              : 'max-w-[340px] sm:max-w-fit rounded-full py-1 px-1 sm:px-2.5 sm:py-1 bg-[#040812]/92 sm:bg-[#060D1A]/90 backdrop-blur-2xl border border-white/20 sm:border-white/25 shadow-[0_8px_22px_rgba(0,0,0,0.5),0_0_16px_rgba(255,101,0,0.14),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-1 ring-orange-500/25 grid grid-cols-4 gap-0.5 sm:flex sm:items-center sm:gap-1.5'
            : isLight
              ? 'max-w-[380px] sm:max-w-fit rounded-2xl sm:rounded-full p-1.5 sm:p-2 bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_14px_rgba(0,0,0,0.035)] ring-1 ring-slate-900/5 grid grid-cols-4 gap-1 sm:flex sm:items-center sm:gap-2'
              : 'max-w-[380px] sm:max-w-fit rounded-2xl sm:rounded-full p-1.5 sm:p-2 bg-[#0A101D]/80 sm:bg-slate-900/75 backdrop-blur-xl border border-white/12 shadow-[0_5px_18px_rgba(0,0,0,0.32),inset_0_1px_1px_rgba(255,255,255,0.12)] ring-1 ring-white/5 grid grid-cols-4 gap-1 sm:flex sm:items-center sm:gap-2'
        }`}
      >
        {/* Subtle Ambient Radial Back-Glow interacting with the background */}
        <div className={`absolute -inset-1 rounded-2xl sm:rounded-full blur-md pointer-events-none -z-10 ${
          isLight 
            ? 'bg-[radial-gradient(ellipse_at_center,rgba(255,101,0,0.12),transparent_70%)]' 
            : 'bg-[radial-gradient(ellipse_at_center,rgba(255,101,0,0.16),transparent_70%)]'
        }`} />

        {/* Premium Glass-Like Radial Gradient Overlay */}
        <div id="nav-radial-glass-overlay" className="absolute inset-0 rounded-2xl sm:rounded-full overflow-hidden pointer-events-none">
          {/* Optical curved surface specular refraction */}
          <div className={`absolute inset-0 mix-blend-overlay ${
            isLight
              ? 'bg-[radial-gradient(ellipse_120%_100%_at_50%_-15%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.2)_45%,transparent_75%)]'
              : 'bg-[radial-gradient(ellipse_120%_100%_at_50%_-15%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_45%,transparent_75%)]'
          }`} />
          {/* Deep luminous chromatic interaction with the background court */}
          <div className={`absolute inset-0 ${
            isLight
              ? 'bg-[radial-gradient(circle_at_50%_125%,rgba(255,101,0,0.08)_0%,transparent_80%)]'
              : 'bg-[radial-gradient(circle_at_50%_125%,rgba(255,101,0,0.14)_0%,rgba(15,23,42,0.3)_60%,transparent_100%)]'
          }`} />
        </div>

        {/* Futuristic Laser Light Beam on Top Rim */}
        <div className="absolute inset-x-4 sm:inset-x-6 top-0 h-[1.5px] overflow-hidden rounded-full pointer-events-none">
          <div
            className={`h-full w-full bg-gradient-to-r from-transparent via-[#FF6500] via-amber-300 to-transparent transition-all duration-500 ${
              isScrolled ? 'opacity-100 shadow-[0_0_8px_#FF6500]' : 'opacity-40'
            }`}
          />
        </div>

        {/* Ambient Holographic Reflection Gradient */}
        <div className={`absolute inset-0 rounded-inherit pointer-events-none rounded-2xl sm:rounded-full ${
          isLight ? 'bg-gradient-to-b from-white/40 to-transparent' : 'bg-gradient-to-b from-white/[0.06] to-transparent'
        }`} />

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              onClick={() => onSelectScreen(tab.id)}
              className={`relative flex flex-col sm:flex-row items-center justify-center select-none whitespace-nowrap shrink-0 group transition-all duration-200 ease-out ${
                isScrolled
                  ? 'gap-0.5 sm:gap-1.5 py-1 px-1 sm:px-3 rounded-full text-[11px]'
                  : 'gap-0.5 sm:gap-2 py-1.5 px-1 sm:px-4 rounded-xl sm:rounded-full text-xs'
              } ${
                isActive
                  ? 'bg-gradient-to-b sm:bg-gradient-to-r from-[#FF6500] via-[#FF7500] to-[#E55500] text-white shadow-[0_2px_8px_rgba(255,101,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] sm:shadow-[0_3px_12px_rgba(255,101,0,0.28)] ring-1 ring-white/30 font-bold sm:font-black'
                  : isLight
                    ? 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-100/80 active:scale-95'
                    : 'text-slate-400 hover:text-white bg-transparent hover:bg-white/[0.07] active:scale-95'
              }`}
            >
              {/* Icon Container with Anchored Top Badges */}
              <div className="relative inline-flex items-center justify-center">
                <Icon
                  className={`relative z-10 transition-transform duration-200 ${
                    isScrolled
                      ? 'w-3.5 h-3.5 sm:w-3.5 sm:h-3.5'
                      : 'w-4 h-4 sm:w-3.5 sm:h-3.5'
                  } ${
                    isActive
                      ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                      : isLight
                        ? 'text-slate-500 group-hover:text-slate-900'
                        : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {/* Mobile Pulse Dot on Top of Icon for Live matches */}
                {tab.badge && (
                  <span
                    className="sm:hidden absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none z-20"
                    title="Matchs en direct"
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
                    <span className={`relative inline-flex rounded-full h-2 w-2 bg-red-500 ring-1 ${isLight ? 'ring-white' : 'ring-[#040812]'}`} />
                  </span>
                )}

                {/* Mobile Favorites Count Pill - STRICTLY ON TOP OF THE ICON */}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    id="favoris-count-badge-icon"
                    className={`sm:hidden absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 rounded-full text-[8px] font-black flex items-center justify-center leading-none z-20 shadow-md ${
                      isActive
                        ? 'bg-white text-orange-600 ring-1 ring-black/20'
                        : isLight
                          ? 'bg-orange-500 text-white ring-1 ring-white'
                          : 'bg-orange-500 text-white ring-1 ring-[#040812]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </div>

              {/* Text Label: Adapts smoothly in scrolled mode */}
              <span
                className={`relative z-10 sm:hidden font-bold leading-none truncate max-w-full px-0.5 transition-all duration-200 ${
                  isScrolled ? 'text-[9.5px] tracking-tight' : 'text-[10px] tracking-tight'
                }`}
              >
                {tab.mobileLabel}
              </span>
              <span
                className={`relative z-10 hidden sm:inline font-black transition-all duration-200 ${
                  isScrolled ? 'text-[11px] tracking-wider' : 'text-xs tracking-wider'
                }`}
              >
                {tab.label}
              </span>

              {/* Desktop Live Beacon Badge */}
              {tab.badge && (
                <span
                  className={`relative z-10 hidden sm:inline-flex ml-0.5 rounded-full text-[9px] font-black tracking-widest uppercase items-center gap-1 transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white border border-white/40 px-1.5 py-0.2'
                      : isLight
                        ? 'bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.2'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {tab.badge}
                </span>
              )}

              {/* Desktop Favorites Counter Pill */}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  id="favoris-count-badge-desktop"
                  className={`relative z-10 hidden sm:inline-flex ml-0.5 min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-mono font-black items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#FF6500] shadow-sm'
                      : isLight
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'bg-orange-500/25 text-orange-400 border border-orange-500/40'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

