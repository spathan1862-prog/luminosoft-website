-- ==============================================================================
-- LUMINOSOFT DEDICATED DATABASE INITIALIZATION SCHEMA
-- Project Reference: pixvgshevennznzgdwro
-- Project URL: https://pixvgshevennznzgdwro.supabase.co
--
-- EXECUTION ORDER:
-- Phase 1: Extensions & Base Trigger Functions
-- Phase 2: Create All 12 Tables (Independent tables first, FKs second)
-- Phase 3: Create Table Indexes
-- Phase 4: Create Business Functions (is_admin, increment_download_count)
-- Phase 5: Create Timestamp Triggers
-- Phase 6: Enable Row Level Security (RLS) on all 12 Tables
-- Phase 7: Create RLS Policies for all 12 Tables
-- Phase 8: Storage Buckets & Storage Security Policies
-- Phase 9: Seed Clean Categories & Initial Brand Settings
-- ==============================================================================

-- ==============================================================================
-- PHASE 1: EXTENSIONS & BASE TRIGGER FUNCTIONS
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Generic updated_at timestamp handler
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ==============================================================================
-- PHASE 2: CREATE ALL 12 TABLES
-- ==============================================================================

-- 1. company_settings
CREATE TABLE IF NOT EXISTS public.company_settings (
  id TEXT PRIMARY KEY DEFAULT 'luminosoft',
  company_name TEXT NOT NULL DEFAULT 'Luminosoft',
  tagline TEXT NOT NULL DEFAULT 'Smart Software. Powerful Digital Solutions.',
  logo_url TEXT DEFAULT '/images/luminosoft-logo.png',
  email TEXT NOT NULL DEFAULT 'contact@luminosoft.in',
  phone TEXT NOT NULL DEFAULT '+91 7822886909',
  whatsapp TEXT NOT NULL DEFAULT '+91 7822886909',
  website_url TEXT NOT NULL DEFAULT 'https://luminosoft.in',
  business_address TEXT NOT NULL DEFAULT 'Badnapur, Jalna & Aurangabad, Maharashtra, India',
  social_links JSONB NOT NULL DEFAULT '{"github": "https://github.com/spathan1862-prog", "linkedin": "https://linkedin.com", "twitter": "https://x.com", "youtube": "https://youtube.com/@luminosoft"}'::jsonb,
  youtube_channel_url TEXT DEFAULT 'https://youtube.com/@luminosoft',
  youtube_channel_name TEXT DEFAULT 'Luminosoft Tutorials',
  youtube_channel_logo TEXT DEFAULT '/images/luminosoft-logo.png',
  footer_content TEXT NOT NULL DEFAULT 'Luminosoft delivers professional website development, custom software, mobile applications and CRM solutions that help businesses and individuals work smarter.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. project_categories
CREATE TABLE IF NOT EXISTS public.project_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. web_projects
CREATE TABLE IF NOT EXISTS public.web_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  logo_url TEXT,
  image TEXT NOT NULL,
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  short_description TEXT NOT NULL,
  detailed_description TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  link TEXT DEFAULT '#',
  github_url TEXT,
  completion_date DATE,
  status TEXT NOT NULL DEFAULT 'Live & Active',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. application_categories
CREATE TABLE IF NOT EXISTS public.application_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. applications
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  logo_url TEXT,
  short_description TEXT NOT NULL,
  full_description TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  promotional_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  supported_platforms JSONB NOT NULL DEFAULT '["windows"]'::jsonb,
  system_requirements TEXT,
  app_size TEXT,
  version TEXT NOT NULL DEFAULT '1.0.0',
  release_date DATE NOT NULL DEFAULT CURRENT_DATE,
  download_count INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. admin_profiles (References built-in auth.users)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT 'Administrator',
  role TEXT NOT NULL DEFAULT 'admin', -- 'super_admin' | 'admin'
  is_super_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. website_enquiries (Customer lead capture)
CREATE TABLE IF NOT EXISTS public.website_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_name TEXT,
  website_type TEXT NOT NULL,
  required_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  budget TEXT,
  project_description TEXT NOT NULL,
  additional_message TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Discussion', 'Quotation Sent', 'Converted to Client', 'Rejected', 'Closed')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. contact_messages (General contact page messages)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Replied', 'Archived')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. youtube_tutorials
CREATE TABLE IF NOT EXISTS public.youtube_tutorials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  youtube_id TEXT,
  thumbnail_url TEXT,
  related_application_id TEXT,
  related_application_name TEXT,
  duration TEXT DEFAULT '5:00',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. download_events
CREATE TABLE IF NOT EXISTS public.download_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id TEXT NOT NULL,
  application_name TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  platform TEXT NOT NULL,
  download_url TEXT,
  source TEXT DEFAULT 'web_portal',
  download_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. application_downloads (Foreign Key: applications.id)
CREATE TABLE IF NOT EXISTS public.application_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'windows', 'android', 'macos', 'ios'
  platform_name TEXT NOT NULL,
  download_url TEXT NOT NULL,
  direct_asset_url TEXT,
  is_github_release BOOLEAN DEFAULT false,
  github_repo TEXT,
  file_name TEXT,
  file_size TEXT,
  file_size_bytes BIGINT,
  version TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. application_updates (Foreign Key: applications.id)
