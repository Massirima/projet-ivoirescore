import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface AdBannerProps {
  placement: 'horizontal' | 'vertical';
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement }) => {
  const { isLight } = useTheme();

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Google Ads error:', err);
    }
  }, []);

  const isHorizontal = placement === 'horizontal';
  const containerClasses = isHorizontal
    ? "w-full max-w-[970px] min-h-[90px]"
    : "w-[120px] lg:w-[160px] xl:w-[200px] min-h-[450px]";

  return (
    <div className={`flex justify-center w-full h-full`}>
      <div
        className={`${containerClasses} rounded-xl overflow-hidden flex items-center justify-center border border-dashed relative ${
          isLight ? 'bg-slate-100/50 border-slate-300' : 'bg-white/5 border-white/20'
        }`}
      >
        {/* Placeholder text for development/adblockers */}
        <span className={`absolute uppercase tracking-widest font-mono font-bold text-center px-2 ${
          isHorizontal ? 'text-[10px]' : 'text-[10px] transform -rotate-90 md:rotate-0'
        } ${
          isLight ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Espace Publicitaire
        </span>

        {/* Actual Google Ad Component */}
        <ins
          className="adsbygoogle relative z-10 block"
          style={{ display: 'block', width: '100%', minHeight: isHorizontal ? '90px' : '450px' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // TODO: Replace with real client ID
          data-ad-slot="XXXXXXXXXX"               // TODO: Replace with real slot ID
          data-ad-format={isHorizontal ? 'horizontal' : 'vertical'}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
