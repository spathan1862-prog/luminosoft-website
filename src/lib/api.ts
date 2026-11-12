import { supabase } from './supabase';
import { 
  WebProject, 
  Application, 
  ApplicationCategory,
  WebsiteEnquiry, 
  CompanySettings, 
  ApplicationUpdate,
  YouTubeTutorial,
  DownloadEvent,
  EnquiryStatus 
} from '../types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_APPLICATIONS, 
  INITIAL_APP_CATEGORIES,
  INITIAL_COMPANY_SETTINGS,
  INITIAL_YOUTUBE_TUTORIALS 
} from './initialData';

// Local storage keys for resilient fallback
const LS_PROJECTS_KEY = 'luminosoft_projects_override';
const LS_APPS_KEY = 'luminosoft_apps_override';
const LS_APP_CATS_KEY = 'luminosoft_app_categories_override';
const LS_ENQUIRIES_KEY = 'luminosoft_enquiries_override';
const LS_SETTINGS_KEY = 'luminosoft_settings_override';
const LS_TUTORIALS_KEY = 'luminosoft_tutorials_override';
const LS_DOWNLOAD_EVENTS_KEY = 'luminosoft_download_events';

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage quota limits
  }
}

// ==============================================================================
// 1. WEB PROJECTS API
// ==============================================================================

export async function fetchWebProjects(): Promise<WebProject[]> {
  const localList = getLocal<WebProject[]>(LS_PROJECTS_KEY, INITIAL_PROJECTS);

  if (!supabase) return localList;

  try {
    const { data, error } = await supabase
      .from('web_projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return localList;
    }

    const mapped: WebProject[] = data.map((item: any) => ({
      id: item.id,
      slug: item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : item.id),
      title: item.title,
      category: item.category || 'Business Websites',
      logo_url: item.logo_url || (item.slug === 'khan-electrics' ? '/images/khan-electrics-logo.png' : undefined),
      image: item.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      screenshots: Array.isArray(item.screenshots) ? item.screenshots : (Array.isArray(item.photos) ? item.photos : [item.image]),
      short_description: item.short_description || item.description || '',
      detailed_description: item.detailed_description || item.description || '',
      features: Array.isArray(item.features) ? item.features : [
        'Responsive mobile-first layout',
        'Custom admin content management',
        'Fast cloud hosting and database synchronization'
      ],
      technologies: Array.isArray(item.technologies) ? item.technologies : ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
      link: item.link || (item.slug === 'khan-electrics' ? 'https://khaneletrics.in' : '#'),
      github_url: item.github_url || undefined,
      completion_date: item.completion_date || item.created_at?.slice(0, 10),
      status: item.status || 'Live & Active',
      is_featured: Boolean(item.is_featured),
      is_published: item.is_published !== false,
      sort_order: item.sort_order || 0,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    if (!mapped.some(p => p.slug === 'khan-electrics')) {
      const khanElectrics = INITIAL_PROJECTS.find(p => p.slug === 'khan-electrics');
      if (khanElectrics) mapped.unshift(khanElectrics);
    }

    setLocal(LS_PROJECTS_KEY, mapped);
    return mapped;
  } catch (err) {
    console.warn('Failed to load projects from Supabase, using local fallback:', err);
    return localList;
  }
}

export async function fetchProjectBySlug(slug: string): Promise<WebProject | null> {
  const all = await fetchWebProjects();
  return all.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function saveWebProject(project: Partial<WebProject>): Promise<{ success: boolean; data?: WebProject; error?: string }> {
  const currentList = await fetchWebProjects();
  const slug = project.slug || (project.title ? project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `project-${Date.now()}`);

  const normalizedProject: WebProject = {
    id: project.id || crypto.randomUUID(),
    slug,
    title: project.title || 'Untitled Project',
    category: project.category || 'Business Websites',
    logo_url: project.logo_url,
    image: project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    screenshots: project.screenshots || [],
    short_description: project.short_description || '',
    detailed_description: project.detailed_description || '',
    features: project.features || [],
    technologies: project.technologies || [],
    link: project.link || '#',
    github_url: project.github_url,
    completion_date: project.completion_date,
    status: project.status || 'Live & Active',
    is_featured: Boolean(project.is_featured),
    is_published: project.is_published !== false,
    sort_order: project.sort_order ?? (currentList.length + 1),
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const payload: any = {
        title: normalizedProject.title,
        category: normalizedProject.category,
        image: normalizedProject.image,
        description: normalizedProject.short_description,
        short_description: normalizedProject.short_description,
        detailed_description: normalizedProject.detailed_description,
        link: normalizedProject.link,
        status: normalizedProject.status,
        is_featured: normalizedProject.is_featured,
        is_published: normalizedProject.is_published,
        sort_order: normalizedProject.sort_order,
        features: normalizedProject.features,
        technologies: normalizedProject.technologies,
        screenshots: normalizedProject.screenshots,
        slug: normalizedProject.slug,
        logo_url: normalizedProject.logo_url,
      };

      if (project.id && !project.id.startsWith('temp-')) {
        await supabase.from('web_projects').update(payload).eq('id', project.id);
      } else {
        await supabase.from('web_projects').insert([payload]);
      }
    } catch (e: any) {
      console.warn('Supabase project write error (keeping local):', e.message);
    }
  }

  const existingIdx = currentList.findIndex(p => p.id === normalizedProject.id || p.slug === normalizedProject.slug);
  let updatedList: WebProject[];
  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = normalizedProject;
  } else {
    updatedList = [normalizedProject, ...currentList];
  }
  setLocal(LS_PROJECTS_KEY, updatedList);

  return { success: true, data: normalizedProject };
}

export async function deleteWebProject(id: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      await supabase.from('web_projects').delete().eq('id', id);
    } catch (e: any) {
      console.warn('Supabase delete error:', e.message);
    }
  }

  const currentList = getLocal<WebProject[]>(LS_PROJECTS_KEY, INITIAL_PROJECTS);
  const filtered = currentList.filter(p => p.id !== id);
  setLocal(LS_PROJECTS_KEY, filtered);

  return { success: true };
}


