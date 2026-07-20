import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // 'light' means light text/elements for dark backgrounds; 'dark' means dark text/elements for light backgrounds
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'light',
  showText = true,
}) => {
  const isLight = variant === 'light';
  
  // Brand Colors matching the concept board exactly
  const blueColor = '#0D2B45';
  const goldColor = '#C89A3C';
  const grayColor = '#7D9BA0';
  
  const textColor = isLight ? '#FFFFFF' : blueColor;

  return (
    <div id="brand-logo-container" className={`flex items-center gap-3.5 flex-shrink-0 ${className}`}>
      {/* Logo Image */}
      <img 
        src="/logo_dark_bg.png" 
        alt="Asesorías al Migrante Logo"
        className="w-12 h-12 object-contain flex-shrink-0"
      />

      {/* Brand Text - Styled precisely to match Concept 1 */}
      {showText && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Vertical Divider line */}
          <div
            className={`h-9 w-[1px] flex-shrink-0 ${
              isLight ? 'bg-white/20' : 'bg-brand-blue/20'
            }`}
            style={{ backgroundColor: isLight ? 'rgba(255, 255, 255, 0.2)' : 'rgba(11, 36, 71, 0.2)' }}
          />
          
          <div id="brand-text-container" className="flex flex-col select-none justify-center flex-shrink-0 whitespace-nowrap">
            <div className="flex flex-col leading-[1.05] whitespace-nowrap">
              <span
                id="brand-title-word1"
                className="font-heading text-[17px] sm:text-[19px] font-medium tracking-wide whitespace-nowrap"
                style={{ color: textColor }}
              >
                Asesorías
              </span>
              <div className="flex items-baseline -mt-0.5 whitespace-nowrap">
                <span
                  id="brand-title-word2"
                  className="font-heading italic font-normal lowercase text-[15px] sm:text-[17px] mr-1.5 whitespace-nowrap"
                  style={{ color: goldColor }}
                >
                  al
                </span>
                <span
                  id="brand-title-word3"
                  className="font-heading text-[17px] sm:text-[19px] font-medium tracking-wide whitespace-nowrap"
                  style={{ color: textColor }}
                >
                  Migrante
                </span>
              </div>
            </div>
            <span 
              id="brand-slogan" 
              className="text-[6px] sm:text-[7px] font-sans tracking-[0.22em] uppercase text-zinc-400 mt-1 block whitespace-nowrap"
            >
              Traspasamos fronteras con el respaldo correcto
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
