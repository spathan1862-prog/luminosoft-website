import React from 'react';
import { Link } from 'react-router-dom';
import { Application } from '../../types';
import { 
  ArrowRight, 
  Smartphone, 
  Monitor, 
  Apple, 
  Globe, 
  Stethoscope, 
  Grid3x3, 
  Layers, 
  Gamepad2, 
  Building 
} from 'lucide-react';

interface AppCardProps {
  app: Application;
}

export const renderAppIcon = (iconNameOrUrl: string, size = 'md') => {
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
  const iconDim = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  if (iconNameOrUrl && (iconNameOrUrl.startsWith('/') || iconNameOrUrl.startsWith('http'))) {
    return (
      <div className={`${dim} rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 shadow-xs`}>
        <img
          src={iconNameOrUrl}
          alt="App Icon"
          className="w-full h-full object-contain rounded-lg"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Lucide icon fallback mapping
  let IconComponent = Layers;
  if (iconNameOrUrl === 'Stethoscope') IconComponent = Stethoscope;
  else if (iconNameOrUrl === 'Grid3x3' || iconNameOrUrl === 'Grid') IconComponent = Grid3x3;
  else if (iconNameOrUrl === 'Gamepad2') IconComponent = Gamepad2;
  else if (iconNameOrUrl === 'Building') IconComponent = Building;

  return (
    <div className={`${dim} rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 shadow-xs`}>
      <IconComponent className={iconDim} />
    </div>
  );
};

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-subtle hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Top Header: Icon + Category + Featured Tag */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {renderAppIcon(app.icon, 'md')}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                {app.category}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                <Link to={`/apps/${app.slug}`}>
                  {app.name}
                </Link>
              </h3>
            </div>
          </div>

          {app.is_featured && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded-md shrink-0">
              Featured
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {app.short_description}
        </p>

        {/* Metadata info: Platforms & Version */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs text-slate-500">
          {/* Supported Platforms */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400">Platforms:</span>
            {app.supported_platforms.map((plat) => {
              if (plat === 'windows') {
                return (
                  <span key={plat} title="Windows" className="p-1 rounded-md bg-slate-100 text-slate-700">
                    <Monitor className="w-3.5 h-3.5" />
                  </span>
                );
              }
              if (plat === 'android') {
                return (
                  <span key={plat} title="Android" className="p-1 rounded-md bg-emerald-50 text-emerald-700">
                    <Smartphone className="w-3.5 h-3.5" />
                  </span>
                );
              }
              if (plat === 'macos' || plat === 'ios') {
                return (
                  <span key={plat} title="Apple" className="p-1 rounded-md bg-slate-100 text-slate-700">
                    <Apple className="w-3.5 h-3.5" />
                  </span>
                );
              }
              return (
                <span key={plat} title="Web / Cross-platform" className="p-1 rounded-md bg-slate-100 text-slate-700">
                  <Globe className="w-3.5 h-3.5" />
                </span>
              );
            })}
          </div>

          {/* Version badge */}
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
            v{app.version}
          </span>
        </div>
      </div>

      {/* Footer Action Buttons: Prompt requirement: NO direct download button on homepage cards, clicking opens /apps/:slug */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <Link
          to={`/apps/${app.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50/80 hover:bg-blue-600 hover:text-white transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white shadow-2xs cursor-pointer"
        >
          <span>View Details &amp; Downloads</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