// ==============================================================================
// 2. APPLICATIONS API
// ==============================================================================

export async function fetchApplications(): Promise<Application[]> {
  const localList = getLocal<Application[]>(LS_APPS_KEY, INITIAL_APPLICATIONS);

  if (!supabase) return localList;

  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, downloads:application_downloads(*), updates:application_updates(*)')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return localList;
    }

    const mapped: Application[] = data.map((item: any) => {
      const initialMatch = INITIAL_APPLICATIONS.find(
        a => a.id === item.id || a.slug === item.slug || a.name.toLowerCase() === item.name.toLowerCase()
      );

      const platforms = Array.isArray(item.supported_platforms) 
        ? item.supported_platforms 
        : (item.platform ? (item.platform === 'all' ? ['windows', 'android'] : [item.platform]) : ['windows']);

      return {
        id: item.id,
        slug: item.slug || (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : item.id),
        name: item.name,
        category: item.category || 'Business Software',
        icon: item.icon || initialMatch?.icon || 'Grid',
        logo_url: item.logo_url || initialMatch?.logo_url || item.icon || initialMatch?.icon,
        short_description: item.short_description || item.description || initialMatch?.short_description || '',
        full_description: item.full_description || initialMatch?.full_description || item.description || '',
        features: Array.isArray(item.features) && item.features.length > 0 
          ? item.features 
          : (initialMatch?.features || ['High-speed performance', 'Cross-platform stability', 'Regular updates & bug fixes']),
        screenshots: Array.isArray(item.screenshots) && item.screenshots.length > 0
          ? item.screenshots
          : (initialMatch?.screenshots || []),
        promotional_images: Array.isArray(item.promotional_images) ? item.promotional_images : [],
        supported_platforms: platforms,
        system_requirements: item.system_requirements || initialMatch?.system_requirements || 'Windows 10/11 or Android 8.0+',
        app_size: item.app_size || (item.file_size_bytes ? `${(item.file_size_bytes / (1024*1024)).toFixed(1)} MB` : initialMatch?.app_size || '25 MB'),
        version: item.version || initialMatch?.version || '1.0.0',
        release_date: item.release_date || item.created_at?.slice(0, 10) || '2026-10-29',
        download_count: item.download_count || initialMatch?.download_count || 0,
        is_featured: Boolean(item.is_featured),
        is_published: item.is_published !== false,
        sort_order: item.sort_order || 0,
        downloads: Array.isArray(item.downloads) && item.downloads.length > 0
          ? item.downloads
          : (item.download_url ? [{
              id: `dl-${item.id}`,
              application_id: item.id,
              platform: item.platform === 'android' ? 'android' : 'windows',
              platform_name: item.platform === 'android' ? 'Android APK' : 'Windows Setup (Installer)',
              download_url: item.download_url,
              direct_asset_url: item.download_url,
              is_github_release: String(item.download_url).includes('github.com'),
              file_size: item.file_size_bytes ? `${(item.file_size_bytes / (1024*1024)).toFixed(1)} MB` : undefined,
              is_active: true,
            }] : initialMatch?.downloads || []),
        updates: Array.isArray(item.updates) && item.updates.length > 0
          ? item.updates
          : (initialMatch?.updates || []),
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });

    INITIAL_APPLICATIONS.forEach(initApp => {
      if (!mapped.some(m => m.slug === initApp.slug || m.name.toLowerCase() === initApp.name.toLowerCase())) {
        mapped.push(initApp);
      }
    });

    setLocal(LS_APPS_KEY, mapped);
    return mapped;
  } catch (err) {
    console.warn('Failed to load applications from Supabase, using local fallback:', err);
    return localList;
  }
}

