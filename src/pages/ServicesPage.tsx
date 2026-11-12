import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { WebsiteEnquiryForm } from '../components/enquiry/WebsiteEnquiryForm';
import { WebsiteType } from '../types';
import { SEOHead } from '../components/seo/SEOHead';
import { 
  createServiceSchema, 
  createBreadcrumbSchema,
  BASE_URL 
} from '../components/seo/schemaHelpers';
import { 
  Building2, 
  ShoppingBag, 
  Hotel, 
  UserCheck, 
  Server, 
  Smartphone, 
  Database,
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layout, 
  Code2,
  Filter
} from 'lucide-react';

interface ServicesPageProps {
  mode?: 'website' | 'software' | 'apps' | 'all';
}

type ServiceCategoryFilter = 'all' | 'website' | 'software' | 'apps';

export const ServicesPage: React.FC<ServicesPageProps> = ({ mode }) => {
  const location = useLocation();

  // Determine effective mode from prop or pathname
  const effectiveMode: 'website' | 'software' | 'apps' | 'all' = 
    mode || 
    (location.pathname === '/software-development' ? 'software' : 
     location.pathname === '/app-development' ? 'apps' : 
     'website');

  const [activeCategory, setActiveCategory] = useState<ServiceCategoryFilter>(effectiveMode);
  const [selectedServiceForEnquiry, setSelectedServiceForEnquiry] = useState<WebsiteType>('Business Website');

  const servicesList = [
    {
      category: 'website' as const,
      type: 'Business Website' as WebsiteType,
      icon: Building2,
      title: 'Business Website Development',
      badge: 'Corporate & Commercial',
      subtitle: 'Build brand credibility and generate qualified client inquiries 24/7 across India.',
      description: 'We build high-converting, mobile-first websites designed specifically for modern businesses, local enterprises, and service companies. Each project includes clean semantic markup, fast loading speeds, on-page SEO metadata, and interactive inquiry forms.',
      deliverables: [
        'Custom modern layout tailored to your brand identity',
        'Mobile-first responsive design across phones, tablets & desktops',
        'Lead capture & instant WhatsApp inquiry integration',
        'Google Search Console & SEO structured schema markup',
        'Fast cloud deployment with free SSL certificate'
      ]
    },
    {
      category: 'website' as const,
      type: 'E-commerce Website' as WebsiteType,
      icon: ShoppingBag,
      title: 'E-commerce Website Development',
      badge: 'Online Stores & Retail',
      subtitle: 'Sell your products online with seamless payments and inventory control.',
      description: 'From niche artisan product shops to high-volume commercial catalogs, we build robust e-commerce solutions. Features include dynamic product filtering, shopping cart workflows, secure payment gateways (UPI, Cards, NetBanking), and order tracking.',
      deliverables: [
        'Dynamic product catalogs with search, filters & categories',
        'Secure multi-currency & UPI payment gateway integrations',
        'Customer cart, checkout, and invoice generation flows',
        'Admin inventory tracking and order status management',
        'Abandoned cart recovery and customer analytics'
      ]
    },
    {
      category: 'website' as const,
      type: 'Hotel Website' as WebsiteType,
      icon: Hotel,
      title: 'Hotel Website Development',
      badge: 'Hospitality & Resorts',
      subtitle: 'Direct guest booking engines that eliminate expensive OTA commission fees.',
      description: 'Engineered specifically for boutique hotels, resorts, and vacation lodges. We create visually captivating websites featuring virtual room tours, amenity highlights, real-time availability calendars, and direct reservation engines.',
      deliverables: [
        'Interactive room showcase with photography galleries & virtual previews',
        'Zero-commission direct booking engine with guest check-in date selection',
        'Automated booking confirmation emails and WhatsApp receipts',
        'Integration with Luminosoft Hotel Management PMS desktop & mobile software',
        'Multi-language and local tax/GST rate support'
      ]
    },
    {
      category: 'website' as const,
      type: 'Portfolio Website' as WebsiteType,
      icon: UserCheck,
      title: 'Portfolio Website Development',
      badge: 'Personal & Agency',
      subtitle: 'Highlight your case studies, achievements, and professional skills.',
      description: 'A standout digital presence for professionals, architects, designers, photographers, consultants, and agencies. We design sleek, typography-driven portfolios that showcase your best work with interactive image galleries and client testimonials.',
      deliverables: [
        'Minimalist, premium aesthetic with smooth micro-interactions',
        'Case study pages with before-and-after photo comparisons',
        'Downloadable CV / PDF resume integration',
        'Client testimonial and project feedback showcase',
        'Direct contact booking for discovery calls'
      ]
    },
    {
      category: 'software' as const,
      type: 'Custom Website' as WebsiteType,
      icon: Server,
      title: 'Custom Software Development',
      badge: 'Bespoke Solutions',
      subtitle: 'Tailored desktop, cloud, and client-server software for business operations.',
      description: 'When off-the-shelf software fails to match your unique operational workflow, Luminosoft engineers bespoke software applications. From offline-first Electron desktop apps to cloud web applications with PostgreSQL databases.',
      deliverables: [
        'Electron desktop apps with offline local database storage',
        'Role-based staff permissions, login authentication, and audit logs',
        'Thermal receipt, barcode, and document printer integration',
        'Automated database backups and encrypted customer data',
        'Custom workflow automation replacing manual paper logs'
      ]
    },
    {
      category: 'software' as const,
      type: 'Custom Website' as WebsiteType,
      icon: Database,
      title: 'CRM Development',
      badge: 'Enterprise & Portals',
      subtitle: 'Manage client relationships, track sales pipelines, and analyze performance.',
      description: 'Custom Customer Relationship Management portals built around your business cycle. Track inquiries from first contact to signed contract, record interaction histories, send automated quotes, and view comprehensive revenue dashboards.',
      deliverables: [
        'Interactive lead pipeline with drag-and-drop status stages',
        'Customer communication log with click-to-WhatsApp and email',
        'Quotation generator with downloadable PDF exports',
        'Team performance tracking and daily sales analytics',
        'Secure cloud data storage with granular access controls'
      ]
    },
    {
      category: 'apps' as const,
      type: 'Other' as WebsiteType,
      icon: Smartphone,
      title: 'Mobile Application Development',
      badge: 'Android & Cross-Platform',
      subtitle: 'Smooth, battery-friendly mobile apps with offline-first capabilities.',
      description: 'We develop native Android applications (APK distribution) and cross-platform apps designed to run flawlessly on budget and flagship devices alike. Fast loading, minimal battery consumption, and responsive 60fps animations.',
      deliverables: [
        'Lightweight APK files optimized for low storage footprints',
        'Offline capability with smart local SQLite/Room caching',
        'Push notifications, device hardware integration, and sensors',
        'Google Play Store compliance and direct APK downloads',
        'Smooth touch gestures and adaptive dark/light layouts'
      ]
    }
  ];

  // Configure SEO metadata based on current mode
  const seoConfig = {
    website: {
      title: 'Website Development Company India | Professional Web Design | Luminosoft',
      description: 'Luminosoft is a leading website development company in India. We design high-converting business websites, custom e-commerce stores, hotel booking portals, and responsive websites with fast loading speeds.',
      keywords: 'Website Development Company India, Website Development Services, Web Development Company India, Professional Website Developer, Custom Website Development, Business Website Development, Ecommerce Website Development, Hotel Website Development, Responsive Website Design, Affordable Website Development, Website Development Company Maharashtra, Website Developer Aurangabad, Website Development Company Chhatrapati Sambhajinagar, Website Development Company Jalna',
      canonicalUrl: `${BASE_URL}/website-development`,
      badge: 'Comprehensive Web Engineering',
      h1: 'Website Development Services in India',
      subtitle: 'From modern responsive business portals to custom software and CRM backends, Luminosoft delivers end-to-end digital solutions that convert visitors into paying clients.',
      schemaType: 'Website Development Services',
      breadcrumbLabel: 'Website Development'
    },
    software: {
      title: 'Custom Software Development Company India | Desktop & CRM Solutions | Luminosoft',
      description: 'Custom software development company in India. Luminosoft builds desktop Windows software, custom CRM portals, billing systems, inventory management software, and offline-first business tools.',
      keywords: 'Software Development Company India, Custom Software Development, Desktop Software Development, Windows Application Development, CRM Software Development, Billing Software Development, Inventory Management Software, Software Development Company Maharashtra, Jalna, Aurangabad, Chhatrapati Sambhajinagar',
      canonicalUrl: `${BASE_URL}/software-development`,
      badge: 'Custom Software Engineering',
      h1: 'Custom Software Development Company in India',
      subtitle: 'We engineer bespoke desktop software (Windows 10/11), automated billing systems, offline-first inventory management, and custom CRM portals that streamline business operations.',
      schemaType: 'Custom Software Development Services',
      breadcrumbLabel: 'Software Development'
    },
    apps: {
      title: 'Android & Mobile App Development Company India | Native APKs | Luminosoft',
      description: 'Leading Android app development company in India. Luminosoft builds lightweight, offline-first mobile applications, business Android APKs, and responsive cross-platform apps.',
      keywords: 'Android App Development, Mobile App Development Company India, Custom Android App Development, Business App Development, Windows and Android Software Development, Mobile App Developer Maharashtra, Android APK Developer',
      canonicalUrl: `${BASE_URL}/app-development`,
      badge: 'Mobile & Android Engineering',
      h1: 'Android & Mobile App Development Company in India',
      subtitle: 'From lightweight native Android APKs to cross-platform mobile tools with offline database caching, Luminosoft builds high-performance apps tailored for modern workflows.',
      schemaType: 'Mobile Application Development Services',
      breadcrumbLabel: 'Mobile App Development'
    },
    all: {
      title: 'Digital Engineering, Web & Software Development Services | Luminosoft India',
      description: 'Explore full-spectrum website development, custom software engineering, and mobile app development services by Luminosoft in India.',
      keywords: 'Website Development Company India, Custom Software Development, Android App Development, CRM Development, Luminosoft services',
      canonicalUrl: `${BASE_URL}/website-development`,
      badge: 'Full-Stack Digital Solutions',
      h1: 'Software, Web & App Development Services',
      subtitle: 'Production-ready websites, custom desktop software, and mobile applications built for modern businesses.',
      schemaType: 'Digital Engineering Services',
      breadcrumbLabel: 'Services'
    }
  }[effectiveMode];

  const filteredServices = servicesList.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  const handleEnquireService = (type: WebsiteType) => {
    setSelectedServiceForEnquiry(type);
    const formElement = document.getElementById('enquiry-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const serviceSchema = createServiceSchema({
    name: seoConfig.h1,
    description: seoConfig.description,
    serviceType: seoConfig.schemaType,
    url: seoConfig.canonicalUrl
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: seoConfig.breadcrumbLabel, url: seoConfig.canonicalUrl }
  ]);

  return (
    <PageLayout>
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        canonicalUrl={seoConfig.canonicalUrl}
        keywords={seoConfig.keywords}
        structuredData={[serviceSchema, breadcrumbSchema]}
      />

      {/* Services Hero Header */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold mb-6">
            <Code2 className="w-3.5 h-3.5" />
            <span>{seoConfig.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {seoConfig.h1}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            {seoConfig.subtitle}
          </p>

          {/* Quick Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/website-development"
              onClick={() => setActiveCategory('website')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === 'website'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Website Development
            </Link>
            <Link
              to="/software-development"
              onClick={() => setActiveCategory('software')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === 'software'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Custom Software &amp; CRM
            </Link>
            <Link
              to="/app-development"
              onClick={() => setActiveCategory('apps')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === 'apps'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Android Mobile Apps
            </Link>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Show All ({servicesList.length})
            </button>
          </div>
        </div>
      </section>

      {/* Services List Deep-Dive */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {filteredServices.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 1;

            return (
              <div
                key={service.title}
                className={`p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/90 shadow-subtle flex flex-col ${
                  isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } gap-10 items-center justify-between`}
              >
                {/* Details Column */}
                <div className="flex-1 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
                        {service.badge}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-slate-700">
                    {service.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Deliverables List */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Key Deliverables Included:
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {service.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      onClick={() => handleEnquireService(service.type)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Get a Quote for this Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Prominent CTA Banner */}
      <section className="py-16 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Let's Collaborate
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Have a Project in Mind? Let's Build It Together.
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Get in touch with our team to discuss your project requirements, receive architecture recommendations, and get a transparent cost estimate.
          </p>
          <a
            href="#enquiry-section"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 transition-colors shadow-sm"
          >
            <span>Open Website Enquiry Form</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Embedded Enquiry Form */}
      <section id="enquiry-section" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <WebsiteEnquiryForm initialWebsiteType={selectedServiceForEnquiry} />
        </div>
      </section>
    </PageLayout>
  );
};
