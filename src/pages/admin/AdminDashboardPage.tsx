import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  fetchWebProjects, 
  fetchApplications, 
  fetchWebsiteEnquiries 
} from '../../lib/api';
import { testSupabaseConnection } from '../../lib/supabase';
import { WebProject, Application, WebsiteEnquiry } from '../../types';
import { 
  Grid, 
  Layers, 
  Inbox, 
  Download, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Database, 
  ExternalLink,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<WebProject[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [enquiries, setEnquiries] = useState<WebsiteEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const [pData, aData, eData, dbRes] = await Promise.all([
          fetchWebProjects(),
          fetchApplications(),
          fetchWebsiteEnquiries(),
          testSupabaseConnection(),
        ]);
        setProjects(pData);
        setApps(aData);
        setEnquiries(eData);
        setDbStatus(dbRes);
      } catch (err) {
        console.warn('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Compute stats
  const totalApps = apps.length;
  const publishedApps = apps.filter((a) => a.is_published).length;
  const draftApps = totalApps - publishedApps;

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.is_published).length;

  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length;
  const pendingEnquiries = enquiries.filter((e) => ['In Discussion', 'Contacted', 'Quotation Sent'].includes(e.status)).length;

  const totalDownloads = apps.reduce((acc, a) => acc + (a.download_count || 0), 0);

  return (
    <AdminLayout
      title="System Overview"
      subtitle="Real-time website metrics, active projects, application downloads, and incoming client enquiries."
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/admin/projects?create=true"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </Link>
          <Link
            to="/admin/apps?create=true"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New App</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Applications */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Applications</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Grid className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{totalApps}</div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span className="text-emerald-600 font-semibold">{publishedApps} Published</span>
                <span>•</span>
                <span>{draftApps} Drafts</span>
              </div>
            </div>
            <Link
              to="/admin/apps"
              className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
            >
              <span>Manage Applications</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 2: Web Projects */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Web Projects</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{totalProjects}</div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span className="text-emerald-600 font-semibold">{publishedProjects} Live</span>
                <span>•</span>
                <span>Including Khan Electrics</span>
              </div>
            </div>
            <Link
              to="/admin/projects"
              className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
            >
              <span>Manage Portfolio</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 3: Website Enquiries */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Client Enquiries</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{totalEnquiries}</div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span className="text-rose-600 font-bold">{newEnquiries} New Leads</span>
                <span>•</span>
                <span>{pendingEnquiries} Pending</span>
              </div>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
            >
              <span>Review Enquiries</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 4: Total Downloads */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Downloads</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Download className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{totalDownloads.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">
                Packages, Installers &amp; APKs
              </div>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block pt-1">
              Active APK &amp; Setup Tracking
            </span>
          </div>
        </div>

        {/* DATABASE CONNECTIVITY & ASSISTANT */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 text-blue-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Supabase Backend Integration Status</span>
                  {dbStatus?.success ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Live &amp; Connected
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Local Resilient Cache Active
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  PostgreSQL database endpoint: <code className="text-slate-800 font-mono">https://vrcpceurhinjzgiseuow.supabase.co</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <span>Supabase Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* RECENT WEBSITE ENQUIRIES (CRITICAL TABLE PREVIEW) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Website Development Enquiries
              </h3>
              <p className="text-xs text-slate-500">
                Customer leads submitted through the public website.
              </p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All Enquiries ({enquiries.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {enquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Client Name</th>
                    <th className="pb-3 font-semibold">Website Type</th>
                    <th className="pb-3 font-semibold">Contact Details</th>
                    <th className="pb-3 font-semibold">Submission Date</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enquiries.slice(0, 5).map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-semibold text-slate-900">
                        {enq.customer_name}
                        {enq.business_name && (
                          <span className="block text-[11px] font-normal text-slate-500">
                            {enq.business_name}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-700">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium">
                          {enq.website_type}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">
                        <div className="font-mono text-[11px]">{enq.phone}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{enq.email}</div>
                      </td>
                      <td className="py-3 text-slate-500 text-[11px]">
                        {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          enq.status === 'New' 
                            ? 'bg-rose-100 text-rose-800'
                            : enq.status === 'Converted to Client'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={`https://wa.me/${(enq.phone || enq.mobile_number || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.customer_name)},%20this%20is%20Luminosoft%20regarding%20your%20website%20inquiry.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <Link
                            to={`/admin/enquiries?id=${enq.id}`}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl p-4 text-xs text-slate-500 space-y-2">
              <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No customer enquiries received yet.</p>
              <p className="text-[11px] text-slate-400">
                Any submission from the public enquiry form will appear here instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

