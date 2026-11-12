import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  ArrowUpRight
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../ui/SocialIcons';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  const services = [
    { name: 'Business Website Development', path: '/website-development' },
    { name: 'E-commerce Website Development', path: '/website-development' },
    { name: 'Hotel Website Development', path: '/website-development' },
    { name: 'Portfolio Website Development', path: '/website-development' },
    { name: 'Custom Software Development', path: '/website-development' },
    { name: 'Mobile Application Development', path: '/website-development' },
    { name: 'CRM & Enterprise Portals', path: '/website-development' },
  ];

  const featuredApps = [
    { name: 'Luminosoft Hotel Management', path: '/apps/hotel-management' },
    { name: 'MedicoManager Healthcare', path: '/apps/medico-manager' },
    { name: 'Bubble Shooter Arcade', path: '/apps/bubble-shooter' },
    { name: 'Color Block Puzzle', path: '/apps/color-block-puzzle' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Website Development Services', path: '/website-development' },
    { name: 'Our Web Projects', path: '/projects' },
    { name: 'Application Marketplace', path: '/apps' },
    { name: 'About Luminosoft', path: '/about' },
    { name: 'Contact & Enquiries', path: '/contact' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper Footer: Main columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Col 1 & 2: Company Profile */}
          <div className="lg:col-span-2 space-y-5">
            <Logo size="lg" light />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {settings.footer_content || 
                "Luminosoft delivers professional website development, custom software, mobile applications and CRM solutions to help businesses grow digitally."}
            </p>

            {/* Direct Contact info */}
            <div className="space-y-2.5 pt-2 text-xs">
              <a 
                href={`mailto:${settings.email}`} 
                className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{settings.email}</span>
              </a>
              <a 
                href={`tel:${settings.phone.replace(/\s+/g, '')}`} 
                className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{settings.phone}</span>
              </a>
              <div className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>{settings.business_address}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-3">
              {settings.social_links?.github && (
                <a
                  href={settings.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Luminosoft`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                aria-label="WhatsApp Contact"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={settings.social_links?.linkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={settings.social_links?.twitter || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                aria-label="Twitter Profile"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Website Services
            </h3>
            <ul className="space-y-2.5 text-xs">
              {services.map((s) => (
                <li key={s.name}>
                  <Link 
                    to={s.path} 
                    className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{s.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Applications Marketplace */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Our Applications
            </h3>
            <ul className="space-y-2.5 text-xs">
              {featuredApps.map((app) => (
                <li key={app.name}>
                  <Link 
                    to={app.path} 
                    className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{app.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/apps"
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  <span>Browse Marketplace →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.map((ql) => (
                <li key={ql.name}>
                  <Link 
                    to={ql.path} 
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <span>{ql.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 block mb-0.5">Need a Custom Project?</span>
              Submit your requirements directly through our online enquiry system.
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer: Copyright & Legal */}
      <div className="border-t border-slate-900 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Luminosoft. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
