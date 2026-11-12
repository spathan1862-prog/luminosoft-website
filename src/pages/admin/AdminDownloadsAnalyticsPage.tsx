import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchDownloadAnalytics, fetchDownloadEvents } from '../../lib/api';
import { DownloadEvent } from '../../types';
import { 
  Download, 
  Monitor, 
  Smartphone, 
  Calendar, 
  TrendingUp, 
  Filter, 
  HardDrive, 
  CheckCircle2, 
  Globe, 
  RefreshCw,
  ExternalLink,
  Layers
} from 'lucide-react';

export const AdminDownloadsAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'all'>('all');
  const [analytics, setAnalytics] = useState<{
    totalDownloads: number;
    byApp: { name: string; count: number }[];
    byPlatform: { platform: string; count: number }[];
    recentEvents: DownloadEvent[];
  }>({
    totalDownloads: 0,
    byApp: [],
    byPlatform: [],
    recentEvents: [],
  });
  const [loading, setLoading] = useState(true);

  const loadData = async (range: 'today' | '7d' | '30d' | 'all') => {
    setLoading(true);
    try {
      const data = await fetchDownloadAnalytics(range);
      setAnalytics(data);
    } catch (err) {
      console.warn('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(timeRange);
  }, [timeRange]);

  const maxAppCount = analytics.byApp.length > 0 ? analytics.byApp[0].count : 1;

  return (
    <AdminLayout
      title="Downloads &amp; Analytics"
      subtitle="Track real-time binary download initiations, popular applications, and user operating system distribution."
      actions={
        <div className="flex items-center gap-2">
          {/* Time range buttons */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
            {(['today', '7d', '30d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer capitalize ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range === 'today' ? 'Today' : range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <button
            onClick={() => loadData(timeRange)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Downloads */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Downloads
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Download className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              {analytics.totalDownloads}
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct binary download events</span>
            </p>
          </div>

          {/* Card 2: Top Application */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Most Downloaded
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900 truncate">
              {analytics.byApp[0]?.name || 'No downloads yet'}
            </div>
            <p className="text-[11px] text-slate-500">
              {analytics.byApp[0] ? `${analytics.byApp[0].count} package downloads` : 'Waiting for activity'}
            </p>
          </div>

          {/* Card 3: Top Platform */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Top Platform
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Monitor className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900 capitalize">
              {analytics.byPlatform[0]?.platform || 'N/A'}
            </div>
            <p className="text-[11px] text-slate-500">
              {analytics.byPlatform[0] ? `${analytics.byPlatform[0].count} downloads` : 'No platform logs'}
            </p>
          </div>

          {/* Card 4: Health Check */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Telemetry Mode
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xl font-bold text-emerald-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Active Logging</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Non-blocking event listener enabled
            </p>
          </div>
        </div>

        {/* Charts & Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Downloads by Application */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Downloads by Application
                </h3>
                <p className="text-xs text-slate-500">
                  Ranking of applications based on binary downloads initiated.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600">
                {analytics.byApp.length} Apps Tracked
              </span>
            </div>

            {analytics.byApp.length > 0 ? (
              <div className="space-y-4">
                {analytics.byApp.map((item) => {
                  const percent = Math.round((item.count / maxAppCount) * 100);
                  return (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="font-mono font-bold text-slate-900">
                          {item.count} downloads
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                <Download className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No downloads recorded for this time range yet.</p>
              </div>
            )}
          </div>

          {/* Right Col: Downloads by Platform */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Operating System Distribution
              </h3>
              <p className="text-xs text-slate-500">
                User target platform share.
              </p>
            </div>

            {analytics.byPlatform.length > 0 ? (
              <div className="space-y-3">
                {analytics.byPlatform.map((plat) => {
                  const share = analytics.totalDownloads > 0 
                    ? Math.round((plat.count / analytics.totalDownloads) * 100) 
                    : 0;

                  return (
                    <div
                      key={plat.platform}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700">
                          {plat.platform.includes('android') ? (
                            <Smartphone className="w-4 h-4 text-emerald-600" />
                          ) : plat.platform.includes('windows') ? (
                            <Monitor className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Globe className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 capitalize">
                            {plat.platform}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {plat.count} downloads
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {share}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No platform activity recorded.
              </div>
            )}
          </div>
        </div>

        {/* Activity Log Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Download Log
              </h3>
              <p className="text-xs text-slate-500">
                Audit trail of recent download events.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Displaying latest {analytics.recentEvents.length} events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-6">Date &amp; Time</th>
                  <th className="py-3 px-6">Application</th>
                  <th className="py-3 px-6">Version</th>
                  <th className="py-3 px-6">Platform</th>
                  <th className="py-3 px-6">Download URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.recentEvents.length > 0 ? (
                  analytics.recentEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-6 text-slate-500 font-mono">
                        {ev.created_at ? new Date(ev.created_at).toLocaleString() : ev.download_date}
                      </td>
                      <td className="py-3 px-6 font-bold text-slate-900">
                        {ev.application_name}
                      </td>
                      <td className="py-3 px-6 font-mono text-slate-600">
                        v{ev.version}
                      </td>
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium capitalize">
                          {ev.platform}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-slate-400 max-w-xs truncate">
                        {ev.download_url ? (
                          <a
                            href={ev.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                          >
                            <span className="truncate max-w-[200px]">{ev.download_url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="font-mono text-[11px]">Direct Binary</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No download events logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

