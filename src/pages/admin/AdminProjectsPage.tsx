import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchWebProjects, saveWebProject, deleteWebProject } from '../../lib/api';
import { WebProject } from '../../types';
import { INITIAL_PROJECT_CATEGORIES } from '../../lib/initialData';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Upload, 
  Eye, 
  EyeOff, 
  Layers, 
  Loader2,
  AlertCircle
} from 'lucide-react';

export const AdminProjectsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<WebProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<WebProject> | null>(null);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  const loadProjects = async () => {
    try {
      const data = await fetchWebProjects();
      setProjects(data);
    } catch (err) {
      console.warn('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    if (searchParams.get('create') === 'true') {
      handleOpenCreate();
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    setEditingProject({
      title: '',
      slug: '',
      category: 'Business Websites',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      screenshots: [],
      short_description: '',
      detailed_description: '',
      features: [],
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Cloud Architecture'],
      link: 'https://',
      status: 'Live & Active',
      is_featured: false,
      is_published: true,
      sort_order: projects.length + 1,
    });
    setTechInput('');
    setFeatureInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: WebProject) => {
    setEditingProject({ ...project });
    setTechInput('');
    setFeatureInput('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteWebProject(id);
      await loadProjects();
    }
  };

  const handleTogglePublish = async (project: WebProject) => {
    await saveWebProject({
      ...project,
      is_published: !project.is_published,
    });
    await loadProjects();
  };

  const handleAddTech = () => {
    if (!techInput.trim() || !editingProject) return;
    const current = editingProject.technologies || [];
    if (!current.includes(techInput.trim())) {
      setEditingProject({ ...editingProject, technologies: [...current, techInput.trim()] });
    }
    setTechInput('');
  };

  const handleRemoveTech = (tech: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      technologies: (editingProject.technologies || []).filter((t) => t !== tech),
    });
  };

  const handleAddFeature = () => {
    if (!featureInput.trim() || !editingProject) return;
    const current = editingProject.features || [];
    setEditingProject({ ...editingProject, features: [...current, featureInput.trim()] });
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      features: (editingProject.features || []).filter((_, i) => i !== idx),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title?.trim()) {
      alert('Project title is required.');
      return;
    }

    setSaving(true);
    await saveWebProject(editingProject);
    setSaving(false);
    setIsModalOpen(false);
    setEditingProject(null);
    await loadProjects();
  };

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout
      title="Web Projects Management"
      subtitle="Add, edit, publish, or remove client websites and case studies from the Luminosoft portfolio."
      actions={
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Project</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search portfolio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Filter:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter project categories"
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              {INITIAL_PROJECT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects List Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Project &amp; Cover</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Live Link</th>
                  <th className="py-3.5 px-4 font-semibold">Technologies</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Project & Cover */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-12 h-8 object-cover rounded-md border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{project.title}</span>
                            {project.is_featured && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            /{project.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium">
                        {project.category}
                      </span>
                    </td>

                    {/* Live Link */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {project.link && project.link !== '#' ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span className="truncate max-w-[140px]">{project.link}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Internal</span>
                      )}
                    </td>

                    {/* Technologies */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {project.technologies.slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px]">
                            {t}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Publish Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(project)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                          project.is_published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {project.is_published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* CREATE / EDIT PROJECT MODAL */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-modal w-full max-w-2xl max-h-[90vh] flex flex-col my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingProject.id ? 'Edit Web Project' : 'Add New Web Project'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the project details. Changes reflect on the public website automatically.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Khan Electrics"
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. khan-electrics"
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProject.category || 'Business Websites'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Business Websites">Business Websites</option>
                    <option value="E-Commerce Stores">E-Commerce Stores</option>
                    <option value="Hotel & Hospitality">Hotel &amp; Hospitality</option>
                    <option value="Portfolio & Personal">Portfolio &amp; Personal</option>
                    <option value="Custom Software & Portals">Custom Software &amp; Portals</option>
                    <option value="CRM Solutions">CRM Solutions</option>
                  </select>
                </div>

                {/* Live Link */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Live Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://khaneletrics.in"
                    value={editingProject.link || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                {/* Cover Image URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cover / Screenshot Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/... or /images/..."
                    value={editingProject.image || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Logo URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="/images/khan-electrics-logo.png"
                    value={editingProject.logo_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, logo_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingProject.status || 'Live & Active'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Live & Active">Live &amp; Active</option>
                    <option value="Completed">Completed</option>
                    <option value="In Development">In Development</option>
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of the project visible on portfolio cards..."
                  value={editingProject.short_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Case Study Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Detailed breakdown of challenges, architecture, and results for the individual project details page..."
                  value={editingProject.detailed_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, detailed_description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              {/* Technologies Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technologies Used
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Next.js, PostgreSQL"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-800"
                  >
                    Add Tech
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(editingProject.technologies || []).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium flex items-center gap-1"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="hover:text-rose-600 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Features List */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Features / Deliverables
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Instant WhatsApp inquiry booking integration"
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
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-800"
                  >
                    Add Feature
                  </button>
                </div>
                <div className="space-y-1">
                  {(editingProject.features || []).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs text-slate-700"
                    >
                      <span>• {feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-400 hover:text-rose-600 px-1 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkboxes: Featured & Published */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProject.is_featured || false}
                    onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Mark as Featured Project</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published !== false}
                    onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Publish to Public Website</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Project</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