export async function fetchApplicationCategories(): Promise<ApplicationCategory[]> {
  const localCats = getLocal<ApplicationCategory[]>(LS_APP_CATS_KEY, INITIAL_APP_CATEGORIES);
  if (!supabase) return localCats;

  try {
    const { data, error } = await supabase
      .from('application_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      setLocal(LS_APP_CATS_KEY, data);
      return data;
    }
    return localCats;
  } catch (err) {
    console.warn('Failed to load application categories from Supabase, using local fallback:', err);
    return localCats;
  }
}

export async function fetchApplicationBySlug(slug: string): Promise<Application | null> {
  const all = await fetchApplications();
  return all.find(a => a.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function saveApplication(app: Partial<Application>): Promise<{ success: boolean; data?: Application; error?: string }> {
  const currentList = await fetchApplications();
  const slug = app.slug || (app.name ? app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `app-${Date.now()}`);

  const normalizedApp: Application = {
    id: app.id || crypto.randomUUID(),
    slug,
    name: app.name || 'Untitled Application',
    category: app.category || 'Business Software',
    icon: app.icon || 'Grid',
    logo_url: app.logo_url || app.icon,
    short_description: app.short_description || '',
    full_description: app.full_description || '',
    features: app.features || [],
    screenshots: app.screenshots || [],
    promotional_images: app.promotional_images || [],
    supported_platforms: app.supported_platforms || ['windows'],
    system_requirements: app.system_requirements || 'Windows 10/11 or Android 8+',
    app_size: app.app_size || '50 MB',
    version: app.version || '1.0.0',
    release_date: app.release_date || new Date().toISOString().slice(0, 10),
    download_count: app.download_count || 0,
    is_featured: Boolean(app.is_featured),
    is_published: app.is_published !== false,
    sort_order: app.sort_order ?? (currentList.length + 1),
    downloads: app.downloads || [],
    updates: app.updates || [],
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const payload: any = {
        name: normalizedApp.name,
        slug: normalizedApp.slug,
        category: normalizedApp.category,
        icon: normalizedApp.icon,
        logo_url: normalizedApp.logo_url,
        short_description: normalizedApp.short_description,
        full_description: normalizedApp.full_description,
        features: normalizedApp.features,
        screenshots: normalizedApp.screenshots,
        supported_platforms: normalizedApp.supported_platforms,
        system_requirements: normalizedApp.system_requirements,
        app_size: normalizedApp.app_size,
        version: normalizedApp.version,
        release_date: normalizedApp.release_date,
        is_featured: normalizedApp.is_featured,
        is_published: normalizedApp.is_published,
        sort_order: normalizedApp.sort_order,
      };

      if (app.id && !app.id.startsWith('temp-')) {
        await supabase.from('applications').update(payload).eq('id', app.id);
      } else {
        await supabase.from('applications').insert([payload]);
      }
    } catch (e: any) {
      console.warn('Supabase application write error (keeping local):', e.message);
    }
  }

  const existingIdx = currentList.findIndex(a => a.id === normalizedApp.id || a.slug === normalizedApp.slug);
  let updatedList: Application[];
  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = normalizedApp;
  } else {
    updatedList = [normalizedApp, ...currentList];
  }
  setLocal(LS_APPS_KEY, updatedList);

  return { success: true, data: normalizedApp };
}

