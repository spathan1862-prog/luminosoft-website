import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead';
import { BASE_URL } from '../components/seo/schemaHelpers';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <PageLayout>
      <SEOHead
        title="Privacy Policy | Luminosoft"
        description="Official Privacy Policy of Luminosoft. Learn how we safeguard your data and respect your confidentiality across our website and software applications."
        canonicalUrl={`${BASE_URL}/privacy-policy`}
        keywords="Luminosoft privacy policy, data protection, software security"
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
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500">
              Effective Date: November 12, 2026 • Luminosoft Official Policy
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6">
            <p>
              At <strong>Luminosoft</strong>, we value the trust you place in us when sharing your project specifications, personal contact information, or using our software applications. This Privacy Policy outlines how we collect, store, and safeguard your data across our official website, application marketplace, and customer communication channels.
            </p>

            <h2 className="text-lg font-bold text-slate-900 pt-2">1. Information We Collect</h2>
            <p>
              When you submit a website development inquiry, request a software quote, or contact our support team, we collect the details you explicitly provide:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Full Name and Contact Details (Email address, Phone / WhatsApp number).</li>
              <li>Business or Organization Name.</li>
              <li>Project requirements, website category, approximate budget, and description.</li>
            </ul>

            <h2 className="text-lg font-bold text-slate-900 pt-2">2. How We Use Your Information</h2>
            <p>
              Your information is collected solely for the following legitimate business purposes:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>To evaluate project requirements and prepare technical proposals and quotation estimates.</li>
              <li>To contact you via phone, email, or WhatsApp regarding your submitted inquiries.</li>
              <li>To provide technical support and deliver updates for Luminosoft software applications.</li>
            </ul>

            <h2 className="text-lg font-bold text-slate-900 pt-2">3. Database Security &amp; Storage</h2>
            <p>
              All submitted data is stored in our secure PostgreSQL database managed with strict Row Level Security (RLS) policies. Only authenticated administrators have authorization to access customer inquiries. We never sell, rent, or trade your personal details to third-party marketing companies.
            </p>

            <h2 className="text-lg font-bold text-slate-900 pt-2">4. Software Applications Privacy</h2>
            <p>
              Desktop applications (such as MedicoManager and Luminosoft Hotel Management) operate primarily in offline-first mode with local database storage. Guest and patient records remain on your local computer or designated server, ensuring strict compliance with operational confidentiality.
            </p>

            <h2 className="text-lg font-bold text-slate-900 pt-2">5. Contact Regarding Privacy</h2>
            <p>
              If you have any questions or wish to request the deletion of your inquiry records, please reach out directly to <strong>contact@luminosoft.in</strong>.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

