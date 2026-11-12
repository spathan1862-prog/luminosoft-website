import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  fetchYouTubeTutorials, 
  saveYouTubeTutorial, 
  deleteYouTubeTutorial, 
  fetchApplications, 
  fetchCompanySettings, 
  saveCompanySettings,
  extractYouTubeId 
} from '../../lib/api';
import { YouTubeTutorial, Application, CompanySettings } from '../../types';
import { 
  Play, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Video, 
  Save, 
  Clock, 
  Layers, 
  CheckCircle2, 
  X, 
  Eye, 
  EyeOff,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { SocialIcons } from '../../components/ui/SocialIcons';

export const AdminYouTubePage: React.FC = () => {
  const [tutorials, setTutorials] = useState<YouTubeTutorial[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Channel settings state
  const [channelUrl, setChannelUrl] = useState('');
  const [channelName, setChannelName] = useState('');
  const [savingChannel, setSavingChannel] = useState(false);
  const [channelSavedMsg, setChannelSavedMsg] = useState(false);

  // Tutorial modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Partial<YouTubeTutorial> | null>(null);
  const [savingTutorial, setSavingTutorial] = useState(false);
  const [activePreview, setActivePreview] = useState<YouTubeTutorial | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tutData, appsData, settData] = await Promise.all([
        fetchYouTubeTutorials(),
        fetchApplications(),
        fetchCompanySettings(),
      ]);
      setTutorials(tutData);
      setApps(appsData);
      setSettings(settData);
      setChannelUrl(settData.youtube_channel_url || 'https://youtube.com/@luminosoft');
      setChannelName(settData.youtube_channel_name || 'Luminosoft Tutorials');
    } catch (err) {
      console.warn('Failed to load YouTube data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingChannel(true);
    try {
      const updated: CompanySettings = {
        ...settings,
        youtube_channel_url: channelUrl,
        youtube_channel_name: channelName,
        social_links: {
          ...settings.social_links,
          youtube: channelUrl,
        },
      };
      await saveCompanySettings(updated);
      setSettings(updated);
      setChannelSavedMsg(true);
      setTimeout(() => setChannelSavedMsg(false), 3000);
    } catch (err) {
      console.warn('Failed to save channel:', err);
    } finally {
      setSavingChannel(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingTutorial({
      title: '',
      description: '',
      video_url: '',
      duration: '5:00',
      related_application_id: '',
      related_application_name: '',
      is_featured: false,
      is_published: true,
      sort_order: tutorials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tut: YouTubeTutorial) => {
    setEditingTutorial({ ...tut });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete tutorial "${title}"?`)) {
      await deleteYouTubeTutorial(id);
      await loadData();
    }
  };

  const handleTogglePublish = async (tut: YouTubeTutorial) => {
    await saveYouTubeTutorial({
      ...tut,
      is_published: !tut.is_published,
    });
    await loadData();
  };

  const handleSaveTutorial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTutorial || !editingTutorial.title || !editingTutorial.video_url) return;
    setSavingTutorial(true);

    try {
      const selectedApp = apps.find(a => a.id === editingTutorial.related_application_id);
      await saveYouTubeTutorial({
        ...editingTutorial,
        title: editingTutorial.title,
        video_url: editingTutorial.video_url,
        related_application_name: selectedApp ? selectedApp.name : editingTutorial.related_application_name,
      });
      setIsModalOpen(false);
      setEditingTutorial(null);
      await loadData();
    } catch (err) {
      console.warn('Error saving tutorial:', err);
    } finally {
      setSavingTutorial(false);
    }
  };

  return (
    <AdminLayout
      title="YouTube Tutorials &amp; Video Walkthroughs"
      subtitle="Manage video tutorials, installation guides, and your official YouTube channel settings."
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Video Tutorial</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Channel Configuration Box */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <SocialIcons.youtube className="w-5 h-5 fill-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Official YouTube Channel Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Configure the primary YouTube channel linked across the website and tutorials section.
                </p>
              </div>
            </div>

            {channelSavedMsg && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveChannel} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Channel Name
              </label>
              <input
                type="text"
                required
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Luminosoft Official"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Channel URL
              </label>
              <input
                type="url"
                required
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                placeholder="https://youtube.com/@luminosoft"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={savingChannel}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-blue-400" />
                <span>{savingChannel ? 'Saving...' : 'Update Channel'}</span>
              </button>

              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <span>Visit Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </form>
        </div>

        {/* Video Tutorials Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Published Video Tutorials ({tutorials.length})
              </h3>
              <p className="text-xs text-slate-500">
                Videos featured on the homepage and individual application pages.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tut) => (
              <div
                key={tut.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div 
                  className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer group"
                  onClick={() => setActivePreview(tut)}
                >
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
                  {tut.is_featured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase">
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    {tut.related_application_name && (
                      <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block">
                        {tut.related_application_name}
                      </span>
                    )}
                    <h4 
                      className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer"
                      onClick={() => setActivePreview(tut)}
                    >
                      {tut.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {tut.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePublish(tut)}
                        className={`p-1.5 rounded-lg text-xs ${
                          tut.is_published 
                            ? 'text-emerald-600 hover:bg-emerald-50' 
                            : 'text-slate-400 hover:bg-slate-100'
                        }`}
                        title={tut.is_published ? 'Published' : 'Hidden'}
                      >
                        {tut.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(tut)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                        title="Edit Tutorial"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tut.id, tut.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete Tutorial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <a
                      href={tut.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-slate-500 hover:text-rose-600 inline-flex items-center gap-1 font-semibold"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingTutorial && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-modal w-full max-w-lg my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingTutorial.id ? 'Edit Video Tutorial' : 'Add Video Tutorial'}
                </h3>
                <p className="text-xs text-slate-500">
                  Embed video guides for application installation and usage.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTutorial} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tutorial Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingTutorial.title || ''}
                  onChange={(e) => setEditingTutorial({ ...editingTutorial, title: e.target.value })}
                  placeholder="e.g. How to Install Luminosoft Hotel Management on Windows"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  YouTube Video URL *
                </label>
                <input
                  type="url"
                  required
                  value={editingTutorial.video_url || ''}
                  onChange={(e) => setEditingTutorial({ ...editingTutorial, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingTutorial.duration || ''}
                    onChange={(e) => setEditingTutorial({ ...editingTutorial, duration: e.target.value })}
                    placeholder="e.g. 8:45"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Related Application
                  </label>
                  <select
                    value={editingTutorial.related_application_id || ''}
                    onChange={(e) => setEditingTutorial({ ...editingTutorial, related_application_id: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="">General / None</option>
                    {apps.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  value={editingTutorial.description || ''}
                  onChange={(e) => setEditingTutorial({ ...editingTutorial, description: e.target.value })}
                  placeholder="Summary of what viewers will learn in this video guide..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingTutorial.is_featured || false}
                    onChange={(e) => setEditingTutorial({ ...editingTutorial, is_featured: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingTutorial.is_published !== false}
                    onChange={(e) => setEditingTutorial({ ...editingTutorial, is_published: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Published</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTutorial}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {savingTutorial ? 'Saving...' : 'Save Tutorial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <h4 className="text-sm font-bold truncate pr-4">
                {activePreview.title}
              </h4>
              <button
                onClick={() => setActivePreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activePreview.youtube_id || extractYouTubeId(activePreview.video_url)}?autoplay=1`}
                title={activePreview.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

