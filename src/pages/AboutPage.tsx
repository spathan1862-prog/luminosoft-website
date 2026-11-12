import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead';
import { 
  createOrganizationSchema, 
  createBreadcrumbSchema, 
  BASE_URL 
} from '../components/seo/schemaHelpers';
import { 
  Building2, 
  Target, 
  Eye, 
  ShieldCheck, 
  Code2, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' }
  ]);

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Luminosoft',
    description: 'Learn about Luminosoft, an Indian technology company founded by Samir Pathan. We specialize in robust website development, custom software engineering, and offline-first solutions.',
    url: `${BASE_URL}/about`,
    mainEntity: createOrganizationSchema()
  };

  return (
    <PageLayout>
      <SEOHead
        title="About Luminosoft – Software & Technology Company India | Samir Pathan"
        description="Learn about Luminosoft, an Indian technology company founded by Samir Pathan. We specialize in robust website development, custom software engineering, and offline-first solutions."
        canonicalUrl={`${BASE_URL}/about`}
        keywords="About Luminosoft, Samir Pathan, Software Company Maharashtra, Software Development Company India, Luminosoft team, Luminosoft history, Web Development Company India, Jalna, Aurangabad"
        structuredData={[aboutSchema, breadcrumbSchema]}
      />

      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold mb-6">
            <Building2 className="w-3.5 h-3.5" />
            <span>About Luminosoft • Official Company Profile</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Engineering Software &amp; Websites for Real-World Impact
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Luminosoft is an Indian software and website development company founded by Samir Pathan. We build high-performance business websites, custom software, Android applications, and offline-first solutions.
          </p>
        </div>
      </section>

      {/* Who We Are & Overview */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Who We Are
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                A Dedicated Software &amp; Digital Engineering Studio
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Founded by Samir Pathan with a strong technical foundation in web technologies, database architecture, and cross-platform desktop development, Luminosoft helps enterprises across Maharashtra (Badnapur, Jalna, Chhatrapati Sambhajinagar / Aurangabad) and across India replace outdated manual workflows with fast, secure software solutions.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our approach emphasizes clean, maintainable code rather than bloated frameworks or generic templates. Every website and software application we deliver is tailored to our clients' precise business operations, ensuring resilience, sub-second performance, and straightforward management.
              </p>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 transition-colors"
                >
                  <span>Explore Our Web Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-subtle space-y-6">
              <h3 className="text-lg font-bold text-slate-900">
                Core Engineering Standards
              </h3>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Performance-First Codebase</span>
                    Fast initial load times, tree-shaken bundles, and optimized assets ensuring high Core Web Vitals.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Robust Security &amp; RLS</span>
                    PostgreSQL database integration with strict Row Level Security (RLS) and environment safety.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Offline-First Resiliency</span>
                    Desktop and mobile software products designed to operate smoothly even during connectivity dropouts.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To build reliable, scalable, and intuitive software applications and high-converting websites that empower businesses to operate digitally, reach wider markets, and achieve operational efficiency without technological friction.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To establish Luminosoft as a trusted technology powerhouse known for pragmatic software engineering, exceptional design clarity, and enduring software solutions that stand the test of time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do & Our Services */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Capabilities</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">What We Do</h2>
            <p className="text-sm text-slate-600">
              End-to-end software development lifecycle from initial architecture to ongoing deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 w-fit">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Web Development</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Custom commercial websites, e-commerce storefronts, hotel portals, and personal portfolios engineered with modern component frameworks.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 w-fit">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Desktop &amp; Mobile Software</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dedicated desktop software for Windows (Electron/Chromium) and native Android applications built for medical practices, hospitality PMS, and utilities.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 w-fit">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Cloud Databases &amp; CMS</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Scalable PostgreSQL backends with Supabase, dynamic administrative content management systems, and automated real-time backups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Luminosoft */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Choose Luminosoft
            </h2>
            <p className="text-sm text-slate-600">
              Clear technical advantages that differentiate our software products and website solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="text-lg font-bold text-blue-600">01</div>
              <h4 className="text-sm font-bold text-slate-900">Direct Communication</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Work directly with the software engineers writing your code, eliminating project manager miscommunications.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="text-lg font-bold text-blue-600">02</div>
              <h4 className="text-sm font-bold text-slate-900">Zero Code-Lockin</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                You retain complete ownership of your custom code, database, and uploaded digital assets.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="text-lg font-bold text-blue-600">03</div>
              <h4 className="text-sm font-bold text-slate-900">Integrated Admin Panels</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Update content, view inquiries, and publish updates through custom dashboards without coding.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="text-lg font-bold text-blue-600">04</div>
              <h4 className="text-sm font-bold text-slate-900">Transparent Pricing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upfront quotes and clear deliverables with zero hidden maintenance fees.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

