import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const containerDimensions = {
    sm: 'h-6 sm:h-8',
    md: 'h-8 sm:h-10 md:h-11',
    lg: 'h-10 sm:h-12'
  }[size];

  return (
    <div id="brand-logo-content" className={`flex items-center select-none ${containerDimensions} ${className}`}>
      <img
        src="/logo.png"
        alt="voirScore Logo"
        className="h-full w-auto object-contain drop-shadow-sm transition-transform duration-200 hover:scale-[1.03]"
      />
    </div>
  );
};
