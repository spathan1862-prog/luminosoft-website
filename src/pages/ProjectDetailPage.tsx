import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { fetchProjectBySlug } from '../lib/api';
import { WebProject } from '../types';
import { SEOHead } from '../components/seo/SEOHead';
import { createBreadcrumbSchema, BASE_URL } from '../components/seo/schemaHelpers';
import { 
  ExternalLink, 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Layers, 
  CheckCircle2, 
  Code2, 
  Globe, 
  Share2, 
  Sparkles 
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<WebProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const data = await fetchProjectBySlug(slug);
        setProject(data);
      } catch (err) {
        console.warn('Failed to load project details:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto px-4 py-20 animate-pulse space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-12 w-2/3 bg-slate-200 rounded" />
          <div className="h-96 w-full bg-slate-200 rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
          <p className="text-sm text-slate-500">
            The requested portfolio project could not be located or has not yet been published.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const allScreenshots = project.screenshots && project.screenshots.length > 0
    ? project.screenshots
    : [project.image];

  const projectTitle = `${project.title} Case Study – Web Development Project | Luminosoft`;
  const projectDesc = project.short_description || `${project.title} web engineering and development case study by Luminosoft.`;

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: projectDesc,
    url: `${BASE_URL}/projects/${project.slug}`,
    image: project.image,
    creator: {
      '@type': 'Organization',
      name: 'Luminosoft',
      url: BASE_URL
    }
  };

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
    { name: project.title, url: `/projects/${project.slug}` }
  ]);

  return (
    <PageLayout>
      <SEOHead
        title={projectTitle}
        description={projectDesc}
        canonicalUrl={`${BASE_URL}/projects/${project.slug}`}
        keywords={`${project.title}, ${project.category}, web development case study, Luminosoft client projects, ${project.technologies.join(', ')}`}
        structuredData={[projectSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb & Navigation */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Projects</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Portfolio</span>
            <span>/</span>
            <span className="text-slate-700 font-medium">{project.title}</span>
          </div>
        </div>
      </section>

      {/* Project Hero Header */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              {/* Category & Status */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md">
                  {project.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{project.status || 'Live & Active'}</span>
                </span>
                {project.completion_date && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-500 bg-slate-100 rounded-md">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Delivered {project.completion_date}</span>
                  </span>
                )}
              </div>

              {/* Logo + Title */}
              <div className="flex items-center gap-4">
                {project.logo_url && (
                  <img
                    src={project.logo_url}
                    alt={`${project.title} logo`}
                    className="w-12 h-12 object-contain rounded-xl p-1 bg-slate-50 border border-slate-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                  {project.title}
                </h1>
              </div>

              {/* Short summary */}
              <p className="text-base text-slate-600 leading-relaxed">
                {project.short_description}
              </p>
            </div>

            {/* Live Website Action Button */}
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {project.link && project.link !== '#' ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <span>Visit Live Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <div className="px-4 py-2 rounded-lg bg-slate-100 text-xs text-slate-500 text-center font-medium">
                  Internal Web Solution
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Showcase: Screenshots Gallery */}
      <section className="py-12 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Active Preview */}
          <div className="relative aspect-video sm:aspect-16/9 bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 shadow-modal">
            <img
              src={allScreenshots[activeImageIndex]}
              alt={`${project.title} Screenshot ${activeImageIndex + 1}`}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Screenshot Thumbnails */}
          {allScreenshots.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {allScreenshots.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-24 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-blue-600 ring-2 ring-blue-600/30'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Detailed Description & Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Col: Full Case Study & Features */}
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Project Overview &amp; Execution
                </h2>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 whitespace-pre-line">
                  {project.detailed_description || project.short_description}
                </div>
              </div>

              {/* Main Features */}
              {project.features && project.features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Key Features &amp; Engineering Deliverables
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.features.map((feature, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-slate-700 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Specifications & Tech Stack Sidebar */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-3">
                  Project Metadata
                </h3>

                <div>
                  <span className="text-xs text-slate-500 block">Category</span>
                  <span className="text-sm font-semibold text-slate-900">{project.category}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Status</span>
                  <span className="text-sm font-semibold text-emerald-700">{project.status}</span>
                </div>

                {project.completion_date && (
                  <div>
                    <span className="text-xs text-slate-500 block">Completion Date</span>
                    <span className="text-sm font-semibold text-slate-900">{project.completion_date}</span>
                  </div>
                )}

                {/* Technologies */}
                <div>
                  <span className="text-xs text-slate-500 block mb-2">Technologies Used</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 text-slate-800 rounded-md shadow-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visit Site Button */}
                {project.link && project.link !== '#' && (
                  <div className="pt-2">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 transition-colors"
                    >
                      <span>Visit Live Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Client CTA Card */}
              <div className="p-6 rounded-2xl bg-blue-600 text-white space-y-3 shadow-md">
                <Sparkles className="w-6 h-6 text-blue-200" />
                <h4 className="text-base font-bold">
                  Want a Website Like This?
                </h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Luminosoft can build a tailored solution for your business with real-time inquiries, cloud database, and admin controls.
                </p>
                <Link
                  to="/contact#enquiry"
                  className="inline-block w-full py-2.5 px-4 text-center rounded-lg text-xs font-semibold text-blue-900 bg-white hover:bg-blue-50 transition-colors font-bold"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

