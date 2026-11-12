import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { ProjectCard } from '../components/projects/ProjectCard';
import { WebsiteEnquiryForm } from '../components/enquiry/WebsiteEnquiryForm';
import { 
  fetchWebProjects, 
  fetchApplications, 
  fetchYouTubeTutorials 
} from '../lib/api';
import { WebProject, Application, YouTubeTutorial } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { 
  ArrowRight, 
  Code2, 
  Layers, 
  Smartphone, 
  Building2, 
  ShoppingBag, 
  Hotel, 
  UserCheck, 
  Server, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  ExternalLink, 
  ChevronRight, 
  Database, 
  Play, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  Monitor,
  Laptop,
  Flame,
  Award,
  BarChart3,
  Cpu
} from 'lucide-react';
import { SocialIcons } from '../components/ui/SocialIcons';
import { SEOHead } from '../components/seo/SEOHead';
import { 
  createOrganizationSchema, 
  createWebSiteSchema, 
  createLocalBusinessSchema,
  BASE_URL 
} from '../components/seo/schemaHelpers';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [projects, setProjects] = useState<WebProject[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [tutorials, setTutorials] = useState<YouTubeTutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState<YouTubeTutorial | null>(null);

  // Activate hardware-accelerated scroll reveal observer on mount and after data loads
  useScrollReveal([loading, projects.length, apps.length, tutorials.length]);

  useEffect(() => {
    async function loadData() {
      try {
        const [pData, aData, tData] = await Promise.all([
          fetchWebProjects(),
          fetchApplications(),
          fetchYouTubeTutorials(),
        ]);
        setProjects(pData.filter(p => p.is_published));
        setApps(aData.filter(a => a.is_published));
        setTutorials(tData.filter(t => t.is_published));
      } catch (err) {
        console.warn('Data fetch error on homepage:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const services = [
    {
      icon: Building2,
      title: 'Business Website Development',
      description: 'High-converting, responsive websites tailored for commercial enterprises, corporate brands, and local service providers in India.',
      badge: 'Enterprise Grade',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      path: '/website-development'
    },
    {
      icon: ShoppingBag,
      title: 'E-commerce Website Development',
      description: 'Full-featured online storefronts with secure checkout flows, product inventory management, and UPI/card payment gateway integration.',
      badge: 'High Conversion',
      image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80',
      path: '/website-development'
    },
    {
      icon: Hotel,
      title: 'Hotel Website Development',
      description: 'Hospitality websites with interactive room showcases, amenity tours, and direct booking engines that eliminate OTA commissions.',
      badge: 'Direct Booking',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      path: '/website-development'
    },
    {
      icon: UserCheck,
      title: 'Portfolio Website Development',
      description: 'Sleek, personal portfolio sites for professionals, agencies, and creatives to showcase achievements and case studies.',
      badge: 'Personal Brand',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
      path: '/website-development'
    },
    {
      icon: Server,
      title: 'Custom Software Development',
      description: 'Tailored desktop, cloud, and client-server software engineered to solve specific operational bottlenecks in your business.',
      badge: 'Scalable Arch',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      path: '/software-development'
    },
    {
      icon: Smartphone,
      title: 'Mobile Application Development',
      description: 'Lightweight Android applications with offline-first capabilities, smooth 60fps UI, and battery-friendly performance.',
      badge: 'Native Android',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
      path: '/app-development'
    },
    {
      icon: Database,
      title: 'CRM Development',
      description: 'Custom Customer Relationship Management portals, lead pipeline trackers, and administrative backends with role-based access.',
      badge: 'Data Pipelines',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      path: '/software-development'
    },
  ];

  const youtubeChannelUrl = settings.youtube_channel_url || 'https://youtube.com/@luminosoft';

  return (
    <PageLayout>
      <SEOHead
        title="Luminosoft – Website, Custom Software & Mobile App Development Company India"
        description="Official website of Luminosoft (Lumino Soft), an Indian technology and software development company. We engineer custom business websites, desktop software, Android applications, and CRM solutions."
        canonicalUrl={`${BASE_URL}/`}
        keywords="Luminosoft, Lumino Soft, Luminosoft India, Luminosoft Software Company, Luminosoft Official Website, Website Development Company India, Custom Software Development, Android App Development, Desktop Software Development, Hotel Management Software, MedicoManager, Website Development Maharashtra, Jalna, Aurangabad, Chhatrapati Sambhajinagar"
        structuredData={[
          createOrganizationSchema(),
          createWebSiteSchema(),
          createLocalBusinessSchema()
        ]}
      />

      {/* =====================================================================
          1. MAIN LUMINOSOFT BRANDING / HERO SECTION
          Hierarchy:
          1. Official Transparent Logo
          2. LUMINOSOFT (Absolute Biggest Element)
          3. Smart Software. Powerful Digital Solutions. (Secondary Tagline)
          4. Supporting Description
          5. CTA Actions
          ===================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-white pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-100">
        {/* Subtle geometric dot grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Official Company Badge */}
          <div className="reveal-init inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold tracking-wide mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Official Software &amp; Technology Company • India</span>
          </div>

          {/* 1. Official Logo - Strictly Transparent, No Black Box, No Container */}
          <div className="reveal-init delay-75 flex justify-center mb-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 shrink-0 transition-transform duration-300 hover:scale-105">
              <img
                src="/images/luminosoft-logo.png"
                alt="Luminosoft Official Logo – Website &amp; Software Development Company India"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
          </div>

          {/* 2. LUMINOSOFT - The Absolute Biggest Element on Homepage */}
          <div className="reveal-init delay-150">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-slate-900 tracking-tight font-sans uppercase leading-none select-none">
              LUMINO<span className="text-blue-600">SOFT</span>
            </h1>
          </div>

          {/* 3. Small Supporting Tagline (Visually Secondary, Smaller, Lighter) */}
          <div className="reveal-init delay-225">
            <p className="mt-4 sm:mt-5 text-xl sm:text-2xl md:text-3xl font-semibold text-slate-600 tracking-normal max-w-3xl mx-auto">
              Smart Software. <span className="text-blue-600 font-bold">Powerful Digital Solutions.</span>
            </p>
          </div>

          {/* 4. Short Company Description */}
          <div className="reveal-init delay-300">
            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Luminosoft (Lumino Soft) is an Indian software and website development company. We deliver professional website development, custom software, mobile applications and CRM solutions to help businesses grow digitally across Maharashtra and all of India.
            </p>
          </div>

          {/* 5. Main Navigation / 3 CTA Actions */}
          <div className="reveal-init delay-375 mt-8 sm:mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* CTA 1: Explore Our Applications */}
            <Link
              to="/apps"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Explore Our Applications</span>
              <Smartphone className="w-4 h-4" />
            </Link>

            {/* CTA 2: Get a Website for Your Business */}
            <a
              href="#get-website"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
            >
              <span>Get a Website for Your Business</span>
              <Sparkles className="w-4 h-4 text-blue-400" />
            </a>

            {/* CTA 3: View Our Projects */}
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 transition-all shadow-2xs cursor-pointer"
            >
              <span>View Our Projects</span>
              <Layers className="w-4 h-4 text-slate-500" />
            </a>
          </div>

          {/* Trust Highlights Strip (Properly balanced directly below hero actions) */}
          <div className="reveal-init delay-300 mt-14 pt-10 border-t border-slate-200/60 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Custom Engineering</div>
                <div className="text-[11px] text-slate-500">React, TypeScript &amp; Vite</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Cloud &amp; Database</div>
                <div className="text-[11px] text-slate-500">Supabase &amp; PostgreSQL</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Multi-Platform</div>
                <div className="text-[11px] text-slate-500">Android APK &amp; Windows EXE</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">High Performance</div>
                <div className="text-[11px] text-slate-500">Sub-second Speed</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================================
          2. GET YOUR BUSINESS WEBSITE – MAIN CUSTOMER CONVERSION SECTION
          ===================================================================== */}
      <section id="get-website" className="py-20 sm:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal-init text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Customer Conversion</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Get Your Business Website
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Take your business online with a professional website designed to attract customers and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: The Form */}
            <div className="reveal-init delay-150 lg:col-span-7">
              <WebsiteEnquiryForm />
            </div>

            {/* Right: Trust & Quality Showcase Panel */}
            <div className="reveal-init delay-300 lg:col-span-5 space-y-6">
              {/* Feature Showcase Card */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-subtle p-6 space-y-5">
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                    alt="Luminosoft High Converting Websites"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      100% Custom Tailored Website Engineering
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900">
                    What You Get with Every Luminosoft Website:
                  </h3>
                  
                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Fully Responsive:</strong> Flawless rendering on smartphones, tablets, and 4K displays.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Fast Loading Speeds:</strong> Optimized assets and modern code for sub-second page loads.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>SEO &amp; Social Ready:</strong> Pre-configured Open Graph tags, sitemaps, and search metadata.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Admin Management CMS:</strong> Easy dashboard to manage your enquiries, products, and content.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Direct Contact Integration:</strong> Instant WhatsApp chat, click-to-call, and email enquiry delivery.</span>
                    </div>
                  </div>
                </div>

                {/* Direct Assistance CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Need urgent consultation?</span>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Luminosoft%2C%20I%20want%20to%20get%20a%20website%20for%20my%20business`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Our Engineers</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================================
          3. OUR APPLICATIONS (Marketplace Hub)
          ===================================================================== */}
      <section id="applications" className="py-20 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-card border border-slate-800">
            {/* Ambient background glow accents */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold shadow-xs">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Software Products &amp; Applications</span>
              </div>

              {/* Section Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Our Applications
              </h2>

              {/* Subtitle / Description */}
              <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Discover verified enterprise desktop software, clinic management systems, hospitality portals, and mobile games engineered by Luminosoft. Fast, lightweight, offline-ready, with regular updates.
              </p>

              {/* Category Pills / Capability Highlights */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs">
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 font-medium flex items-center gap-2 shadow-2xs">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Hotel &amp; Property Management</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 font-medium flex items-center gap-2 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Clinic &amp; Healthcare Systems</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 font-medium flex items-center gap-2 shadow-2xs">
                  <Monitor className="w-3.5 h-3.5 text-sky-400" />
                  <span>Windows Desktop Installers</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 font-medium flex items-center gap-2 shadow-2xs">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Android Native APKs</span>
                </span>
              </div>

              {/* ONE LARGE, ATTRACTIVE AND RESPONSIVE "Explore All Applications" BUTTON */}
              <div className="pt-4 sm:pt-6">
                <Link
                  to="/apps"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 group cursor-pointer"
                >
                  <Smartphone className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" />
                  <span>Explore All Applications</span>
                  <ArrowRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 group-hover:text-white transition-all" />
                </Link>
              </div>

              {/* Trust Points */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verified &amp; Safe Downloads</span>
                </span>
                <span className="hidden sm:inline text-slate-700">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Offline-Capable</span>
                </span>
                <span className="hidden sm:inline text-slate-700">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Installation Guides &amp; Video Tutorials</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================================
          4. OUR WEB DEVELOPMENT PROJECTS (Khan Electrics & Portfolio)
          ===================================================================== */}
      <section id="projects" className="py-20 sm:py-24 bg-slate-50/70 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal-init flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>Web Development Portfolio</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Our Web Development Projects
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Explore websites engineered by Luminosoft, built with modern web technologies, administrative control panels, and cloud databases.
              </p>
            </div>

            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 shrink-0"
            >
              <span>View All Projects ({projects.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Project Cards Grid with Scroll Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project, index) => (
              <div 
                key={project.id}
                className={`reveal-init delay-${(index + 1) * 75}`}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          {/* Prominent Callout for Khan Electrics */}
          <div className="reveal-init delay-300 mt-10 p-6 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-subtle">
            <div className="flex items-center gap-3">
              <img
                src="/images/khan-electrics-logo.png"
                alt="Khan Electrics"
                className="w-12 h-12 object-contain rounded-xl p-1 bg-slate-50 border border-slate-200"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Featured Case Study: Khan Electrics Multi-Service Portal
                </h4>
                <p className="text-xs text-slate-500">
                  A high-converting web portal with live booking, product catalog, and integrated admin CMS.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/projects/khan-electrics"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Case Study
              </Link>
              <a
                href="https://khaneletrics.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <span>Visit Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================================
          5. YOUTUBE TUTORIALS SECTION
          ===================================================================== */}
      <section id="tutorials" className="py-20 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal-init flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-semibold">
                <Play className="w-3.5 h-3.5 fill-rose-600" />
                <span>Video Walkthroughs &amp; Guides</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Need Help? Watch Our Video Tutorials
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Learn how to download, install, and use Luminosoft applications and software solutions with our step-by-step video guides.
              </p>
            </div>

            {/* Prominent YouTube Subscribe Button */}
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <SocialIcons.youtube className="w-4 h-4 fill-white" />
              <span>Subscribe on YouTube</span>
            </a>
          </div>

          {/* Tutorials Grid with Scroll Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.slice(0, 3).map((tutorial, index) => (
              <div
                key={tutorial.id}
                className={`reveal-init delay-${(index + 1) * 75} group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between`}
              >
                {/* Thumbnail with Play Overlay */}
                <div 
                  className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                  onClick={() => setActiveVideoModal(tutorial)}
                >
                  <img
                    src={tutorial.thumbnail_url || `https://img.youtube.com/vi/${tutorial.youtube_id}/hqdefault.jpg`}
                    alt={tutorial.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </div>

                  {tutorial.duration && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{tutorial.duration}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {tutorial.related_application_name && (
                      <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
                        {tutorial.related_application_name}
                      </span>
                    )}
                    <h3 
                      className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer"
                      onClick={() => setActiveVideoModal(tutorial)}
                    >
                      {tutorial.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {tutorial.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveVideoModal(tutorial)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      <span>Watch Tutorial</span>
                      <Play className="w-3 h-3 fill-rose-600" />
                    </button>

                    <a
                      href={tutorial.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-slate-400 hover:text-slate-700 inline-flex items-center gap-1"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <h4 className="text-sm font-bold truncate pr-4">
                {activeVideoModal.title}
              </h4>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtube_id || 'dQw4w9WgXcQ'}?autoplay=1`}
                title={activeVideoModal.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}


      {/* =====================================================================
          6. ABOUT LUMINOSOFT
          ===================================================================== */}
      <section id="about" className="py-20 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="reveal-init space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                <span>About Luminosoft</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                Engineering Quality Software for Modern Enterprises.
              </h2>
              
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Luminosoft is a technology and software development company focused on building modern digital solutions, business applications, and scalable web software.
              </p>
              
              <p className="text-sm text-slate-400 leading-relaxed">
                Founded by Samir Pathan, Luminosoft combines modern frontend architectures (React 19, TypeScript) with robust cloud backends (Supabase, PostgreSQL). We specialize in crafting fast customer-facing websites, custom CRM portals, and multi-platform applications that empower organizations to automate workflows and accelerate digital growth.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Production-grade clean code with zero unnecessary dependencies</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cloud database security with Row Level Security &amp; daily backups</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated post-launch support and continuous application updates</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-white hover:bg-slate-100 transition-colors shadow-xs"
                >
                  <span>Learn More About Us</span>
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                </Link>
              </div>
            </div>

            {/* Architecture Pillars & Workspace Visual */}
            <div className="reveal-init delay-150 space-y-6">
              {/* Engineering Workspace Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-slate-800 shadow-modal">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="Luminosoft Software Engineers Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex items-end p-5">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Collaborative Engineering &amp; Architecture Standards
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
                    01
                  </div>
                  <h4 className="text-sm font-bold text-white">Modern Frontend</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Engineered with React 19, TypeScript, and Vite for instant interactions and 95+ Core Web Vitals.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                    02
                  </div>
                  <h4 className="text-sm font-bold text-white">Cloud Database</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Supabase PostgreSQL data storage with Row Level Security, instant queries, and scalable storage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================================
          7. CONTACT INFORMATION
          ===================================================================== */}
      <section id="contact" className="py-20 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal-init text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Direct Communication</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Get in Touch with Luminosoft
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Have questions about our software products or want to discuss custom engineering? Contact our team directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Email Card */}
            <div className="reveal-init delay-75 p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-3 shadow-2xs hover:shadow-subtle transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 mx-auto flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Email Us</h3>
              <p className="text-xs text-slate-500">For enquiries, proposals and technical support:</p>
              <a
                href={`mailto:${settings.email}`}
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline block"
              >
                {settings.email}
              </a>
            </div>

            {/* Phone & WhatsApp Card */}
            <div className="reveal-init delay-150 p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-3 shadow-2xs hover:shadow-subtle transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-600 mx-auto flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Call or WhatsApp</h3>
              <p className="text-xs text-slate-500">Immediate response during business hours:</p>
              <div className="space-y-1">
                <a
                  href={`tel:${settings.phone}`}
                  className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-blue-600 block"
                >
                  {settings.phone}
                </a>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Luminosoft%2C%20I%20would%20like%20to%20discuss%20a%20project`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Location & Operating Region */}
            <div className="reveal-init delay-225 p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-3 shadow-2xs hover:shadow-subtle transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100/70 text-purple-600 mx-auto flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Business Location</h3>
              <p className="text-xs text-slate-500">Serving clients nationwide across India:</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {settings.business_address}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================================
          8. WEBSITE DEVELOPMENT SERVICES (With rich imagery & scroll reveal)
          ===================================================================== */}
      <section id="services" className="py-20 sm:py-24 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal-init text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
              <Code2 className="w-3.5 h-3.5" />
              <span>Full-Stack Web Engineering</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Website Development Services
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We design, develop, and deploy production-grade websites and web software engineered for scalability, fast loading speeds, and business growth.
            </p>
          </div>

          {/* 7 Services Grid with Preview Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv, index) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.title}
                  className={`reveal-init delay-${(index % 3 + 1) * 75} group bg-white rounded-2xl border border-slate-200/90 shadow-subtle hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col justify-between`}
                >
                  <div>
                    {/* Visual Card Cover Image */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                      <img
                        src={srv.image}
                        alt={srv.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-slate-900 shadow-xs">
                          {srv.badge}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="p-6 space-y-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={srv.path || '/website-development'}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href="#get-website"
                      className="text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      Request Quote
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section CTA: Have a Project in Mind? Let's Build It Together */}
          <div className="reveal-init delay-225 mt-14 p-8 sm:p-10 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Turn Your Vision into Reality
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Have a Project in Mind? Let's Build It Together.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Whether you need a brand-new website, an e-commerce platform, or a custom management system, our engineers are ready to build it.
              </p>
            </div>

            <a
              href="#get-website"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-950 bg-white hover:bg-blue-50 transition-colors shadow-sm shrink-0 cursor-pointer"
            >
              <span>Open Website Enquiry</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
