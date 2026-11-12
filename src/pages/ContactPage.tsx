import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { WebsiteEnquiryForm } from '../components/enquiry/WebsiteEnquiryForm';
import { useSettings } from '../context/SettingsContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../components/ui/SocialIcons';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>Connect with Luminosoft</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Contact &amp; Project Enquiries
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Have a project in mind, need software support, or want a custom website quote? Reach out to our technical team through the enquiry form or direct channels.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Channels + Website Enquiry Form */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left Col: Direct Company Details */}
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Direct Contact Information
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Reach our developers directly during standard business hours.
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Official Email
                      </span>
                      <a
                        href={`mailto:${settings.email}`}
                        className="font-medium text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Direct Phone
                      </span>
                      <a
                        href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                        className="font-medium text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        WhatsApp Instant Chat
                      </span>
                      <a
                        href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Luminosoft`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-emerald-700 hover:underline"
                      >
                        {settings.whatsapp} (Click to Chat)
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Headquarters &amp; Office
                      </span>
                      <span className="font-medium text-slate-900">
                        {settings.business_address}
                      </span>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Consultation Hours
                      </span>
                      <span className="font-medium text-slate-900">
                        Monday – Saturday: 9:00 AM – 7:00 PM IST
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social media links */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Developer &amp; Company Profiles
                  </span>
                  <div className="flex items-center gap-2">
                    {settings.social_links?.github && (
                      <a
                        href={settings.social_links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-colors"
                        aria-label="GitHub"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={settings.social_links?.linkedin || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={settings.social_links?.twitter || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-sky-500 hover:text-white transition-colors"
                      aria-label="Twitter"
                    >
                      <TwitterIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Security & Privacy Guarantee */}
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-200/60 text-xs text-blue-900 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Every enquiry submitted to Luminosoft is stored permanently in our encrypted PostgreSQL database with restricted admin authorization. Your email or phone number is never shared with third parties.
                </p>
              </div>
            </div>

            {/* Right 2 Cols: Interactive Website Enquiry Form */}
            <div className="lg:col-span-2">
              <WebsiteEnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