CREATE TABLE IF NOT EXISTS public.application_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  release_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT,
  whats_new TEXT,
  bug_fixes JSONB NOT NULL DEFAULT '[]'::jsonb,
  new_features JSONB NOT NULL DEFAULT '[]'::jsonb,
  improvements JSONB NOT NULL DEFAULT '[]'::jsonb,
  download_url TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);


-- ==============================================================================
-- PHASE 3: TABLE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_web_projects_published ON public.web_projects(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_web_projects_slug ON public.web_projects(slug);

CREATE INDEX IF NOT EXISTS idx_applications_published ON public.applications(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_applications_slug ON public.applications(slug);
CREATE INDEX IF NOT EXISTS idx_applications_category ON public.applications(category);

CREATE INDEX IF NOT EXISTS idx_app_downloads_app_id ON public.application_downloads(application_id);
CREATE INDEX IF NOT EXISTS idx_app_updates_app_id ON public.application_updates(application_id, release_date DESC);

CREATE INDEX IF NOT EXISTS idx_website_enquiries_status ON public.website_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_website_enquiries_created_at ON public.website_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_enquiries_read ON public.website_enquiries(is_read);

CREATE INDEX IF NOT EXISTS idx_download_events_app_id ON public.download_events(application_id);
CREATE INDEX IF NOT EXISTS idx_download_events_date ON public.download_events(download_date);
CREATE INDEX IF NOT EXISTS idx_download_events_created_at ON public.download_events(created_at);


-- ==============================================================================
-- PHASE 4: BUSINESS FUNCTIONS (Safely defined now that tables exist)
-- ==============================================================================

-- Security function to verify confirmed admin privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_profiles ap
    WHERE ap.id = auth.uid()
      AND (ap.role = 'admin' OR ap.role = 'super_admin' OR ap.is_super_admin = true)
  );
END;
$$;

-- Atomic RPC function to increment application downloads safely
CREATE OR REPLACE FUNCTION public.increment_download_count(app_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.applications
  SET download_count = download_count + 1
  WHERE id::text = app_id;
END;
$$;


-- ==============================================================================
-- PHASE 5: TIMESTAMP TRIGGERS
-- ==============================================================================

DROP TRIGGER IF EXISTS trigger_company_settings_updated_at ON public.company_settings;
CREATE TRIGGER trigger_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_web_projects_updated_at ON public.web_projects;
CREATE TRIGGER trigger_web_projects_updated_at
  BEFORE UPDATE ON public.web_projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_applications_updated_at ON public.applications;
CREATE TRIGGER trigger_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_website_enquiries_updated_at ON public.website_enquiries;
CREATE TRIGGER trigger_website_enquiries_updated_at
  BEFORE UPDATE ON public.website_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER trigger_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_youtube_tutorials_updated_at ON public.youtube_tutorials;
CREATE TRIGGER trigger_youtube_tutorials_updated_at
  BEFORE UPDATE ON public.youtube_tutorials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==============================================================================
-- PHASE 6: ENABLE ROW LEVEL SECURITY (RLS) ON ALL 12 TABLES
-- ==============================================================================

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_updates ENABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- PHASE 7: RLS POLICIES FOR ALL 12 TABLES
-- ==============================================================================

-- 1. company_settings
DROP POLICY IF EXISTS "Public can view company settings" ON public.company_settings;
CREATE POLICY "Public can view company settings"
  ON public.company_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can update company settings" ON public.company_settings;
CREATE POLICY "Admins can update company settings"
  ON public.company_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2. project_categories
DROP POLICY IF EXISTS "Public can view project categories" ON public.project_categories;
CREATE POLICY "Public can view project categories"
  ON public.project_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage project categories" ON public.project_categories;
CREATE POLICY "Admins can manage project categories"
  ON public.project_categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. web_projects
DROP POLICY IF EXISTS "Public can view published web projects" ON public.web_projects;
CREATE POLICY "Public can view published web projects"
  ON public.web_projects FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage web projects" ON public.web_projects;
CREATE POLICY "Admins can manage web projects"
  ON public.web_projects FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. application_categories
DROP POLICY IF EXISTS "Public can view application categories" ON public.application_categories;
CREATE POLICY "Public can view application categories"
  ON public.application_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage application categories" ON public.application_categories;
CREATE POLICY "Admins can manage application categories"
  ON public.application_categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. applications
DROP POLICY IF EXISTS "Public can view published applications" ON public.applications;
CREATE POLICY "Public can view published applications"
  ON public.applications FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage applications" ON public.applications;
CREATE POLICY "Admins can manage applications"
  ON public.applications FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. admin_profiles
DROP POLICY IF EXISTS "Admins can view admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can view admin profiles"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (public.is_admin() OR auth.uid() = id);

DROP POLICY IF EXISTS "Super admins can manage admin profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can manage admin profiles"
  ON public.admin_profiles FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 7. website_enquiries
DROP POLICY IF EXISTS "Public can submit website enquiries" ON public.website_enquiries;
CREATE POLICY "Public can submit website enquiries"
  ON public.website_enquiries FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can view website enquiries" ON public.website_enquiries;
CREATE POLICY "Only admins can view website enquiries"
  ON public.website_enquiries FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update website enquiries" ON public.website_enquiries;
CREATE POLICY "Only admins can update website enquiries"
  ON public.website_enquiries FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete website enquiries" ON public.website_enquiries;
CREATE POLICY "Only admins can delete website enquiries"
  ON public.website_enquiries FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 8. contact_messages
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins can manage contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 9. youtube_tutorials
DROP POLICY IF EXISTS "Public can view published youtube tutorials" ON public.youtube_tutorials;
CREATE POLICY "Public can view published youtube tutorials"
  ON public.youtube_tutorials FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage youtube tutorials" ON public.youtube_tutorials;
CREATE POLICY "Admins can manage youtube tutorials"
  ON public.youtube_tutorials FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 10. download_events
DROP POLICY IF EXISTS "Public can record download events" ON public.download_events;
CREATE POLICY "Public can record download events"
  ON public.download_events FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view download events" ON public.download_events;
CREATE POLICY "Admins can view download events"
  ON public.download_events FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 11. application_downloads
DROP POLICY IF EXISTS "Public can view application downloads" ON public.application_downloads;
CREATE POLICY "Public can view application downloads"
  ON public.application_downloads FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage application downloads" ON public.application_downloads;
CREATE POLICY "Admins can manage application downloads"
  ON public.application_downloads FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 12. application_updates
DROP POLICY IF EXISTS "Public can view application updates" ON public.application_updates;
CREATE POLICY "Public can view application updates"
  ON public.application_updates FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage application updates" ON public.application_updates;
CREATE POLICY "Admins can manage application updates"
  ON public.application_updates FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ==============================================================================
-- PHASE 8: STORAGE BUCKETS & STORAGE SECURITY POLICIES
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('apps', 'apps', true, 104857600),                     -- 100MB (APK & EXE Installers)
  ('application-icons', 'application-icons', true, 5242880),       -- 5MB
  ('application-screenshots', 'application-screenshots', true, 10485760), -- 10MB
  ('application-files', 'application-files', true, 104857600),     -- 100MB
  ('project-images', 'project-images', true, 10485760),           -- 10MB
  ('company-assets', 'company-assets', true, 5242880),             -- 5MB
  ('youtube-assets', 'youtube-assets', true, 5242880)              -- 5MB
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public Read Access across all buckets
DROP POLICY IF EXISTS "Public can view storage assets" ON storage.objects;
CREATE POLICY "Public can view storage assets" ON storage.objects FOR SELECT
USING (bucket_id IN ('apps', 'application-icons', 'application-screenshots', 'application-files', 'project-images', 'company-assets', 'youtube-assets'));

-- Storage RLS: Authenticated Admin Upload & Management
DROP POLICY IF EXISTS "Admins can manage storage assets" ON storage.objects;
CREATE POLICY "Admins can manage storage assets" ON storage.objects FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ==============================================================================
-- PHASE 9: SEED CLEAN CATEGORIES & INITIAL BRAND SETTINGS
-- ==============================================================================

-- 1. Initial Company Settings
INSERT INTO public.company_settings (
  id, company_name, tagline, logo_url, email, phone, whatsapp, website_url, business_address, footer_content
) VALUES (
  'luminosoft',
  'Luminosoft',
  'Smart Software. Powerful Digital Solutions.',
  '/images/luminosoft-logo.png',
  'contact@luminosoft.in',
  '+91 7822886909',
  '+91 7822886909',
  'https://luminosoft.in',
  'Badnapur, Jalna & Aurangabad, Maharashtra, India',
  'Luminosoft delivers professional website development, custom software, mobile applications and CRM solutions that help businesses and individuals work smarter.'
) ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  tagline = EXCLUDED.tagline,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  website_url = EXCLUDED.website_url;

-- 2. Project Categories
INSERT INTO public.project_categories (id, name, sort_order) VALUES
  ('all', 'All Projects', 0),
  ('business-website', 'Business Websites', 1),
  ('ecommerce', 'E-Commerce Stores', 2),
  ('hotel-website', 'Hotel & Hospitality', 3),
  ('portfolio', 'Portfolios & Personal', 4),
  ('custom-software', 'Custom Web Platforms', 5),
  ('crm', 'CRM & Portals', 6)
ON CONFLICT (id) DO NOTHING;

-- 3. Application Categories
INSERT INTO public.application_categories (id, name, sort_order) VALUES
  ('all', 'All Applications', 0),
  ('business-software', 'Business Software', 1),
  ('hotel-management', 'Hotel Management', 2),
  ('medical-management', 'Medical Management', 3),
  ('productivity', 'Productivity', 4),
  ('games', 'Games', 5),
  ('other', 'Other Applications', 6)
ON CONFLICT (id) DO NOTHING;