export async function deleteApplication(id: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      await supabase.from('applications').delete().eq('id', id);
    } catch (e: any) {
      console.warn('Supabase app delete error:', e.message);
    }
  }

  const currentList = getLocal<Application[]>(LS_APPS_KEY, INITIAL_APPLICATIONS);
  const filtered = currentList.filter(a => a.id !== id);
  setLocal(LS_APPS_KEY, filtered);

  return { success: true };
}

export async function addApplicationUpdate(update: Omit<ApplicationUpdate, 'id'>): Promise<{ success: boolean; error?: string }> {
  const newUpdate: ApplicationUpdate = {
    ...update,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('application_updates').insert([newUpdate]);
    } catch (e: any) {
      console.warn('Supabase app update insert error:', e.message);
    }
  }

  const currentApps = getLocal<Application[]>(LS_APPS_KEY, INITIAL_APPLICATIONS);
  const targetApp = currentApps.find(a => a.id === update.application_id);
  if (targetApp) {
    targetApp.version = update.version;
    targetApp.release_date = update.release_date;
    targetApp.updates = [newUpdate, ...(targetApp.updates || [])];
    setLocal(LS_APPS_KEY, currentApps);
  }

  return { success: true };
}


// ==============================================================================
// 5. WEBSITE ENQUIRIES API (GET YOUR WEBSITE SECTION)
// ==============================================================================

