import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { AdminGuard } from './components/admin/AdminGuard';
import { Loader2 } from 'lucide-react';

// Lazy load pages for lightweight performance and code-splitting
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const AppsMarketplacePage = lazy(() => import('./pages/AppsMarketplacePage').then(m => ({ default: m.AppsMarketplacePage })));
const AppDetailPage = lazy(() => import('./pages/AppDetailPage').then(m => ({ default: m.AppDetailPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Admin Pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminProjectsPage = lazy(() => import('./pages/admin/AdminProjectsPage').then(m => ({ default: m.AdminProjectsPage })));
const AdminAppsPage = lazy(() => import('./pages/admin/AdminAppsPage').then(m => ({ default: m.AdminAppsPage })));
const AdminDownloadsAnalyticsPage = lazy(() => import('./pages/admin/AdminDownloadsAnalyticsPage').then(m => ({ default: m.AdminDownloadsAnalyticsPage })));
const AdminYouTubePage = lazy(() => import('./pages/admin/AdminYouTubePage').then(m => ({ default: m.AdminYouTubePage })));
const AdminEnquiriesPage = lazy(() => import('./pages/admin/AdminEnquiriesPage').then(m => ({ default: m.AdminEnquiriesPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-2 text-slate-500">
      <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
      <span className="text-xs font-medium">Loading Luminosoft...</span>
    </div>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/website-development" element={<ServicesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/apps" element={<AppsMarketplacePage />} />
              <Route path="/apps/:slug" element={<AppDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminGuard>
                    <AdminDashboardPage />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/projects"
                element={
                  <AdminGuard>
                    <AdminProjectsPage />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/apps"
                element={
                  <AdminGuard>
                    <AdminAppsPage />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/downloads"
                element={
                  <AdminGuard>
                    <AdminDownloadsAnalyticsPage />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/tutorials"
                element={
                  <AdminGuard>
                    <AdminYouTubePage />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/enquiries"
                element={
                  <AdminGuard>
                    <AdminEnquiriesPage />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminGuard>
                    <AdminSettingsPage />
                  </AdminGuard>
                }
              />

              {/* 404 Catch All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
