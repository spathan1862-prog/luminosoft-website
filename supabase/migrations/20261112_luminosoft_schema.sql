-- ==============================================================================
-- LUMINOSOFT OFFICIAL DATABASE SCHEMA & MIGRATIONS
-- Database: Supabase PostgreSQL
-- Features: 10 Core Tables, RLS Policies, Storage Buckets, Triggers, Seed Data
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. ADMIN CHECK FUNCTION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    EXISTS (
      SELECT 1 
      FROM public.admin_profiles 
      WHERE id = auth.uid() OR LOWER(email) = LOWER(COALESCE(auth.jwt() ->> 'email', ''))
    )
    OR
    LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'spathan1862@gmail.com'
    OR
    LOWER(COALESCE(auth.jwt() ->> 'email', '')) = 'contact@luminosoft.in'
  );
$$;

-- ==============================================================================
-- TABLE 1: company_settings
-- Stores official branding, contact info, social links, and footer text
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.company_settings (
  id TEXT PRIMARY KEY DEFAULT 'luminosoft',
  company_name TEXT NOT NULL DEFAULT 'Luminosoft',
  tagline TEXT NOT NULL DEFAULT 'Building Digital Solutions for a Smarter Future.',
  logo_url TEXT DEFAULT '/images/luminosoft-logo.svg',
  email TEXT NOT NULL DEFAULT 'contact@luminosoft.in',
  phone TEXT NOT NULL DEFAULT '+91 7822886909',
  whatsapp TEXT NOT NULL DEFAULT '+91 7822886909',
  website_url TEXT NOT NULL DEFAULT 'https://luminosoft.in',
  business_address TEXT NOT NULL DEFAULT 'Maharashtra, India',
  social_links JSONB NOT NULL DEFAULT '{"github": "https://github.com/spathan1862-prog", "linkedin": "#", "twitter": "#", "instagram": "#"}'::jsonb,
  footer_content TEXT NOT NULL DEFAULT 'Luminosoft delivers professional website development, custom software, mobile applications and CRM solutions to help businesses grow digitally.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

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

DROP TRIGGER IF EXISTS trigger_company_settings_updated_at ON public.company_settings;
CREATE TRIGGER trigger_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed initial company_settings
INSERT INTO public.company_settings (
  id, company_name, tagline, email, phone, whatsapp, website_url, business_address, footer_content
) VALUES (
  'luminosoft',
  'Luminosoft',
  'Building Digital Solutions for a Smarter Future.',
  'contact@luminosoft.in',
  '+91 7822886909',
  '+91 7822886909',
  'https://luminosoft.in',
  'Maharashtra, India',
  'Luminosoft delivers professional website development, custom software, mobile applications and CRM solutions to help businesses grow digitally.'
) ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- TABLE 2: project_categories
-- Categories for web development portfolio projects
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.project_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;

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

INSERT INTO public.project_categories (id, name, sort_order) VALUES
  ('all', 'All Projects', 0),
  ('business-website', 'Business Websites', 1),
  ('ecommerce', 'E-Commerce Stores', 2),
  ('hotel-website', 'Hotel & Hospitality', 3),
  ('portfolio', 'Portfolios & Personal', 4),
  ('custom-software', 'Custom Web Platforms', 5),
  ('crm', 'CRM & Portals', 6)
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- TABLE 3: web_projects
-- Web development projects and case studies
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.web_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  logo_url TEXT,
  image TEXT NOT NULL,
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  short_description TEXT,
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

CREATE INDEX IF NOT EXISTS idx_web_projects_published ON public.web_projects(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_web_projects_slug ON public.web_projects(slug);

ALTER TABLE public.web_projects ENABLE ROW LEVEL SECURITY;

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

DROP TRIGGER IF EXISTS trigger_web_projects_updated_at ON public.web_projects;
CREATE TRIGGER trigger_web_projects_updated_at
  BEFORE UPDATE ON public.web_projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed Khan Electrics Project
INSERT INTO public.web_projects (
  slug, title, category, logo_url, image, screenshots, short_description, detailed_description, features, technologies, link, status, is_featured, is_published, sort_order
) VALUES (
  'khan-electrics',
  'Khan Electrics',
  'Business Websites',
  '/images/khan-electrics-logo.png',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  '["https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Official multi-service portal for Khan Electrics featuring service booking, product catalogs, and administrative management.',
  'A high-performance business website developed for Khan Electrics, delivering professional online booking for residential and commercial electrical services, custom project galleries, responsive inquiry workflows, and a custom administrative content manager.',
  '["Real-time service inquiry and booking form", "Comprehensive electrical service showcase", "Admin CMS with image and catalog uploads", "PostgreSQL database integration via Supabase", "Fast mobile-first responsive layout with 95+ Core Web Vitals", "Instant WhatsApp direct contact action"]'::jsonb,
  '["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"]'::jsonb,
  'https://khaneletrics.in',
  'Live & Active',
  true,
  true,
  1
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  link = EXCLUDED.link,
  logo_url = EXCLUDED.logo_url,
  short_description = EXCLUDED.short_description,
  detailed_description = EXCLUDED.detailed_description,
  features = EXCLUDED.features,
  technologies = EXCLUDED.technologies,
  is_featured = EXCLUDED.is_featured,
  is_published = EXCLUDED.is_published;


-- ==============================================================================
-- TABLE 4: application_categories
-- Categories for the Application Marketplace
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.application_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.application_categories ENABLE ROW LEVEL SECURITY;

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

INSERT INTO public.application_categories (id, name, sort_order) VALUES
  ('all', 'All Applications', 0),
  ('business-software', 'Business Software', 1),
  ('hotel-management', 'Hotel Management', 2),
  ('medical-management', 'Medical Management', 3),
  ('productivity', 'Productivity', 4),
  ('games', 'Games', 5),
  ('other', 'Other Applications', 6)
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- TABLE 5: applications
-- Software products, desktop apps, mobile apps, and games
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
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

CREATE INDEX IF NOT EXISTS idx_applications_published ON public.applications(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_applications_slug ON public.applications(slug);
CREATE INDEX IF NOT EXISTS idx_applications_category ON public.applications(category);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

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

DROP TRIGGER IF EXISTS trigger_applications_updated_at ON public.applications;
CREATE TRIGGER trigger_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed initial applications: Hotel Management, MedicoManager, Bubble Shooter, Color Block Puzzle
INSERT INTO public.applications (
  slug, name, category, icon, short_description, full_description, features, screenshots, supported_platforms, system_requirements, app_size, version, release_date, is_featured, is_published, sort_order
) VALUES 
(
  'hotel-management',
  'Luminosoft Hotel Management',
  'Hotel Management',
  '/images/hotel-management-icon.ico',
  'Complete hotel and resort property management system for room bookings, guest check-in/out, billing, and staff operations.',
  'Luminosoft Hotel Management is a comprehensive desktop and mobile solution designed for boutique hotels, resorts, guest houses, and lodges. It streamlines front-desk operations, room allocation, reservation tracking, invoice generation, and revenue analytics.',
  '["Rapid Guest Check-in & Check-out flow", "Interactive visual room availability grid", "Automated GST/tax invoice & receipt printing", "Offline-first capability with cloud synchronization", "Multi-user staff role permissions and shift logs", "Daily occupancy and financial reporting dashboard"]'::jsonb,
  '["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  '["windows", "android"]'::jsonb,
  'Windows 10/11 (64-bit), 4GB RAM, 200MB Free Storage / Android 8.0+',
  '74 MB (Windows) / 10.2 MB (Android)',
  '1.2.0',
  '2026-11-10',
  true,
  true,
  1
),
(
  'medico-manager',
  'MedicoManager',
  'Medical Management',
  'Stethoscope',
  'Comprehensive clinic and medical practice management software with patient records, prescriptions, and pharmacy billing.',
  'MedicoManager provides doctors, clinics, and medical pharmacies with an intuitive management suite. Handle patient history, digital prescription generation, appointment queues, inventory tracking for pharmaceuticals, and diagnostic report storage.',
  '["Electronic Health Records (EHR) & patient history", "Fast digital prescription writer with drug database", "Pharmacy medicine billing & batch stock alerts", "Appointment scheduling and queue display", "Encrypted local data storage ensuring patient privacy", "Export reports to PDF and thermal print support"]'::jsonb,
  '["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  '["windows"]'::jsonb,
  'Windows 10 or 11 (64-bit), 4GB RAM, 500MB Free Storage Space',
  '81.3 MB',
  '2.0.0',
  '2026-06-27',
  true,
  true,
  2
),
(
  'bubble-shooter',
  'Bubble Shooter',
  'Games',
  '/images/bubble-shooter-icon.png',
  'Addictive arcade bubble shooter game with vibrant physics, hundreds of challenging levels, and power-up boosters.',
  'Bubble Shooter is a fun and engaging casual puzzle arcade game developed by Luminosoft. Match 3 or more colored bubbles to burst them, clear the board, unlock special power-ups, and compete for high scores with smooth 60fps performance.',
  '["Hundreds of exciting puzzle levels with increasing difficulty", "Smooth physics-based bubble launcher mechanism", "Dynamic booster effects (Bomb, Rainbow Bubble, Fireball)", "Lightweight and fully optimized for budget Android devices", "Completely playable offline with zero internet required", "Rich sound effects and clean arcade visual design"]'::jsonb,
  '["https://images.unsplash.com/photo-1612287233207-6a16d820ca6e?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  '["android"]'::jsonb,
  'Android 7.0 (Nougat) or higher, 2GB RAM',
  '12.8 MB',
  '1.0.0',
  '2026-10-29',
  true,
  true,
  3
),
(
  'color-block-puzzle',
  'Color Block Puzzle',
  'Games',
  'Grid3x3',
  'Relaxing brain puzzle game where you strategically place colorful blocks to clear rows and columns on the grid.',
  'Color Block Puzzle challenges your spatial awareness and logic. Drag and place vibrant blocks into the 8x8 or 10x10 board. Form complete horizontal or vertical lines to blast blocks away, achieve combos, and keep your board clean.',
  '["Intuitive drag-and-drop geometric block mechanics", "Clean minimal interface with soothing color schemes", "No time limits — play at your own relaxing pace", "Combos and streak bonuses for multi-line clears", "Ultra-lightweight footprint with instant launch speed", "Works 100% offline without battery drain"]'::jsonb,
  '["https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  '["android"]'::jsonb,
  'Android 7.0 or higher, 2GB RAM',
  '9.3 MB',
  '1.0.0',
  '2026-10-29',
  false,
  true,
  4
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  features = EXCLUDED.features,
  supported_platforms = EXCLUDED.supported_platforms,
  system_requirements = EXCLUDED.system_requirements,
  app_size = EXCLUDED.app_size,
  version = EXCLUDED.version,
  release_date = EXCLUDED.release_date,
  is_featured = EXCLUDED.is_featured,
  is_published = EXCLUDED.is_published;


-- ==============================================================================
-- TABLE 6: application_downloads
-- Download links per platform for each application
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.application_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'windows_exe', 'windows_installer', 'android_apk', 'macos', 'ios'
  platform_name TEXT NOT NULL,
  download_url TEXT NOT NULL,
  file_size TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.application_downloads ENABLE ROW LEVEL SECURITY;

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

-- Seed download URLs for Hotel Management, MedicoManager, Bubble Shooter, Block Puzzle
INSERT INTO public.application_downloads (application_id, platform, platform_name, download_url, file_size, is_active)
SELECT id, 'windows_exe', 'Windows Installer (Setup.exe)', 'https://github.com/spathan1862-prog/khan-apps/releases/latest/download/Hotel-Management-by-Luminosoft-Setup.exe', '77.6 MB', true
FROM public.applications WHERE slug = 'hotel-management'
ON CONFLICT DO NOTHING;

INSERT INTO public.application_downloads (application_id, platform, platform_name, download_url, file_size, is_active)
SELECT id, 'android_apk', 'Android APK (Direct Download)', 'https://vrcpceurhinjzgiseuow.supabase.co/storage/v1/object/public/apps/releases/1793609770051_app-debug.apk', '10.2 MB', true
FROM public.applications WHERE slug = 'hotel-management'
ON CONFLICT DO NOTHING;

INSERT INTO public.application_downloads (application_id, platform, platform_name, download_url, file_size, is_active)
SELECT id, 'windows_exe', 'Windows Setup Installer', '#', '81.3 MB', true
FROM public.applications WHERE slug = 'medico-manager'
ON CONFLICT DO NOTHING;

INSERT INTO public.application_downloads (application_id, platform, platform_name, download_url, file_size, is_active)
SELECT id, 'android_apk', 'Android APK Package', 'https://vrcpceurhinjzgiseuow.supabase.co/storage/v1/object/public/apps/releases/1793259854116_app-debug.apk', '12.8 MB', true
FROM public.applications WHERE slug = 'bubble-shooter'
ON CONFLICT DO NOTHING;

INSERT INTO public.application_downloads (application_id, platform, platform_name, download_url, file_size, is_active)
SELECT id, 'android_apk', 'Android APK Package', 'https://vrcpceurhinjzgiseuow.supabase.co/storage/v1/object/public/apps/releases/1793259919178_app-debug.apk', '9.3 MB', true
FROM public.applications WHERE slug = 'color-block-puzzle'
ON CONFLICT DO NOTHING;


-- ==============================================================================
-- TABLE 7: application_updates
-- Version history, release notes, changelog
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.application_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  release_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT,
  whats_new TEXT,
  bug_fixes JSONB NOT NULL DEFAULT '[]'::jsonb,
  new_features JSONB NOT NULL DEFAULT '[]'::jsonb,
  download_url TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_app_updates_app_id ON public.application_updates(application_id, release_date DESC);

ALTER TABLE public.application_updates ENABLE ROW LEVEL SECURITY;

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

-- Seed initial update records
INSERT INTO public.application_updates (application_id, version, release_date, title, whats_new, bug_fixes, new_features, platform)
SELECT id, '1.2.0', '2026-11-10', 'Performance & Multi-device Update', 'Enhanced billing reports and added quick room occupancy view.', '["Fixed thermal printer page cut margin issue", "Resolved occasional room lock status sync delay"]'::jsonb, '["Added custom GST tax rate calculator", "Integrated automated daily PDF report export"]'::jsonb, 'windows'
FROM public.applications WHERE slug = 'hotel-management'
ON CONFLICT DO NOTHING;

INSERT INTO public.application_updates (application_id, version, release_date, title, whats_new, bug_fixes, new_features, platform)
SELECT id, '2.0.0', '2026-06-27', 'Major Architecture Upgrade', 'Upgraded to Electron 28 with encrypted SQLCipher database.', '["Fixed prescription template formatting on narrow receipts", "Optimized drug search index query speed"]'::jsonb, '["New patient vitals timeline graph", "Batch stock low-inventory alerts with sound notification"]'::jsonb, 'windows'
FROM public.applications WHERE slug = 'medico-manager'
ON CONFLICT DO NOTHING;


-- ==============================================================================
-- TABLE 8: website_enquiries
-- Website development client inquiry management system
-- ==============================================================================
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

CREATE INDEX IF NOT EXISTS idx_website_enquiries_status ON public.website_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_website_enquiries_created_at ON public.website_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_enquiries_read ON public.website_enquiries(is_read);

ALTER TABLE public.website_enquiries ENABLE ROW LEVEL SECURITY;

-- Public can submit enquiries
DROP POLICY IF EXISTS "Public can submit website enquiries" ON public.website_enquiries;
CREATE POLICY "Public can submit website enquiries"
  ON public.website_enquiries FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authorized admins can view, update, delete enquiries
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

DROP TRIGGER IF EXISTS trigger_website_enquiries_updated_at ON public.website_enquiries;
CREATE TRIGGER trigger_website_enquiries_updated_at
  BEFORE UPDATE ON public.website_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==============================================================================
-- TABLE 9: contact_messages
-- General contact messages from Contact Us page
-- ==============================================================================
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

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

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


-- ==============================================================================
-- TABLE 10: admin_profiles
-- Admin authorizations linked to Supabase Auth
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT 'Administrator',
  role TEXT NOT NULL DEFAULT 'admin',
  is_super_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

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

-- Auto-register admin profile trigger when owner user signs up or is invited
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  IF LOWER(NEW.email) IN ('spathan1862@gmail.com', 'contact@luminosoft.in') THEN
    INSERT INTO public.admin_profiles (id, email, full_name, role, is_super_admin)
    VALUES (NEW.id, LOWER(NEW.email), 'Samir Pathan', 'super_admin', true)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      role = 'super_admin',
      is_super_admin = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_on_auth_user_created ON auth.users;
CREATE TRIGGER trigger_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();


-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION
-- Buckets: application-icons, application-screenshots, application-files, project-images, company-assets
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('application-icons', 'application-icons', true, 5242880), -- 5MB
  ('application-screenshots', 'application-screenshots', true, 10485760), -- 10MB
  ('application-files', 'application-files', true, 104857600), -- 100MB
  ('project-images', 'project-images', true, 10485760), -- 10MB
  ('company-assets', 'company-assets', true, 5242880) -- 5MB
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public Storage Read Access
DROP POLICY IF EXISTS "Public can view application icons" ON storage.objects;
CREATE POLICY "Public can view application icons" ON storage.objects FOR SELECT
USING (bucket_id IN ('application-icons', 'application-screenshots', 'application-files', 'project-images', 'company-assets', 'apps'));

-- Admin Storage Upload & Manage Access
DROP POLICY IF EXISTS "Admins can manage storage assets" ON storage.objects;
CREATE POLICY "Admins can manage storage assets" ON storage.objects FOR ALL
TO authenticated
USING (public.is_admin() OR auth.role() = 'authenticated')
WITH CHECK (public.is_admin() OR auth.role() = 'authenticated');


-- ==============================================================================
-- TABLE 11: youtube_tutorials
-- Official video tutorials for apps, installation walkthroughs, and guides
-- ==============================================================================
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

ALTER TABLE public.youtube_tutorials ENABLE ROW LEVEL SECURITY;

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

DROP TRIGGER IF EXISTS trigger_youtube_tutorials_updated_at ON public.youtube_tutorials;
CREATE TRIGGER trigger_youtube_tutorials_updated_at
  BEFORE UPDATE ON public.youtube_tutorials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed initial tutorials
INSERT INTO public.youtube_tutorials (
  id, title, description, video_url, youtube_id, thumbnail_url, related_application_name, duration, is_featured, sort_order
) VALUES 
(
  'tut-hotel-install',
  'How to Install & Set Up Luminosoft Hotel Management on Windows',
  'A complete step-by-step walkthrough on downloading the Windows Setup installer, configuring room categories, and generating your first guest invoice.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'Luminosoft Hotel Management',
  '8:45',
  true,
  1
),
(
  'tut-android-apk',
  'How to Download and Install Android APK Applications Safely',
  'Learn how to enable unknown sources permissions on your Android smartphone and install Luminosoft APKs without errors.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
  'Bubble Shooter / General APK',
  '5:20',
  true,
  2
)
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- TABLE 12: download_events
-- Non-blocking download initiation analytics tracking
-- ==============================================================================
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

ALTER TABLE public.download_events ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX IF NOT EXISTS idx_download_events_app_id ON public.download_events(application_id);
CREATE INDEX IF NOT EXISTS idx_download_events_date ON public.download_events(download_date);
CREATE INDEX IF NOT EXISTS idx_download_events_created_at ON public.download_events(created_at);

-- RPC function to increment download_count safely
CREATE OR REPLACE FUNCTION public.increment_download_count(app_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.applications
  SET download_count = download_count + 1
  WHERE id = app_id;
END;
$$;

