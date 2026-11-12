import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';
import { fetchWebsiteEnquiries } from '../../lib/api';
import { 
  LayoutDashboard, 
  Layers, 
  Grid, 
  Inbox, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Bell, 
  ShieldCheck, 
  Database,
  Download,
  Video
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll or check unread enquiries count
  useEffect(() => {
    async function checkUnread() {
      try {
        const enquiries = await fetchWebsiteEnquiries();
        const unread = enquiries.filter(e => !e.is_read || e.status === 'New').length;
        setUnreadCount(unread);
      } catch {
        // ignore
      }
    }
    checkUnread();
    const interval = setInterval(checkUnread, 15000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Web Projects', path: '/admin/projects', icon: Layers },
    { label: 'Applications', path: '/admin/apps', icon: Grid },
    { label: 'Downloads & Analytics', path: '/admin/downloads', icon: Download },
    { label: 'YouTube Tutorials', path: '/admin/tutorials', icon: Video },
    { 
      label: 'Website Enquiries', 
      path: '/admin/enquiries', 
      icon: Inbox, 
      badge: unreadCount > 0 ? unreadCount : undefined 
    },
    { label: 'Company Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 selection:bg-blue-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <Logo size="sm" light />
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Link
              to="/admin/enquiries"
              className="relative p-2 text-slate-300 hover:text-white"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 border-r border-slate-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex md:flex-col justify-between ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-slate-800/80">
            <Logo size="md" light />
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-blue-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management Suite</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {/* Quick link to live site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">↗</span>
          </a>

          {/* Logged in admin info & Logout */}
          <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
            <div className="truncate max-w-[140px]">
              <span className="text-xs font-semibold text-slate-200 block truncate">
                {user?.email || 'admin@luminosoft.in'}
              </span>
              <span className="text-[10px] text-emerald-400 block font-mono">
                ● Super Admin
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Link
                to="/admin/enquiries"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>{unreadCount} New Enquiries</span>
              </Link>
            )}

            {actions}
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

