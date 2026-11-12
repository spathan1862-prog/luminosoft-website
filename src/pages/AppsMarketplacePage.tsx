import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { AppCard } from '../components/apps/AppCard';
import { fetchApplications } from '../lib/api';
import { Application } from '../types';
import { INITIAL_APP_CATEGORIES } from '../lib/initialData';
import { 
  Grid, 
  Search, 
  ArrowUpDown, 
  Sparkles, 
  Download, 
  Smartphone, 
  Monitor, 
  Tag 
} from 'lucide-react';

export const AppsMarketplacePage: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'downloads' | 'name' | 'newest'>('downloads');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchApplications();
        setApps(data.filter((a) => a.is_published));
      } catch (err) {
        console.warn('Apps fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredApps = apps
    .filter((app) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        app.category.toLowerCase().includes(selectedCategory.replace(/-/g, ' ').toLowerCase()) ||
        (selectedCategory === 'business-software' && app.category === 'Business Software') ||
        (selectedCategory === 'hotel-management' && app.category === 'Hotel Management') ||
        (selectedCategory === 'medical-management' && app.category === 'Medical Management') ||
        (selectedCategory === 'games' && app.category === 'Games');

      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.short_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return (b.download_count || 0) - (a.download_count || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime();
    });

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold mb-4">
            <Grid className="w-3.5 h-3.5" />
            <span>Luminosoft Official Software Store</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Application Marketplace
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Download verified enterprise software, clinic systems, property management solutions, and casual mobile games built by Luminosoft engineers.
          </p>
        </div>
      </section>

      {/* Filter, Search & Sort Bar */}
      <section className="py-8 bg-white border-b border-slate-100 sticky top-18 z-30 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {INITIAL_APP_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort applications"
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="downloads">Most Popular</option>
                  <option value="newest">Recently Updated</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="py-16 bg-slate-50/50 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-4 max-w-md mx-auto">
              <Grid className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Applications Found</h3>
              <p className="text-xs text-slate-500">
                No apps matched your query. Try resetting your search filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

