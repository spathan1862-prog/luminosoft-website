import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { renderAppIcon } from '../../components/apps/AppCard';
import { 
  fetchApplications, 
  saveApplication, 
  deleteApplication, 
  addApplicationUpdate,
  uploadAssetFileWithProgress 
} from '../../lib/api';
import { Application, ApplicationDownload, ApplicationUpdate, PlatformType } from '../../types';
import { INITIAL_APP_CATEGORIES } from '../../lib/initialData';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Download, 
  History, 
  X, 
  Eye, 
  EyeOff, 
  Loader2, 
  Sparkles,
  Smartphone,
  Monitor,
  Apple,
  Globe,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Layers,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  ShieldCheck
} from 'lucide-react';

export const AdminAppsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const hasHandledCreateParamRef = React.useRef(false);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // App Modal
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Partial<Application> | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'features' | 'downloads'>('details');
  const [savingApp, setSavingApp] = useState(false);
  const [saveActionType, setSaveActionType] = useState<'draft' | 'publish' | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const [screenshotInput, setScreenshotInput] = useState('');

  // Download Package Sub-form inside modal
  const [newDownloadPlatform, setNewDownloadPlatform] = useState<string>('windows');
  const [newDownloadName, setNewDownloadName] = useState('Windows Setup (64-bit)');
  const [newDownloadMethod, setNewDownloadMethod] = useState<'upload' | 'github'>('github');
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
  const [newDownloadSize, setNewDownloadSize] = useState('');
  const [newDownloadVersion, setNewDownloadVersion] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Update Modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [targetAppForUpdate, setTargetAppForUpdate] = useState<Application | null>(null);
  const [newVersion, setNewVersion] = useState('');
  const [whatsNew, setWhatsNew] = useState('');
  const [newFeaturesInput, setNewFeaturesInput] = useState('');
  const [bugFixesInput, setBugFixesInput] = useState('');
  const [updateDownloadUrl, setUpdateDownloadUrl] = useState('');
  const [savingUpdate, setSavingUpdate] = useState(false);

  const loadApps = async () => {
    try {
      const data = await fetchApplications();
      setApps(data);
    } catch (err) {
      console.warn('Failed to load apps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
    if (searchParams.get('create') === 'true' && !hasHandledCreateParamRef.current) {
      hasHandledCreateParamRef.current = true;
      handleOpenCreateApp();
    }
  }, [searchParams]);

  const handleOpenCreateApp = () => {
    setEditingApp({
      name: '',
      slug: '',
      category: 'Business Software',
      icon: 'Grid',
      short_description: '',
      full_description: '',
      features: [],
      screenshots: [],
      supported_platforms: ['windows'],
      system_requirements: 'Windows 10/11 or Android 8.0+',
      app_size: '',
      version: '1.0.0',
      release_date: new Date().toISOString().slice(0, 10),
      is_featured: false,
      is_published: false,
      sort_order: apps.length + 1,
      downloads: [],
    });
    setActiveTab('details');
    setFeatureInput('');
    setScreenshotInput('');
    resetDownloadSubform('windows');
    setIsAppModalOpen(true);
  };

  const handleOpenEditApp = (app: Application) => {
    setEditingApp({
      ...app,
      app_size: app.app_size || '',
      is_published: app.is_published ?? false,
      downloads: app.downloads ? [...app.downloads] : [],
      features: app.features ? [...app.features] : [],
      screenshots: app.screenshots ? [...app.screenshots] : [],
      supported_platforms: app.supported_platforms ? [...app.supported_platforms] : ['windows'],
    });
    setActiveTab('details');
    setFeatureInput('');
    setScreenshotInput('');
    resetDownloadSubform('windows');
    setIsAppModalOpen(true);
  };

  const resetDownloadSubform = (platform: string) => {
    setNewDownloadPlatform(platform);
    setNewDownloadName(platform === 'android' ? 'Android APK Package' : 'Windows Setup (64-bit)');
    setNewDownloadMethod(platform === 'android' ? 'upload' : 'github');
    setNewDownloadUrl('');
    setNewDownloadSize('');
    setNewDownloadVersion(editingApp?.version || '1.0.0');
    setUploadProgress(null);
    setUploadError(null);
  };

  const handleDeleteApp = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete application "${name}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    setToastMessage(null);
    try {
      const result = await deleteApplication(id);
      if (result.success) {
        setToastMessage({ type: 'success', text: `Application "${name}" was permanently deleted.` });
        await loadApps();
      } else {
        setToastMessage({ type: 'error', text: `Failed to delete application "${name}": ${result.error || 'Unknown error'}` });
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: `Failed to delete application "${name}": ${err?.message || 'Unknown error'}` });
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (app: Application) => {
    setToastMessage(null);
    try {
      const result = await saveApplication({
        ...app,
        is_published: !app.is_published,
      });
      if (result.success) {
        setToastMessage({
          type: 'success',
          text: `Application "${app.name}" is now ${!app.is_published ? 'Live (Published)' : 'Draft (Unpublished)'}.`,
        });
        await loadApps();
      } else {
        setToastMessage({
          type: 'error',
          text: `Failed to update status for "${app.name}": ${result.error || 'Unknown error'}`,
        });
      }
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        text: `Failed to update status: ${err?.message || 'Unknown error'}`,
      });
    }
  };

  const updateEditingField = <K extends keyof Application>(field: K, value: Application[K]) => {
    setEditingApp((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setEditingApp((prev) => {
      if (!prev) return prev;
      const current = prev.features || [];
      return { ...prev, features: [...current, featureInput.trim()] };
    });
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setEditingApp((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        features: (prev.features || []).filter((_, i) => i !== idx),
      };
    });
  };

  const handleAddScreenshot = () => {
    if (!screenshotInput.trim()) return;
    setEditingApp((prev) => {
      if (!prev) return prev;
      const current = prev.screenshots || [];
      return { ...prev, screenshots: [...current, screenshotInput.trim()] };
    });
    setScreenshotInput('');
  };

  const handleRemoveScreenshot = (idx: number) => {
    setEditingApp((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        screenshots: (prev.screenshots || []).filter((_, i) => i !== idx),
      };
    });
  };

  const handlePlatformToggle = (platform: PlatformType) => {
    setEditingApp((prev) => {
      if (!prev) return prev;
      const current = prev.supported_platforms || [];
      const exists = current.includes(platform);
      const updated = exists ? current.filter((p) => p !== platform) : [...current, platform];
      return { ...prev, supported_platforms: updated };
    });
  };

  // Direct File Upload to Supabase Storage (<50MB)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadProgress(10);

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setNewDownloadSize(`${sizeMb} MB`);

    const result = await uploadAssetFileWithProgress(
      'apps',
      file,
      `releases/${Date.now()}_${file.name}`,
      (percent) => setUploadProgress(percent)
    );

    if (result.success && result.url) {
      setNewDownloadUrl(result.url);
      setUploadProgress(100);
    } else {
      setUploadError(result.error || 'Upload failed');
      setUploadProgress(null);
    }
  };

  // Add Download Package to App
  const handleAddDownloadPackage = () => {
    if (!editingApp || !newDownloadUrl.trim()) {
      alert('Please enter or upload a valid download URL.');
      return;
    }

    const newPkg: ApplicationDownload = {
      id: `dl-${Date.now()}`,
      application_id: editingApp.id || '',
      platform: newDownloadPlatform,
      platform_name: newDownloadName || `${newDownloadPlatform.toUpperCase()} Package`,
      download_url: newDownloadUrl.trim(),
      direct_asset_url: newDownloadUrl.trim(),
      is_github_release: newDownloadMethod === 'github',
      file_size: newDownloadSize || editingApp.app_size || 'Official Build',
      version: newDownloadVersion || editingApp.version || '1.0.0',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setEditingApp((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        downloads: [...(prev.downloads || []), newPkg],
      };
    });

    // Reset sub-form
    setNewDownloadUrl('');
    setUploadProgress(null);
    setUploadError(null);
  };

  const handleRemoveDownloadPackage = (id: string) => {
    setEditingApp((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        downloads: (prev.downloads || []).filter((d) => d.id !== id),
      };
    });
  };

  // 4-Step Wizard Navigation & Validation (Zero database writes)
  const handleNextStep = () => {
    if (!editingApp) return;
    if (activeTab === 'details') {
      if (!editingApp.name?.trim()) {
        alert('Application Name is required in Step 1.');
        return;
      }
      if (!editingApp.short_description?.trim()) {
        alert('Short Description is required in Step 1.');
        return;
      }
      setActiveTab('media');
    } else if (activeTab === 'media') {
      if (!editingApp.icon?.trim()) {
        alert('App Icon is required in Step 2.');
        return;
      }
      setActiveTab('features');
    } else if (activeTab === 'features') {
      if (!editingApp.supported_platforms || editingApp.supported_platforms.length === 0) {
        alert('Please select at least one supported platform in Step 3.');
        return;
      }
      setActiveTab('downloads');
    }
  };

  const handlePrevStep = () => {
    if (activeTab === 'downloads') setActiveTab('features');
    else if (activeTab === 'features') setActiveTab('media');
    else if (activeTab === 'media') setActiveTab('details');
  };

  // Strict separation of Save as Draft vs Publish Application
  const handleSaveApplication = async (shouldPublish: boolean) => {
    if (savingApp) return;

    if (!editingApp || !editingApp.name?.trim()) {
      alert('Application name is required before saving.');
      return;
    }

    if (!editingApp.category?.trim()) {
      alert('Please select an application category.');
      return;
    }

    setSavingApp(true);
    setSaveActionType(shouldPublish ? 'publish' : 'draft');
    setToastMessage(null);

    try {
      const payload: Partial<Application> = {
        ...editingApp,
        name: editingApp.name.trim(),
        slug: editingApp.slug?.trim() || undefined,
        app_size: editingApp.app_size?.trim() || undefined,
        is_published: shouldPublish,
      };

      const result = await saveApplication(payload);
      setSavingApp(false);
      setSaveActionType(null);

      if (!result.success) {
        setToastMessage({
          type: 'error',
          text: `Failed to ${shouldPublish ? 'publish' : 'save draft'}: ${result.error || 'Unknown error'}`,
        });
        alert(`Failed to save application: ${result.error || 'Unknown error'}`);
        return;
      }

      setToastMessage({
        type: 'success',
        text: shouldPublish
          ? `Application "${editingApp.name}" was successfully published to the live marketplace!`
          : `Application "${editingApp.name}" was saved as an unpublished Draft.`,
      });
      setIsAppModalOpen(false);
      setEditingApp(null);
      await loadApps();
    } catch (err: any) {
      setSavingApp(false);
      setSaveActionType(null);
      alert(`Unexpected error saving application: ${err?.message || 'Unknown error'}`);
    }
  };

  // Open Update Modal
  const handleOpenUpdateModal = (app: Application) => {
    setTargetAppForUpdate(app);
    setNewVersion('');
    setWhatsNew('');
    setNewFeaturesInput('');
    setBugFixesInput('');
    setUpdateDownloadUrl('');
    setIsUpdateModalOpen(true);
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppForUpdate || !newVersion.trim()) return;

    setSavingUpdate(true);
    setToastMessage(null);
    const newFeatures = newFeaturesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const bugFixes = bugFixesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await addApplicationUpdate({
        application_id: targetAppForUpdate.id,
        version: newVersion.trim(),
        release_date: new Date().toISOString().slice(0, 10),
        whats_new: whatsNew.trim(),
        new_features: newFeatures,
        bug_fixes: bugFixes,
        download_url: updateDownloadUrl.trim() || undefined,
      });

      setSavingUpdate(false);
      if (!res.success) {
        alert(`Failed to publish update: ${res.error || 'Unknown error'}`);
        return;
      }

      setToastMessage({
        type: 'success',
        text: `Update v${newVersion.trim()} published for "${targetAppForUpdate.name}".`,
      });
      setIsUpdateModalOpen(false);
      setTargetAppForUpdate(null);
      await loadApps();
    } catch (err: any) {
      setSavingUpdate(false);
      alert(`Unexpected error publishing update: ${err?.message || 'Unknown error'}`);
    }
  };

  const filteredApps = apps.filter((a) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      a.category.toLowerCase().includes(selectedCategory.replace(/-/g, ' ').toLowerCase());
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout
      title="Application Marketplace Management"
      subtitle="Manage applications, verified binary downloads (<50MB Supabase or >=50MB GitHub Releases), and release changelogs."
      actions={
        <button
          onClick={handleOpenCreateApp}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Application</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Feedback Alert / Toast Banner */}
        {toastMessage && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-xs animate-fade-in ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-black/5 rounded-lg cursor-pointer transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Filters */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {INITIAL_APP_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-6">App</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Version &amp; Size</th>
                  <th className="py-3.5 px-6">Platforms</th>
                  <th className="py-3.5 px-6">Downloads</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {renderAppIcon(app.icon, 'sm')}
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{app.name}</span>
                            {app.is_featured && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            /apps/{app.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {app.category}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-mono text-slate-800 font-semibold">
                        v{app.version}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {app.app_size || 'N/A'}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        {app.supported_platforms.map((p) => (
                          <span
                            key={p}
                            className="p-1 rounded bg-slate-100 text-slate-600 capitalize text-[10px]"
                            title={p}
                          >
                            {p === 'windows' ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-bold">{app.downloads?.length || 0} packages</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleTogglePublish(app)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          app.is_published
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {app.is_published ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenUpdateModal(app)}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                          title="Release Update"
                        >
                          <History className="w-3 h-3" />
                          <span>Release</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditApp(app)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                          title="Edit App"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteApp(app.id, app.name)}
                          disabled={deletingId === app.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Delete App"
                        >
                          {deletingId === app.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT APPLICATION MODAL (WITH MULTI-METHOD DOWNLOAD MANAGEMENT) */}
      {isAppModalOpen && editingApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-modal w-full max-w-3xl max-h-[90vh] flex flex-col my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingApp.id ? `Edit: ${editingApp.name}` : 'Add New Application'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure metadata, images, and verified download packages.
                </p>
              </div>
              <button
                onClick={() => setIsAppModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4-Step Progress Tabs */}
            <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Step 1: Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'media'
                    ? 'border-blue-600 text-blue-600 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Step 2: Branding &amp; Images
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('features')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'features'
                    ? 'border-blue-600 text-blue-600 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Step 3: Features &amp; Platform
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('downloads')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'downloads'
                    ? 'border-blue-600 text-blue-600 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Step 4: Packages &amp; Publish</span>
              </button>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                  e.preventDefault();
                }
              }}
              className="p-6 overflow-y-auto space-y-4 flex-1"
            >
              {/* TAB 1: BASIC DETAILS */}
              {activeTab === 'details' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Application Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Luminosoft Hotel Management"
                        value={editingApp.name || ''}
                        onChange={(e) => updateEditingField('name', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. hotel-management"
                        value={editingApp.slug || ''}
                        onChange={(e) => updateEditingField('slug', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={editingApp.category || 'Business Software'}
                        onChange={(e) => updateEditingField('category', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Business Software">Business Software</option>
                        <option value="Hotel Management">Hotel Management</option>
                        <option value="Medical Management">Medical Management</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Games">Games</option>
                        <option value="Other Applications">Other Applications</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Current Version
                      </label>
                      <input
                        type="text"
                        placeholder="1.0.0"
                        value={editingApp.version || '1.0.0'}
                        onChange={(e) => updateEditingField('version', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Package Size
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 74.65 or 74 MB"
                        value={editingApp.app_size || ''}
                        onChange={(e) => updateEditingField('app_size', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Release Date
                      </label>
                      <input
                        type="date"
                        value={editingApp.release_date || new Date().toISOString().slice(0, 10)}
                        onChange={(e) => updateEditingField('release_date', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Short Description (Card Summary) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Brief overview shown on homepage and marketplace cards..."
                      value={editingApp.short_description || ''}
                      onChange={(e) => updateEditingField('short_description', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full In-Depth Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Comprehensive overview displayed on the dedicated details page..."
                      value={editingApp.full_description || ''}
                      onChange={(e) => updateEditingField('full_description', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      System Requirements
                    </label>
                    <input
                      type="text"
                      placeholder="Windows 10/11 64-bit, 4GB RAM or Android 8+"
                      value={editingApp.system_requirements || ''}
                      onChange={(e) => updateEditingField('system_requirements', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: BRANDING & IMAGES */}
              {activeTab === 'media' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      App Icon URL or Icon Name *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="/images/hotel-icon.ico or Building"
                        value={editingApp.icon || ''}
                        onChange={(e) => updateEditingField('icon', e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300"
                      />
                      <div className="p-1 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                        {renderAppIcon(editingApp.icon || 'Grid', 'sm')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Screenshots Gallery
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={screenshotInput}
                        onChange={(e) => setScreenshotInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddScreenshot();
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={handleAddScreenshot}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(editingApp.screenshots || []).map((img, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video group">
                          <img src={img} alt="Screenshot" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveScreenshot(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FEATURES & PLATFORM */}
              {activeTab === 'features' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Supported Platforms
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['windows', 'android', 'macos', 'ios', 'web'] as PlatformType[]).map((plat) => {
                        const isChecked = (editingApp.supported_platforms || []).includes(plat);
                        return (
                          <button
                            key={plat}
                            type="button"
                            onClick={() => handlePlatformToggle(plat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize cursor-pointer ${
                              isChecked
                                ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {plat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Core Features
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g. 1-Minute Express Guest Check-in"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-1">
                      {(editingApp.features || []).map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs text-slate-700"
                        >
                          <span>• {feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            className="text-slate-400 hover:text-rose-600 font-bold px-1 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={editingApp.is_featured || false}
                        onChange={(e) => updateEditingField('is_featured', e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span>Mark as Featured App</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 4: DOWNLOAD PACKAGES & PRE-PUBLISH REVIEW */}
              {activeTab === 'downloads' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Current Active Packages */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Configured Download Packages
                    </h4>

                    {(editingApp.downloads || []).length > 0 ? (
                      <div className="space-y-2">
                        {editingApp.downloads!.map((dl) => (
                          <div
                            key={dl.id}
                            className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                <span>{dl.platform_name}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 capitalize">
                                  {dl.platform}
                                </span>
                                {dl.is_github_release && (
                                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded px-1.5 py-0.2">
                                    GitHub Release
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono truncate max-w-md">
                                {dl.download_url}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveDownloadPackage(dl.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Remove package"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No download packages added yet. Use the form below to attach an Android APK or Windows executable.
                      </p>
                    )}
                  </div>

                  {/* Add New Package Sub-form */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-blue-600" />
                        <span>Add Download Package</span>
                      </h4>

                      {/* Method Switcher */}
                      <div className="flex items-center gap-1 p-0.5 bg-white border border-blue-200 rounded-lg text-[11px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setNewDownloadMethod('upload')}
                          className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                            newDownloadMethod === 'upload'
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Method A: Supabase Upload (&lt;50MB)
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewDownloadMethod('github')}
                          className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                            newDownloadMethod === 'github'
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Method B: GitHub Release (&ge;50MB)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Platform
                        </label>
                        <select
                          value={newDownloadPlatform}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewDownloadPlatform(val);
                            if (val === 'android') setNewDownloadName('Android APK Package');
                            if (val === 'windows') setNewDownloadName('Windows Setup (64-bit)');
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="windows">Windows</option>
                          <option value="android">Android</option>
                          <option value="macos">macOS</option>
                          <option value="ios">iOS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={newDownloadName}
                          onChange={(e) => setNewDownloadName(e.target.value)}
                          placeholder="e.g. Windows Setup (64-bit)"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          File Size
                        </label>
                        <input
                          type="text"
                          value={newDownloadSize}
                          onChange={(e) => setNewDownloadSize(e.target.value)}
                          placeholder="e.g. 77.6 MB"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    {/* Method A: File Upload */}
                    {newDownloadMethod === 'upload' && (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Select Binary File (&lt; 50MB, e.g. .apk or lightweight .exe)
                        </label>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                        />
                        {uploadProgress !== null && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-600">
                              <span>Uploading to Supabase Storage...</span>
                              <span className="font-mono font-bold">{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {uploadError && (
                          <div className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>{uploadError}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Method B: GitHub Releases Direct URL */}
                    {newDownloadMethod === 'github' && (
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Direct GitHub Release Asset URL (&ge; 50MB)
                        </label>
                        <input
                          type="url"
                          value={newDownloadUrl}
                          onChange={(e) => setNewDownloadUrl(e.target.value)}
                          placeholder="https://github.com/spathan1862-prog/khan-apps/releases/latest/download/Hotel-Management-Setup.exe"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                        />
                        <p className="text-[10px] text-slate-500">
                          <strong>Direct Download Rule:</strong> URL must point directly to the binary asset (e.g. ending in <code>.exe</code> or <code>.apk</code>) to ensure one-click direct downloading without intermediate GitHub pages.
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddDownloadPackage}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs cursor-pointer"
                      >
                        Attach Package to App
                      </button>
                    </div>
                  </div>

                  {/* Pre-Publish Review Summary Card */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-800">Pre-Publishing Review &amp; Safety Status</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          editingApp.is_published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {editingApp.is_published ? '● Live (Published)' : '○ Draft (Unpublished)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                        <div className="text-slate-400 font-medium">Application</div>
                        <div className="font-semibold text-slate-800 truncate">{editingApp.name || '(Not set)'}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                        <div className="text-slate-400 font-medium">Version</div>
                        <div className="font-semibold text-slate-800 font-mono">{editingApp.version || '1.0.0'}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                        <div className="text-slate-400 font-medium">Package Size</div>
                        <div className="font-semibold text-slate-800">{editingApp.app_size || '(Not specified)'}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                        <div className="text-slate-400 font-medium">Packages Attached</div>
                        <div className="font-semibold text-slate-800 font-mono">{(editingApp.downloads || []).length} package(s)</div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      <strong>Publishing Safety Rule:</strong> Moving between wizard steps or entering data never saves or publishes automatically. Choose <strong>Save as Draft</strong> to keep this application hidden from the live marketplace, or <strong>Publish Application</strong> to make it live for customers.
                    </p>
                  </div>
                </div>
              )}

              {/* Modal 4-Step Wizard Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAppModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>

                  {/* Previous Button (Hidden on Step 1) */}
                  {activeTab !== 'details' && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Step 1, 2, 3: NEXT ONLY. Strictly NO Save/Publish. */}
                  {activeTab !== 'downloads' ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <span>
                        {activeTab === 'details'
                          ? 'Next: Branding & Media'
                          : activeTab === 'media'
                          ? 'Next: Features & Platform'
                          : 'Next: Download Packages'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    /* Step 4: EXPLICIT Draft or Publish Actions ONLY */
                    <>
                      <button
                        type="button"
                        disabled={savingApp}
                        onClick={() => handleSaveApplication(false)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg shadow-2xs disabled:opacity-50 cursor-pointer transition-colors"
                      >
                        {savingApp && saveActionType === 'draft' ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving Draft...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-slate-600" />
                            <span>Save as Draft</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={savingApp}
                        onClick={() => handleSaveApplication(true)}
                        className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs disabled:opacity-50 cursor-pointer transition-colors"
                      >
                        {savingApp && saveActionType === 'publish' ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Publishing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Publish Application</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERSION UPDATE RELEASE MODAL */}
      {isUpdateModalOpen && targetAppForUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-modal w-full max-w-lg my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Release Version Update
                </h3>
                <p className="text-xs text-slate-500">
                  Publish changelog and binary update for {targetAppForUpdate.name}
                </p>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Version *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1.1.0"
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  What's New Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Overview of this update release..."
                  value={whatsNew}
                  onChange={(e) => setWhatsNew(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Features (one per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="Added export to PDF&#10;Added dark mode preview"
                  value={newFeaturesInput}
                  onChange={(e) => setNewFeaturesInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bug Fixes (one per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="Fixed invoice calculation glitch&#10;Resolved crash on Android 14"
                  value={bugFixesInput}
                  onChange={(e) => setBugFixesInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Download URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={updateDownloadUrl}
                  onChange={(e) => setUpdateDownloadUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUpdate}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {savingUpdate ? 'Publishing...' : 'Publish Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
