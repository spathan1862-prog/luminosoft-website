import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { renderAppIcon } from '../components/apps/AppCard';
import { 
  fetchApplicationBySlug, 
  fetchYouTubeTutorials, 
  recordDownloadEvent 
} from '../lib/api';
import { Application, ApplicationDownload, YouTubeTutorial } from '../types';
import { 
  Download, 
  ArrowLeft, 
  Calendar, 
  HardDrive, 
  Monitor, 
  Smartphone, 
  Apple, 
  Globe, 
  CheckCircle2, 
  History, 
  Layers, 
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Play,
  X,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { SocialIcons } from '../components/ui/SocialIcons';
import { SEOHead } from '../components/seo/SEOHead';
import { 
  createSoftwareApplicationSchema, 
  createBreadcrumbSchema, 
  BASE_URL 
} from '../components/seo/schemaHelpers';

export const AppDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [tutorials, setTutorials] = useState<YouTubeTutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);
  const [activeInstallTab, setActiveInstallTab] = useState<'android' | 'windows-exe' | 'windows-installer'>('android');
  const [activeVideoModal, setActiveVideoModal] = useState<YouTubeTutorial | null>(null);
  const [downloadInitiated, setDownloadInitiated] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const [appData, tutorialsData] = await Promise.all([
          fetchApplicationBySlug(slug),
          fetchYouTubeTutorials(),
        ]);
        setApp(appData);

        if (appData) {
          // Set default install tab based on supported platforms
          if (appData.supported_platforms.includes('android')) {
            setActiveInstallTab('android');
          } else if (appData.supported_platforms.includes('windows')) {
            setActiveInstallTab('windows-installer');
          }

          // Filter tutorials related to this app or general
          const related = tutorialsData.filter(
            t => t.related_application_id === appData.id || 
                 t.related_application_name?.toLowerCase().includes(appData.name.toLowerCase()) ||
                 t.title.toLowerCase().includes(appData.name.toLowerCase())
          );
          setTutorials(related.length > 0 ? related : tutorialsData.slice(0, 2));
        }
      } catch (err) {
        console.warn('Failed to load application:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleDownload = (dl: ApplicationDownload) => {
    if (!app) return;
    setDownloadInitiated(dl.id);
    // Non-blocking download analytics tracking
    recordDownloadEvent(
      app.id,
      app.name,
      dl.version || app.version,
      dl.platform,
      dl.download_url
    );
    setTimeout(() => setDownloadInitiated(null), 4000);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto px-4 py-20 animate-pulse space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-16 w-2/3 bg-slate-200 rounded" />
          <div className="h-96 w-full bg-slate-200 rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (!app) {
    return (
      <PageLayout>
        <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Application Not Found</h2>
          <p className="text-sm text-slate-500">
            The requested application could not be found or is currently not published.
          </p>
          <Link
            to="/apps"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Filter valid download options
  const activeDownloads = (app.downloads || []).filter(
    (d) => d.is_active && d.download_url && d.download_url !== '#'
  );

  const getPlatformIcon = (platform: string) => {
    if (platform.includes('android')) return <Smartphone className="w-4 h-4 text-emerald-600" />;
    if (platform.includes('windows')) return <Monitor className="w-4 h-4 text-blue-600" />;
    if (platform.includes('macos') || platform.includes('ios')) return <Apple className="w-4 h-4 text-slate-700" />;
    return <Globe className="w-4 h-4 text-slate-600" />;
  };

  // Tailored SEO settings per product
  const getAppSEO = () => {
    if (app.slug === 'hotel-management') {
      return {
        title: 'Luminosoft Hotel Management Software – Billing, PMS & Reservation System',
        description: 'Complete hotel management system and billing software for hotels, resorts, and lodges. Room reservations, GST invoices, front desk, and offline operations on Windows & Android.',
        keywords: 'Hotel Management Software, Hotel Management System, Hotel Billing Software, Hotel PMS India, Resort Management Software, Lodge Billing Software, Offline Hotel Software, GST Billing Hotel',
        category: 'BusinessApplication'
      };
    }
    if (app.slug === 'medico-manager') {
      return {
        title: 'MedicoManager – Medical Shop & Pharmacy Billing Software | Luminosoft',
        description: 'MedicoManager by Luminosoft is comprehensive medical store billing and pharmacy inventory management software. Track expiry dates, batches, GST invoices, and prescription records.',
        keywords: 'Medical Shop Management Software, Medical Store Billing Software, Pharmacy Inventory Management Software, Chemist Billing Software, Clinic Management Software India',
        category: 'BusinessApplication'
      };
    }
    return {
      title: `${app.name} – Download for Windows & Android | Luminosoft`,
      description: app.short_description || `${app.name} official download by Luminosoft. Secure, verified software for business and productivity.`,
      keywords: `${app.name}, download ${app.name}, Luminosoft software, ${app.category}`,
      category: app.category.toLowerCase().includes('game') ? 'GameApplication' : 'BusinessApplication'
    };
  };

  const appSEO = getAppSEO();

  const softwareSchema = createSoftwareApplicationSchema({
    name: app.name,
    operatingSystem: app.supported_platforms.join(', '),
    applicationCategory: appSEO.category,
    description: appSEO.description,
    downloadUrl: activeDownloads[0]?.download_url,
    fileSize: app.app_size,
    softwareVersion: app.version
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Applications', url: '/apps' },
    { name: app.name, url: `/apps/${app.slug}` }
  ]);

  return (
    <PageLayout>
      <SEOHead
        title={appSEO.title}
        description={appSEO.description}
        canonicalUrl={`${BASE_URL}/apps/${app.slug}`}
        keywords={appSEO.keywords}
        structuredData={[softwareSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb Navigation */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/apps"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Marketplace</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-slate-700 font-medium">{app.name}</span>
          </div>
        </div>
      </section>

      {/* Hero Header */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-start sm:items-center gap-5">
              {renderAppIcon(app.icon, 'lg')}

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md">
                    {app.category}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-mono font-medium bg-slate-100 text-slate-700 rounded-md">
                    v{app.version}
                  </span>
                  {app.is_featured && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                  {app.name}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                  {app.short_description}
                </p>
              </div>
            </div>

            {/* Quick Download Anchor CTA */}
            <div className="shrink-0 flex items-center gap-3">
              <a
                href="#download-section"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download App</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs Strip */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Release Date</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{app.release_date}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Package Size</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <HardDrive className="w-4 h-4 text-blue-600" />
                <span>{app.app_size || 'Official Build'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Platforms Supported</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Monitor className="w-4 h-4 text-blue-600" />
                <span className="capitalize">{app.supported_platforms.join(', ')}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Security Verified</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Clean &amp; Signed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left 2 Cols: Overview, Features, Screenshots & Guides */}
            <div className="lg:col-span-2 space-y-14">
              
              {/* SECTION A: Full Description */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  About {app.name}
                </h2>
                <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 whitespace-pre-line">
                  {app.full_description || app.short_description}
                </div>
              </div>

              {/* SECTION B: Main Features */}
              {app.features && app.features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Core Functionality &amp; Key Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {app.features.map((feature, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-slate-700 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION C: Screenshots Gallery */}
              {app.screenshots && app.screenshots.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Application Screenshots
                  </h3>
                  <div className="aspect-video sm:aspect-16/10 bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                    <img
                      src={app.screenshots[activeScreenshotIdx]}
                      alt="App Screenshot"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {app.screenshots.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                      {app.screenshots.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveScreenshotIdx(idx)}
                          className={`w-24 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                            activeScreenshotIdx === idx
                              ? 'border-blue-600 ring-2 ring-blue-600/30'
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={s} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION D: Step-by-Step "How to Download" Guide */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-50/60 to-white border border-blue-100 space-y-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                    <Download className="w-4 h-4" />
                    <span>Download Guidelines</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    How to Download {app.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Follow these 3 easy steps to download the verified official package directly to your device.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-blue-100/80 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                      1
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Select Platform</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Choose between the Android APK build or the Windows 64-bit installer based on your device.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-blue-100/80 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                      2
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Click Direct Download</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Click the download button. The transfer begins immediately with zero intermediate popups or ads.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-blue-100/80 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                      3
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Verify &amp; Install</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Check your Downloads folder for the complete file, then follow the installation instructions below.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION E: Platform-Specific "How to Install" Guide */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Setup Walkthrough
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      How to Install on Your Device
                    </h3>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold shrink-0">
                    <button
                      onClick={() => setActiveInstallTab('android')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeInstallTab === 'android'
                          ? 'bg-white text-emerald-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Android APK
                    </button>
                    <button
                      onClick={() => setActiveInstallTab('windows-installer')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeInstallTab === 'windows-installer'
                          ? 'bg-white text-blue-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Windows Setup (.exe)
                    </button>
                    <button
                      onClick={() => setActiveInstallTab('windows-exe')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeInstallTab === 'windows-exe'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Portable Standalone
                    </button>
                  </div>
                </div>

                {/* Tab 1: Android APK Instructions */}
                {activeInstallTab === 'android' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-xs text-emerald-800 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        Luminosoft APKs are digitally compiled and safe. Since the app is installed outside Google Play Store, Android requires one-time permission for unknown sources.
                      </span>
                    </div>

                    <ol className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          1
                        </span>
                        <div>
                          <strong className="text-slate-900 block">Download the `.apk` file:</strong>
                          Click "Download APK" in the download box on this page to save the APK to your phone.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          2
                        </span>
                        <div>
                          <strong className="text-slate-900 block">Allow Installation from Browser:</strong>
                          When prompted, go to <em>Settings &gt; Security &gt; Install Unknown Apps</em> (or Chrome permissions) and enable <strong>"Allow from this source"</strong>.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          3
                        </span>
                        <div>
                          <strong className="text-slate-900 block">Complete Installation:</strong>
                          Open the downloaded file from Chrome Downloads or your Notifications shade, tap <strong>Install</strong>, and wait for confirmation.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          4
                        </span>
                        <div>
                          <strong className="text-slate-900 block">Google Play Protect Notice:</strong>
                          If Play Protect shows "Unrecognized App", tap <strong>"More Details"</strong> then <strong>"Install Anyway"</strong>.
                        </div>
                      </li>
                    </ol>
                  </div>
                )}

                {/* Tab 2: Windows Installer Instructions */}
                {activeInstallTab === 'windows-installer' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200/70 text-xs text-blue-800 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        The Windows Setup installer configures shortcuts, dependencies, and desktop launch icons automatically.
                      </span>
                    </div>

                    <ol className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          1
                        </span>
                        <div>
                          <strong className="text-slate-900 block">Download the Setup Executable:</strong>
                          Click "Download Setup.exe" from the verified package downloads section.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          2
                        </span>
                        <div>
                          <strong className="text-slate-900 block">Launch Setup Wizard:</strong>
                          Locate the file in your Windows <code>Downloads</code> folder and double-click to launch.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          3
                        </span>
                        <div>
                          <strong className="text-slate-900 block">Windows SmartScreen Note:</strong>
                          If Windows SmartScreen displays "Windows protected your PC", click <strong>"More info"</strong> and then click <strong>"Run anyway"</strong>.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          4
                        </span>
                        <div>
                          <strong className="text-slate-900 block">Finish Installation:</strong>
                          Select destination directory, click Next &gt; Install, and launch {app.name} from your Start Menu or Desktop.
                        </div>
                      </li>
                    </ol>
                  </div>
                )}

                {/* Tab 3: Windows Portable Standalone Instructions */}
                {activeInstallTab === 'windows-exe' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                      <FileCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                      <span>
                        Portable standalone editions run directly from any folder or USB drive with zero system registry modifications.
                      </span>
                    </div>

                    <ol className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          1
                        </span>
                        <div>
                          <strong className="text-slate-900 block">Download Standalone `.exe`:</strong>
                          Save the executable file to your preferred folder (e.g. <code>C:\Programs\{app.name}</code>).
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          2
                        </span>
                        <div>
                          <strong className="text-slate-900 block">Run Directly:</strong>
                          Double-click the executable. No setup wizard or administrative installation is required.
                        </div>
                      </li>
                    </ol>
                  </div>
                )}
              </div>

              {/* SECTION F: Video Tutorials for this Application */}
              {tutorials.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">
                        Video Assistance
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">
                        Tutorials &amp; Walkthroughs
                      </h3>
                    </div>

                    <a
                      href="https://youtube.com/@luminosoft"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
                    >
                      <span>YouTube Channel</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tutorials.map((tut) => (
                      <div
                        key={tut.id}
                        className="group bg-slate-50 rounded-xl border border-slate-200/90 overflow-hidden hover:shadow-subtle transition-all cursor-pointer flex flex-col justify-between"
                        onClick={() => setActiveVideoModal(tut)}
                      >
                        <div className="relative aspect-video bg-slate-900">
                          <img
                            src={tut.thumbnail_url || `https://img.youtube.com/vi/${tut.youtube_id}/hqdefault.jpg`}
                            alt={tut.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow">
                              <Play className="w-4 h-4 ml-0.5 fill-white" />
                            </div>
                          </div>
                          {tut.duration && (
                            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono">
                              {tut.duration}
                            </span>
                          )}
                        </div>

                        <div className="p-3.5 space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {tut.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {tut.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Requirements */}
              {app.system_requirements && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    System Requirements &amp; Compatibility
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-mono">
                    {app.system_requirements}
                  </p>
                </div>
              )}
            </div>

            {/* Right Col: Dedicated Download Box & Version History */}
            <div className="space-y-8">
              
              {/* DEDICATED DIRECT DOWNLOAD BOX */}
              <div 
                id="download-section" 
                className="p-6 sm:p-7 rounded-2xl bg-white border-2 border-blue-500/20 shadow-card space-y-5 sticky top-24"
              >
                <div className="border-b border-slate-100 pb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Official Release Binaries</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Download {app.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct binary downloads with instant high-speed mirror transfer.
                  </p>
                </div>

                {downloadInitiated && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Download started! Check your browser's download tray.</span>
                  </div>
                )}

                {activeDownloads.length > 0 ? (
                  <div className="space-y-3">
                    {activeDownloads.map((dl) => (
                      <div
                        key={dl.id}
                        className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex flex-col justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-100">
                              {getPlatformIcon(dl.platform)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {dl.platform_name}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Size: {dl.file_size || app.app_size || 'Official Package'}
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            v{dl.version || app.version}
                          </span>
                        </div>

                        {/* Direct Download Button */}
                        <a
                          href={dl.direct_asset_url || dl.download_url}
                          download={dl.file_name || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleDownload(dl)}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Direct Download ({dl.platform_name})</span>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-3">
                    <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
                    <p>
                      Official release packages are prepared on demand for licensed enterprise deployments.
                    </p>
                    <Link
                      to="/contact#enquiry"
                      className="inline-block px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                    >
                      Request Deployment Package →
                    </Link>
                  </div>
                )}

                <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Virus &amp; Malware Scanned</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    No ads, no bundleware, and no third-party installers. 100% genuine code from Luminosoft.
                  </p>
                </div>
              </div>

              {/* UPDATES & VERSION HISTORY SECTION */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <History className="w-4 h-4 text-blue-600" />
                    <span>Version History</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Latest: v{app.version}
                  </span>
                </div>

                {app.updates && app.updates.length > 0 ? (
                  <div className="space-y-4">
                    {app.updates.map((update, idx) => {
                      const isLatest = idx === 0;
                      return (
                        <div
                          key={update.id}
                          className={`p-4 rounded-xl border text-xs space-y-2 ${
                            isLatest
                              ? 'bg-blue-50/40 border-blue-200 ring-1 ring-blue-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 font-mono">
                              v{update.version}
                            </span>
                            {isLatest && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                                Current
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-500">
                            Released on {update.release_date}
                          </div>

                          {update.whats_new && (
                            <p className="text-slate-700 leading-relaxed">
                              {update.whats_new}
                            </p>
                          )}

                          {/* New features */}
                          {update.new_features && update.new_features.length > 0 && (
                            <div className="pt-1">
                              <span className="font-semibold text-slate-800 block text-[11px]">
                                New Features:
                              </span>
                              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                                {update.new_features.map((nf, i) => (
                                  <li key={i}>{nf}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Bug fixes */}
                          {update.bug_fixes && update.bug_fixes.length > 0 && (
                            <div className="pt-1">
                              <span className="font-semibold text-slate-800 block text-[11px]">
                                Bug Fixes:
                              </span>
                              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                                {update.bug_fixes.map((bf, i) => (
                                  <li key={i}>{bf}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Version {app.version} initial release. No prior changelogs recorded.
                  </p>
                )}
              </div>
            </div>
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
    </PageLayout>
  );
};
