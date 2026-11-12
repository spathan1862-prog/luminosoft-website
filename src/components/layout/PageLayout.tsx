import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { SideNav } from './SideNav';
import { Footer } from './Footer';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface PageLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, hideFooter = false }) => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const location = useLocation();

  // Bi-directional continuous scroll animation hook for all public pages
  useScrollReveal([location.pathname, location.hash]);

  // Scroll to top on route change unless hash is present
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    } else {
      const el = document.getElementById(location.hash.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Header onOpenSideNav={() => setSideNavOpen(true)} />
      <SideNav isOpen={sideNavOpen} onClose={() => setSideNavOpen(false)} />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

