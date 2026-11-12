import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <PageLayout>
      <SEOHead
        title="404 – Page Not Found | Luminosoft"
        description="The requested page could not be found on Luminosoft."
        noIndex={true}
      />
      <section className="py-24 text-center">
        <div className="max-w-md mx-auto px-4 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-2xl">
            404
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900">Page Not Found</h1>
            <p className="text-sm text-slate-600">
              The page you are looking for does not exist, has been moved, or is temporarily unavailable.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span>View Projects</span>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

