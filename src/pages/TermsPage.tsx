import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead';
import { BASE_URL } from '../components/seo/schemaHelpers';

export const TermsPage: React.FC = () => {
  return (
    <PageLayout>
      <SEOHead
        title="Terms & Conditions | Luminosoft"
        description="Terms and conditions governing the use of Luminosoft official website, software development services, and application downloads."
        canonicalUrl={`${BASE_URL}/terms`}
        keywords="Luminosoft terms of service, terms and conditions"
      />
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="border-b border-slate-100 pb-6 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-slate-500">
              Last Updated: November 2026 • Luminosoft Official Terms of Service
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6">
            <p>
              Welcome to <strong>Luminosoft</strong>. By accessing our official website, exploring our web development portfolio, or downloading applications from our marketplace, you agree to comply with and be bound by the following terms and conditions.
            </p>

            <h2 className="text-lg font-bold text-slate-900 pt-2">1. Web Development Services &amp; Contracts</h2>
            <p>
              All custom website development and software engineering engagements are governed by individual scope-of-work agreements. Quotations provided via online inquiries are subject to final architectural review and specification confirmation.
            </p>

            <h2 className="text-lg font-bold text-slate-900 pt-2">2. Intellectual Property &amp; Code Ownership</h2>
            <p>
              Upon full settlement of agreed project fees, clients receive full ownership of bespoke custom code and assets created for their solution. Core proprietary libraries and open-source frameworks utilized remain governed by their respective licenses.
            </p>

            <h2 className="text-lg font-bold text-slate-900 pt-2">3. Application Marketplace Downloads</h2>
            <p>
              Applications distributed via the Luminosoft Marketplace (including Android APKs and Windows installers) are provided for authorized use. Users may not reverse-engineer, decompile, or redistribute these packages without express permission.
            </p>

            <h2 className="text-lg font-bold text-slate-900 pt-2">4. Warranties &amp; Support</h2>
            <p>
              We stand by our software with comprehensive post-delivery bug support and testing. We ensure all delivered web projects pass cross-browser compatibility standards.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

