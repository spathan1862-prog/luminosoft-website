import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Menu, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onOpenSideNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSideNav }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Our Applications', path: '/apps' },
    { label: 'Our Projects', path: '/projects' },
    { label: 'Get Your Website', path: '/#get-website' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
  ];

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3' 
          : 'bg-white border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with official emblem */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isHashLink = link.path.startsWith('/#');
              if (isHashLink) {
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                );
              }
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/70 font-semibold'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/#get-website"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors duration-150 cursor-pointer"
            >
              <span>Get Your Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Menu drawer trigger */}
            <button
              onClick={onOpenSideNav}
              type="button"
              className="p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Open navigation menu"
              title="Menu & Admin"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="/#get-website"
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md"
            >
              Get Website
            </a>
            <button
              onClick={onOpenSideNav}
              type="button"
              className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
