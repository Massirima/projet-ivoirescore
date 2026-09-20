import React from 'react';

interface ClubLogoProps {
  code: string;
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const ClubLogo: React.FC<ClubLogoProps> = ({
  code,
  name = '',
  className = '',
  size = 'full'
}) => {
  const normalizedCode = (code || '').toUpperCase().trim();

  // 1. ABC FIGHTERS (Abidjan Basketball Club)
  if (normalizedCode === 'ABC' || name.toLowerCase().includes('fighters') || name.toLowerCase().includes('abidjan basketball')) {
    return (
      <div className={`w-full h-full relative flex items-center justify-center overflow-hidden rounded-[inherit] ${className}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="abcRadial" cx="50%" cy="40%" r="68%">
              <stop offset="0%" stopColor="#C91818" />
              <stop offset="50%" stopColor="#960B0B" />
              <stop offset="100%" stopColor="#5E0000" />
            </radialGradient>
            <filter id="abcDrop" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Full background occupying container */}
          <rect width="200" height="200" fill="url(#abcRadial)" />

          {/* Watermark basketball seams */}
          <circle cx="100" cy="95" r="76" stroke="#480202" strokeWidth="6" opacity="0.4" />
          <path d="M24 95 Q 100 60 176 95" stroke="#480202" strokeWidth="5" fill="none" opacity="0.4" />
          <path d="M24 95 Q 100 130 176 95" stroke="#480202" strokeWidth="5" fill="none" opacity="0.4" />
          <path d="M100 19 L 100 171" stroke="#480202" strokeWidth="5" opacity="0.4" />

          <g filter="url(#abcDrop)">
            {/* Dynamic Star on Top */}
            <path
              d="M106 7 L113 24 L131 24 L116 35 L122 52 L106 41 L94 49 L99 34 L85 24 L102 24 Z"
              fill="#FFFFFF"
            />

            {/* Basketball Outer Ring */}
            <circle cx="100" cy="85" r="42" stroke="#FFFFFF" strokeWidth="4" fill="none" />

            {/* Basketball Seams */}
            <path d="M74 68 C87 78 113 78 126 68" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
            <path d="M70 87 C88 87 112 87 130 87" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
            <path d="M110 44 C110 68 110 88 110 102" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />

            {/* Abidjan Plateau Skyline Silhouette (Deep Red/Crimson) */}
            <path
              d="M72 102 L72 91 L77 91 L77 85 L84 85 L84 91 L89 91 L89 77 L94 77 L94 73 L97 73 L97 77 L103 77 L103 81 L108 81 L108 75 L113 75 L113 79 L118 79 L118 83 L123 83 L123 89 L128 89 L128 102 Z"
              fill="#6B0000"
            />

            {/* Typography: ABIDJAN BASKETBALL CLUB */}
            <text
              x="100"
              y="125"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, 'Arial Black', Impact, sans-serif"
              fontWeight="900"
              fontSize="24"
              letterSpacing="1.2"
              fill="#FFFFFF"
            >
              ABIDJAN
            </text>
            <text
              x="100"
              y="152"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, 'Arial Black', Impact, sans-serif"
              fontWeight="900"
              fontSize="19.5"
              letterSpacing="0.4"
              fill="#FFFFFF"
            >
              BASKETBALL
            </text>
            <text
              x="100"
              y="182"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, 'Arial Black', Impact, sans-serif"
              fontWeight="900"
              fontSize="26"
              letterSpacing="2.5"
              fill="#FFFFFF"
            >
              CLUB
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 2. JCA (Jeunesse Club d'Abidjan)
  if (normalizedCode === 'JCA' || name.toLowerCase().includes('jca') || name.toLowerCase().includes('jeunesse')) {
    return (
      <div className={`w-full h-full relative flex items-center justify-center overflow-hidden rounded-[inherit] ${className}`}>
        <svg
          viewBox="0 0 200 236"
          className="w-full h-full object-contain p-0.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="jcaGold" cx="42%" cy="38%" r="58%">
              <stop offset="0%" stopColor="#F9D479" />
              <stop offset="55%" stopColor="#E5A93C" />
              <stop offset="100%" stopColor="#B87711" />
            </radialGradient>
            <filter id="jcaDrop" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.6" />
            </filter>
            <clipPath id="jcaTopSkylineClip">
              <path d="M42 54 C42 25 68 18 100 18 C132 18 158 25 158 54 L158 56 L42 56 Z" />
            </clipPath>
          </defs>

          <g filter="url(#jcaDrop)">
            {/* Outer Shield with Silver Rim */}
            <path
              d="M100 7 C145 7 165 29 191 47 L173 126 L185 133 L185 187 L161 195 L100 231 L39 195 L15 187 L15 133 L27 126 L9 47 C35 29 55 7 100 7 Z"
              fill="#111B2E"
              stroke="#94A3B8"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Inner Shield Body */}
            <path
              d="M100 12 C142 12 161 32 185 49 L169 124 L179 131 L179 183 L157 191 L100 225 L43 191 L21 183 L21 131 L31 124 L15 49 C39 32 58 12 100 12 Z"
              fill="#142036"
            />

            {/* Top White Arch with Cocody Bridge & Abidjan Skyline */}
            <g clipPath="url(#jcaTopSkylineClip)">
              <rect x="36" y="14" width="128" height="44" fill="#FFFFFF" />

              {/* Cable-stayed bridge pylon and stays (Pont Alassane Ouattara) */}
              <path d="M96 21 L98 44 L94 44 Z" fill="#142036" />
              <line x1="96" y1="24" x2="80" y2="44" stroke="#142036" strokeWidth="1.2" />
              <line x1="96" y1="27" x2="84" y2="44" stroke="#142036" strokeWidth="1.2" />
              <line x1="96" y1="31" x2="89" y2="44" stroke="#142036" strokeWidth="1.2" />
              <line x1="96" y1="24" x2="112" y2="44" stroke="#142036" strokeWidth="1.2" />
              <line x1="96" y1="27" x2="108" y2="44" stroke="#142036" strokeWidth="1.2" />
              <line x1="96" y1="31" x2="103" y2="44" stroke="#142036" strokeWidth="1.2" />

              {/* Skyline buildings */}
              <rect x="47" y="34" width="7" height="18" fill="#142036" />
              <polygon points="58,27 66,44 58,44" fill="#142036" />
              <rect x="74" y="20" width="8" height="24" fill="#142036" />
              <rect x="120" y="26" width="9" height="18" fill="#142036" />
              <rect x="135" y="32" width="7" height="12" fill="#142036" />
              <polygon points="144,30 148,44 142,44" fill="#142036" />
            </g>

            {/* Golden Basketball */}
            <circle cx="100" cy="85" r="32" fill="url(#jcaGold)" stroke="#142036" strokeWidth="2.5" />
            <path d="M100 53 L100 117" stroke="#142036" strokeWidth="2.5" />
            <path d="M68 85 L132 85" stroke="#142036" strokeWidth="2.5" />
            <path d="M78 63 C90 73 90 97 78 107" stroke="#142036" strokeWidth="2.5" fill="none" />
            <path d="M122 63 C110 73 110 97 122 107" stroke="#142036" strokeWidth="2.5" fill="none" />

            {/* Bold White JCA Lettering */}
            <g>
              {/* J */}
              <path
                d="M54 130 L66 130 L66 161 C66 171 58 175 48 175 C40 175 34 171 32 164 L43 161 C44 164 46 166 49 166 C53 166 55 164 55 159 L55 130 Z"
                fill="#FFFFFF"
              />
              {/* C */}
              <path
                d="M100 134 C86 134 76 142 76 153 C76 164 86 172 100 172 C108 172 115 169 119 164 L109 157 C107 160 104 162 100 162 C94 162 88 158 88 153 C88 148 94 144 100 144 C104 144 107 146 109 149 L119 142 C115 137 108 134 100 134 Z"
                fill="#FFFFFF"
              />
              {/* A */}
              <path
                d="M142 129 L156 129 L168 175 L155 175 L152 162 L136 162 L133 175 L121 175 L133 129 Z M144 140 L138 153 L149 153 Z"
                fill="#FFFFFF"
              />
            </g>

            {/* Bottom Golden Banner Text: JEUNESSE CLUB D'ABIDJAN */}
            <text
              x="100"
              y="204"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, 'Arial Black', Impact, sans-serif"
              fontWeight="900"
              fontSize="10.5"
              letterSpacing="1"
              fill="#E5A93C"
            >
              JEUNESSE CLUB D'ABIDJAN
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // Fallback for other teams: Monogram Code
  return (
    <div className={`w-full h-full flex items-center justify-center font-black ${className}`}>
      {normalizedCode}
    </div>
  );
};
