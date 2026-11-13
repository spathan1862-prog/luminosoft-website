import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { ProjectCard } from '../components/projects/ProjectCard';
import { fetchWebProjects } from '../lib/api';
import { WebProject } from '../types';
import { INITIAL_PROJECT_CATEGORIES } from '../lib/initialData';
import { SEOHead } from '../components/seo/SEOHead';
import { createBreadcrumbSchema, BASE_URL } from '../components/seo/schemaHelpers';
import { Layers, Search, Filter, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<WebProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWebProjects();
        setProjects(data.filter((p) => p.is_published));
      } catch (err) {
        console.warn('Projects fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      project.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'business-website' && project.category === 'Business Websites');

    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.short_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Web Projects', url: '/projects' }
  ]);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Luminosoft Web Development Projects Portfolio',
    description: 'Explore production websites and web software engineered by Luminosoft for businesses in India.',
    url: `${BASE_URL}/projects`
  };

  return (
    <PageLayout>
      <SEOHead
        title="Web Development Projects & Client Portfolio | Luminosoft India"
        description="Browse live web development projects, custom e-commerce portals, and enterprise web solutions engineered by Luminosoft for businesses across India."
        canonicalUrl={`${BASE_URL}/projects`}
        keywords="Web development portfolio, Luminosoft projects, custom web design case studies, client websites India, Khan Electrics website, Maharashtra web developer"
        structuredData={[collectionSchema, breadcrumbSchema]}
      />

      {/* Header */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Proven Engineering Excellence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Our Web Development Projects
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Explore live production websites and web software delivered by Luminosoft. Each project is engineered with high-speed performance, clean design, and custom administrative management.
          </p>
        </div>
      </section>

      {/* Featured Showcase Highlight: Khan Electrics */}
      <section className="py-8 bg-blue-50/50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-2xl bg-white border border-blue-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src="/images/khan-electrics-logo.png"
                alt="Khan Electrics Logo"
                className="w-14 h-14 object-contain rounded-xl p-1 bg-slate-50 border border-slate-200"
              />
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-600 text-white">
                  Featured Live Client Website
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Khan Electrics – Multi-Service Electrical Portal
                </h3>
                <p className="text-xs text-slate-600 max-w-xl">
                  Official multi-service portal with online service booking, electrical goods catalog, and Admin CMS. Managed dynamically via Cloud Database.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/projects/khan-electrics"
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                View Full Details
              </Link>
              <a
                href="https://khaneletrics.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                <span>Visit Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-10 bg-white border-b border-slate-100 sticky top-18 z-30 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {INITIAL_PROJECT_CATEGORIES.map((cat) => {
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

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-slate-50/50 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-4 max-w-md mx-auto">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Projects Found</h3>
              <p className="text-xs text-slate-500">
                No projects matched your selected filter or search term. Try selecting "All Projects".
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

