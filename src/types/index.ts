// ==============================================================================
// LUMINOSOFT CORE TYPE DEFINITIONS
// ==============================================================================

export type PlatformType = 'windows' | 'android' | 'macos' | 'ios' | 'web' | 'cross-platform' | 'all';

export interface CompanySettings {
  id: string;
  company_name: string;
  tagline: string;
  logo_url: string;
  email: string;
  phone: string;
  whatsapp: string;
  website_url: string;
  business_address: string;
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
  youtube_channel_url?: string;
  youtube_channel_name?: string;
  youtube_channel_logo?: string;
  footer_content: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  sort_order: number;
}

export interface WebProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  logo_url?: string;
  image: string;
  screenshots: string[];
  short_description: string;
  detailed_description?: string;
  features: string[];
  technologies: string[];
  link?: string;
  github_url?: string;
  completion_date?: string;
  status: string; // 'Live & Active', 'In Development', 'Completed'
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationCategory {
  id: string;
  name: string;
  sort_order: number;
}

export interface ApplicationDownload {
  id: string;
  application_id: string;
  platform: string; // 'android' | 'windows' | 'macos' | 'ios'
  platform_name: string; // e.g. "Windows Installer", "Android APK"
  download_url: string;
  direct_asset_url?: string; // Direct GitHub release asset URL or Supabase storage direct URL
  is_github_release?: boolean;
  github_repo?: string;
  file_name?: string;
  file_size?: string;
  file_size_bytes?: number;
  version?: string;
  is_active: boolean;
  created_at?: string;
}

export interface ApplicationUpdate {
  id: string;
  application_id: string;
  version: string;
  release_date: string;
  title?: string;
  whats_new?: string;
  bug_fixes: string[];
  new_features: string[];
  improvements?: string[];
  download_url?: string;
  platform?: string;
  created_at?: string;
}

export interface Application {
  id: string;
  slug: string;
  name: string;
  category: string;
  icon: string; // uploaded icon
  logo_url?: string; // uploaded official logo (optional - falls back to icon)
  short_description: string;
  full_description?: string;
  features: string[];
  screenshots: string[];
  promotional_images?: string[];
  supported_platforms: PlatformType[];
  system_requirements?: string;
  app_size?: string;
  version: string;
  release_date: string;
  download_count: number;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  downloads?: ApplicationDownload[];
  updates?: ApplicationUpdate[];
  created_at?: string;
  updated_at?: string;
}

export interface DownloadEvent {
  id: string;
  application_id: string;
  application_name: string;
  version: string;
  platform: string;
  download_url?: string;
  source: string;
  download_date: string;
  created_at?: string;
}

export interface YouTubeTutorial {
  id: string;
  title: string;
  description: string;
  video_url: string; // Full YouTube URL or embed
  youtube_id?: string;
  thumbnail_url?: string;
  related_application_id?: string;
  related_application_name?: string;
  duration?: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
}

export type EnquiryStatus = 
  | 'New' 
  | 'Contacted' 
  | 'In Discussion' 
  | 'Quotation Sent' 
  | 'Converted to Client' 
  | 'Rejected' 
  | 'Closed';

export type WebsiteType = 
  | 'Business Website' 
  | 'Hotel Website' 
  | 'E-commerce Website' 
  | 'Portfolio Website' 
  | 'Educational Website' 
  | 'Custom Website' 
  | 'Other';

export interface WebsiteEnquiry {
  id: string;
  customer_name: string;
  name?: string;
  mobile_number: string;
  phone?: string;
  email: string;
  organization?: string;
  business_name?: string;
  website_type?: WebsiteType | string;
  budget?: string;
  project_description?: string;
  details?: string;
  additional_message?: string;
  required_services?: string[];
  status: EnquiryStatus;
  is_read: boolean;
  internal_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'New' | 'Read' | 'Replied' | 'Archived';
  is_read: boolean;
  created_at?: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin';
  is_super_admin: boolean;
  created_at?: string;
}
