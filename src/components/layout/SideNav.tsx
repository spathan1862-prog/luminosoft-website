import React, { useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { 
  X, 
  Home, 
  Code2, 
  Briefcase, 
  Grid, 
  Info, 
  Mail, 
  Lock, 
  Phone, 
  MessageSquare, 
  ChevronRight,
  Play,
  Sparkles
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { settings } = useSettings();
  const { isAdmin } = useAuth();

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const publicNavLinks = [
    { label: 'Home', path: '/', icon: Home, desc: 'Luminosoft Official Portal' },
    { label: 'Our Applications', path: '/apps', icon: Grid, desc: 'Software Marketplace & Downloads' },
    { label: 'Our Projects', path: '/projects', icon: Briefcase, desc: 'Portfolio of Live Client Websites' },
    { label: 'Get Your Website', path: '/#get-website', icon: Sparkles, desc: 'Request Web Development Quote', isHash: true },
    { label: 'Website Development', path: '/website-development', icon: Code2, desc: 'Custom Sites, E-commerce, Portals' },
    { label: 'Video Tutorials', path: '/#tutorials', icon: Play, desc: 'Step-by-step Software Guides', isHash: true },
    { label: 'About Us', path: '/about', icon: Info, desc: 'Who We Are & Technology Vision' },
    { label: 'Contact Us', path: '/contact', icon: Mail, desc: 'Get in Touch & Client Enquiries' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm sm:max-w-md bg-white border-l border-slate-200 shadow-modal flex flex-col justify-between transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Side navigation drawer"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Navigation Menu
            </div>
            {publicNavLinks.map((item) => {
              const Icon = item.icon;
              if (item.isHash) {
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                );
              }
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                </NavLink>
              );
            })}
          </div>

          {/* Quick Communication Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="text-xs font-semibold text-slate-900">
              Need Direct Assistance?
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Contact our software and web development team for consultations or software support.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Us</span>
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Luminosoft`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Drawer Footer with Separate Admin Login option (No credentials shown!) */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <Link
            to={isAdmin ? "/admin/dashboard" : "/admin/login"}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide">
                  {isAdmin ? 'Admin Dashboard' : 'Admin Portal Login'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isAdmin ? 'Manage System & Analytics' : 'Authorized Personnel Only'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <div className="text-[11px] text-center text-slate-400">
            © 2026 Luminosoft • All Rights Reserved
          </div>
        </div>
      </aside>
    </>
  );
};
