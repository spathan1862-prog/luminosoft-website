import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  linkTo?: string;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  linkTo = '/',
  light = false,
}) => {
  const imgDim = size === 'sm' ? 36 : size === 'lg' ? 52 : size === 'hero' ? 84 : 44;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : size === 'hero' ? 'text-3xl sm:text-4xl' : 'text-xl';
  const subtitleSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : size === 'hero' ? 'text-xs sm:text-sm' : 'text-[10px]';

  const content = (
    <div className={`flex items-center gap-3 sm:gap-3.5 select-none ${className}`}>
      {/* Official Luminosoft Logo Image - 100% Transparent, No Background Container */}
      <div 
        style={{ width: imgDim, height: imgDim }}
        className="relative shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-105"
      >
        <img
          src="/images/luminosoft-logo.png"
          alt="Luminosoft Official Logo"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      <div className="flex flex-col justify-center">
        <span className={`font-black tracking-tight ${textSize} ${light ? 'text-white' : 'text-slate-900'} leading-none`}>
          LUMINO<span className="text-blue-600">SOFT</span>
        </span>
        {showSubtitle && (
          <span className={`font-bold tracking-widest uppercase ${subtitleSize} ${light ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
            SOFTWARE &amp; TECHNOLOGY
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex items-center no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
};