export async function submitWebsiteEnquiry(enquiry: {
  customer_name: string;
  mobile_number: string;
  email: string;
  organization?: string;
  business_name?: string;
  website_type?: string;
  budget?: string;
  project_description?: string;
}): Promise<{ success: boolean; message: string; enquiryId?: string; error?: string }> {
  const enquiryId = `LS-${Date.now().toString().slice(-6)}`;
  const businessName = (enquiry.business_name || enquiry.organization || '').trim();
  const projectDesc = enquiry.project_description?.trim() || 'Website Development Inquiry';
  const websiteType = enquiry.website_type?.trim() || 'Business Website';
  const budgetVal = enquiry.budget?.trim() || 'Flexible';
  
  const newRecord: WebsiteEnquiry = {
    id: enquiryId,
    customer_name: enquiry.customer_name.trim(),
    name: enquiry.customer_name.trim(),
    mobile_number: enquiry.mobile_number.trim(),
    phone: enquiry.mobile_number.trim(),
    email: enquiry.email.trim(),
    organization: businessName,
    business_name: businessName,
    website_type: websiteType,
    budget: budgetVal,
    project_description: projectDesc,
    status: 'New',
    is_read: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let savedToSupabase = false;

  if (supabase) {
    try {
      const { error: err1 } = await supabase.from('website_enquiries').insert([{
        customer_name: newRecord.customer_name,
        phone: newRecord.mobile_number,
        email: newRecord.email,
        business_name: newRecord.business_name,
        website_type: newRecord.website_type,
        budget: newRecord.budget,
        project_description: newRecord.project_description,
        status: 'New',
        is_read: false,
      }]);

      if (!err1) {
        savedToSupabase = true;
      } else {
        console.warn('Supabase enquiry insert warning:', err1.message);
      }
    } catch (e: any) {
      console.warn('Supabase enquiry insertion error:', e.message);
    }
  }

  const existingEnquiries = getLocal<WebsiteEnquiry[]>(LS_ENQUIRIES_KEY, []);
  setLocal(LS_ENQUIRIES_KEY, [newRecord, ...existingEnquiries]);

  return {
    success: true,
    enquiryId,
    message: savedToSupabase 
      ? `Your enquiry (${enquiryId}) has been successfully submitted to our database! Our engineering team will contact you shortly.` 
      : `Your enquiry (${enquiryId}) has been recorded successfully. Our team will contact you shortly!`
  };
}

export async function fetchWebsiteEnquiries(): Promise<WebsiteEnquiry[]> {
  const localEnquiries = getLocal<WebsiteEnquiry[]>(LS_ENQUIRIES_KEY, []);

  if (!supabase) return localEnquiries;

  try {
    let { data, error } = await supabase
      .from('website_enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped: WebsiteEnquiry[] = data.map((item: any) => ({
        id: item.id,
        customer_name: item.customer_name || item.name || '',
        name: item.customer_name || item.name || '',
        mobile_number: item.phone || item.mobile_number || '',
        phone: item.phone || item.mobile_number || '',
        email: item.email || '',
        organization: item.business_name || item.organization || '',
        business_name: item.business_name || item.organization || '',
        website_type: item.website_type || 'Business Website',
        budget: item.budget || 'Flexible',
        project_description: item.project_description || item.details || '',
        status: (item.status as EnquiryStatus) || 'New',
        is_read: Boolean(item.is_read),
        internal_notes: item.internal_notes,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      localEnquiries.forEach(loc => {
        if (!mapped.some(m => m.id === loc.id || (m.email === loc.email && m.customer_name === loc.customer_name))) {
          mapped.unshift(loc);
        }
      });

      setLocal(LS_ENQUIRIES_KEY, mapped);
      return mapped;
    }

    return localEnquiries;
  } catch (err) {
    console.warn('Failed to fetch enquiries from Supabase:', err);
    return localEnquiries;
  }
}

export async function updateEnquiryStatus(
  id: string, 
  status: EnquiryStatus, 
  internal_notes?: string,
  is_read?: boolean
): Promise<{ success: boolean }> {
  if (supabase) {
    try {
      await supabase.from('website_enquiries').update({
        status,
        internal_notes,
        is_read: is_read !== undefined ? is_read : (status !== 'New'),
        updated_at: new Date().toISOString()
      }).eq('id', id);
    } catch {
      // ignore
    }
  }

  const enquiries = getLocal<WebsiteEnquiry[]>(LS_ENQUIRIES_KEY, []);
  const idx = enquiries.findIndex(e => e.id === id);
  if (idx >= 0) {
    enquiries[idx].status = status;
    if (internal_notes !== undefined) enquiries[idx].internal_notes = internal_notes;
    if (is_read !== undefined) enquiries[idx].is_read = is_read;
    enquiries[idx].updated_at = new Date().toISOString();
    setLocal(LS_ENQUIRIES_KEY, enquiries);
  }

  return { success: true };
}

export async function deleteWebsiteEnquiry(id: string): Promise<{ success: boolean }> {
  if (supabase) {
    try {
      await supabase.from('website_enquiries').delete().eq('id', id);
    } catch {
      // ignore
    }
  }

  const enquiries = getLocal<WebsiteEnquiry[]>(LS_ENQUIRIES_KEY, []);
  const filtered = enquiries.filter(e => e.id !== id);
  setLocal(LS_ENQUIRIES_KEY, filtered);

  return { success: true };
}


// ==============================================================================
// 6. COMPANY SETTINGS API
// ==============================================================================

export async function fetchCompanySettings(): Promise<CompanySettings> {
  const localSettings = getLocal<CompanySettings>(LS_SETTINGS_KEY, INITIAL_COMPANY_SETTINGS);

  if (!supabase) return localSettings;

  try {
    let { data, error } = await supabase.from('company_settings').select('*').limit(1).single();

    if (!error && data) {
      const merged: CompanySettings = {
        ...localSettings,
        ...data,
        logo_url: '/images/luminosoft-logo.png', // always preserve official logo
      };
      setLocal(LS_SETTINGS_KEY, merged);
      return merged;
    }

    return localSettings;
  } catch (err) {
    console.warn('Failed to load company settings:', err);
    return localSettings;
  }
}

export async function saveCompanySettings(settings: CompanySettings): Promise<{ success: boolean }> {
  setLocal(LS_SETTINGS_KEY, settings);

  if (supabase) {
    try {
      await supabase.from('company_settings').upsert({
        id: settings.id || 'luminosoft',
        company_name: settings.company_name,
        tagline: settings.tagline,
        logo_url: settings.logo_url,
        email: settings.email,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        website_url: settings.website_url,
        business_address: settings.business_address,
        social_links: settings.social_links,
        youtube_channel_url: settings.youtube_channel_url,
        youtube_channel_name: settings.youtube_channel_name,
        footer_content: settings.footer_content,
        updated_at: new Date().toISOString(),
      });
    } catch (e: any) {
      console.warn('Supabase company settings save error:', e.message);
    }
  }

  return { success: true };
}


// ==============================================================================
// 7. STORAGE FILE UPLOAD HELPER (WITH PROGRESS)
// ==============================================================================

export async function uploadAssetFileWithProgress(
  bucketName: 'application-icons' | 'application-screenshots' | 'application-files' | 'project-images' | 'company-assets' | 'youtube-assets' | 'apps',
  file: File,
  customPath?: string,
  onProgress?: (percent: number) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase client is not initialized.' };
  }

  // File size validation: 50MB check for storage bucket
  const maxBytes = 50 * 1024 * 1024; // 50MB
  if (file.size > maxBytes) {
    return {
      success: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds 50 MB limit. Please use Method B: GitHub Releases URL option for large installers.`,
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = customPath || `releases/${Date.now()}_${cleanFileName}`;

    if (onProgress) onProgress(30);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: true,
      });

    if (onProgress) onProgress(80);

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (onProgress) onProgress(100);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'File upload failed' };
  }
}

// ==============================================================================
// 8. YOUTUBE TUTORIALS API
// ==============================================================================

export async function fetchYouTubeTutorials(): Promise<YouTubeTutorial[]> {
  const localList = getLocal<YouTubeTutorial[]>(LS_TUTORIALS_KEY, INITIAL_YOUTUBE_TUTORIALS);

  if (!supabase) return localList;

  try {
    const { data, error } = await supabase
      .from('youtube_tutorials')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      const mapped: YouTubeTutorial[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        video_url: item.video_url,
        youtube_id: item.youtube_id || extractYouTubeId(item.video_url),
        thumbnail_url: item.thumbnail_url,
        related_application_id: item.related_application_id,
        related_application_name: item.related_application_name,
        duration: item.duration,
        is_featured: Boolean(item.is_featured),
        is_published: item.is_published !== false,
        sort_order: item.sort_order || 0,
        created_at: item.created_at,
      }));

      setLocal(LS_TUTORIALS_KEY, mapped);
      return mapped;
    }

    return localList;
  } catch (err) {
    console.warn('Failed to load tutorials from Supabase, using local fallback:', err);
    return localList;
  }
}

export function extractYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
}

export async function saveYouTubeTutorial(
  tutorial: Partial<YouTubeTutorial> & { title: string; video_url: string }
): Promise<{ success: boolean; data?: YouTubeTutorial; error?: string }> {
  const id = tutorial.id || `tut-${Date.now()}`;
  const ytId = tutorial.youtube_id || extractYouTubeId(tutorial.video_url);
  const thumb = tutorial.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '');

  const newTutorial: YouTubeTutorial = {
    id,
    title: tutorial.title,
    description: tutorial.description || '',
    video_url: tutorial.video_url,
    youtube_id: ytId,
    thumbnail_url: thumb,
    related_application_id: tutorial.related_application_id,
    related_application_name: tutorial.related_application_name,
    duration: tutorial.duration || '5:00',
    is_featured: Boolean(tutorial.is_featured),
    is_published: tutorial.is_published !== false,
    sort_order: tutorial.sort_order || 0,
    created_at: tutorial.created_at || new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('youtube_tutorials').upsert({
        id: newTutorial.id,
        title: newTutorial.title,
        description: newTutorial.description,
        video_url: newTutorial.video_url,
        youtube_id: newTutorial.youtube_id,
        thumbnail_url: newTutorial.thumbnail_url,
        related_application_id: newTutorial.related_application_id,
        related_application_name: newTutorial.related_application_name,
        duration: newTutorial.duration,
        is_featured: newTutorial.is_featured,
        is_published: newTutorial.is_published,
        sort_order: newTutorial.sort_order,
        updated_at: new Date().toISOString(),
      });
    } catch (e: any) {
      console.warn('Supabase tutorial upsert error:', e.message);
    }
  }

  const list = getLocal<YouTubeTutorial[]>(LS_TUTORIALS_KEY, INITIAL_YOUTUBE_TUTORIALS);
  const idx = list.findIndex(t => t.id === newTutorial.id);
  if (idx >= 0) {
    list[idx] = newTutorial;
  } else {
    list.push(newTutorial);
  }
  setLocal(LS_TUTORIALS_KEY, list);

  return { success: true, data: newTutorial };
}

export async function deleteYouTubeTutorial(id: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      await supabase.from('youtube_tutorials').delete().eq('id', id);
    } catch (e: any) {
      console.warn('Supabase tutorial delete error:', e.message);
    }
  }

  const list = getLocal<YouTubeTutorial[]>(LS_TUTORIALS_KEY, INITIAL_YOUTUBE_TUTORIALS);
  const filtered = list.filter(t => t.id !== id);
  setLocal(LS_TUTORIALS_KEY, filtered);

  return { success: true };
}

// ==============================================================================
// 9. DOWNLOAD EVENTS & ANALYTICS API
// ==============================================================================

export async function recordDownloadEvent(
  applicationId: string,
  applicationName: string,
  version: string,
  platform: string,
  downloadUrl?: string
): Promise<void> {
  const event: DownloadEvent = {
    id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    application_id: applicationId,
    application_name: applicationName,
    version: version || '1.0.0',
    platform: platform || 'general',
    download_url: downloadUrl,
    source: 'web_portal',
    download_date: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  };

  // Local storage caching
  const events = getLocal<DownloadEvent[]>(LS_DOWNLOAD_EVENTS_KEY, []);
  events.unshift(event);
  if (events.length > 500) events.pop();
  setLocal(LS_DOWNLOAD_EVENTS_KEY, events);

  // Non-blocking fire & forget to Supabase
  if (supabase) {
    (async () => {
      try {
        if (!supabase) return;
        await supabase.from('download_events').insert([{
          application_id: event.application_id,
          application_name: event.application_name,
          version: event.version,
          platform: event.platform,
          download_url: event.download_url,
          source: event.source,
          download_date: event.download_date,
        }]);

        try {
          await supabase.rpc('increment_download_count', { app_id: applicationId });
        } catch {
          // ignore RPC failure if not yet run in Supabase SQL editor
        }
      } catch (err: any) {
        console.warn('Download event logging error:', err?.message);
      }
    })();
  }
}

export async function fetchDownloadEvents(): Promise<DownloadEvent[]> {
  const localList = getLocal<DownloadEvent[]>(LS_DOWNLOAD_EVENTS_KEY, []);

  if (!supabase) return localList;

  try {
    const { data, error } = await supabase
      .from('download_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        application_id: d.application_id,
        application_name: d.application_name,
        version: d.version || '1.0.0',
        platform: d.platform,
        download_url: d.download_url,
        source: d.source || 'web_portal',
        download_date: d.download_date || d.created_at?.slice(0, 10),
        created_at: d.created_at,
      }));
    }

    return localList;
  } catch {
    return localList;
  }
}

export async function fetchDownloadAnalytics(
  timeRange: 'today' | '7d' | '30d' | 'all' = 'all'
): Promise<{
  totalDownloads: number;
  byApp: { name: string; count: number }[];
  byPlatform: { platform: string; count: number }[];
  recentEvents: DownloadEvent[];
}> {
  const events = await fetchDownloadEvents();

  const now = new Date();
  const filtered = events.filter((ev) => {
    if (timeRange === 'all') return true;
    const evDate = new Date(ev.created_at || ev.download_date);
    const diffMs = now.getTime() - evDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (timeRange === 'today') return diffDays <= 1;
    if (timeRange === '7d') return diffDays <= 7;
    if (timeRange === '30d') return diffDays <= 30;
    return true;
  });

  const appMap: Record<string, number> = {};
  const platMap: Record<string, number> = {};

  filtered.forEach((ev) => {
    const appName = ev.application_name || 'General App';
    appMap[appName] = (appMap[appName] || 0) + 1;

    const plat = (ev.platform || 'general').toLowerCase();
    platMap[plat] = (platMap[plat] || 0) + 1;
  });

  const byApp = Object.entries(appMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const byPlatform = Object.entries(platMap)
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalDownloads: filtered.length,
    byApp,
    byPlatform,
    recentEvents: filtered.slice(0, 20),
  };
}
