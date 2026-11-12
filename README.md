# Luminosoft – Official Company Website, Portfolio & Application Marketplace

Luminosoft is a production-ready, full-stack company platform engineered with **React 19**, **TypeScript**, **Tailwind CSS**, **Vite**, and **Supabase (PostgreSQL)**.

---

## 🌟 Key Features

1. **Professional Company Website**
   - White / Light primary theme with sleek navy and subtle blue accents.
   - Minimalist, premium UI without cluttered effects or excessive glassmorphism.
   - Smooth entrance reveals, CSS transitions, and high-performance scrolling.

2. **Dedicated Website Development Services**
   - Business Websites, E-commerce Stores, Hotel Websites, Portfolios, Custom Software, Mobile Apps, and CRM Solutions.
   - Interactive feature checklists, technical deliverables, and direct inquiry CTAs.

3. **Dynamic Web Development Portfolio**
   - Dedicated showcase section: **Our Web Development Projects**.
   - **Featured Live Project:** [Khan Electrics](https://khaneletrics.in).
   - Dynamic individual project details pages (`/projects/:slug`).
   - Managed entirely through the Admin Dashboard and synchronized with Supabase.

4. **Application Marketplace**
   - Verified software products and games store (`/apps`).
   - Initial applications:
     - **Luminosoft Hotel Management** (Windows Setup & Android APK)
     - **MedicoManager** (Windows Desktop Setup 2.0.0.exe)
     - **Bubble Shooter** (Android APK)
     - **Color Block Puzzle** (Android APK)
   - Category filtering, real-time search, sorting options, and direct downloads.

5. **Individual Application Details Pages**
   - Dynamic URLs (`/apps/:slug`).
   - Detailed specifications, system requirements, screenshots gallery, and platform badges.
   - **Download Section:** Valid platform installers (EXE, APK, Setup).
   - **Updates & Version History:** Version changelog, bug fixes, and new features.

6. **Website Development Enquiry System (Critical Lead Capture)**
   - Complete 9-field client inquiry form with input validation and anti-spam honeypot.
   - Direct database logging to Supabase.
   - Instant celebration feedback upon successful submission.

7. **Secure Admin Dashboard**
   - URL: `/admin/login` -> `/admin/dashboard`
   - Overview metrics: Total Apps, Published, Drafts, Projects, Enquiries, Total Downloads.
   - **Project Management:** Add, edit, delete, publish/unpublish, upload screenshots, add URLs and tech tags.
   - **Application Management:** Add/edit apps, manage supported platforms, and publish new version updates with changelogs.
   - **Website Enquiry Management:** Filter by status/type, search leads, change inquiry stages, add internal notes, click-to-WhatsApp, click-to-call, and one-click **CSV export**.
   - **Company Information Management:** Update brand name, tagline, email, phone, WhatsApp number, office address, and footer content in real time.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` (already configured for Luminosoft):
```env
VITE_SUPABASE_URL=https://vrcpceurhinjzgiseuow.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_gOFWT4dmdrkBIaduTtklKw_5TzPOia1
VITE_APP_NAME=Luminosoft
VITE_APP_URL=https://luminosoft.in
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🗄️ Supabase Database Setup

The complete SQL schema, RLS security policies, triggers, and seed data are located in:
- `supabase/schema.sql`
- `supabase/migrations/20261112_luminosoft_schema.sql`

To apply this schema:
1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/vrcpceurhinjzgiseuow).
2. Go to the **SQL Editor** tab.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. All 10 tables, storage buckets, and RLS policies will be created automatically.

---

## 🔐 Admin Authentication Credentials

- **Admin Login Route:** `
- **Authorized Emails:** `
- **Default Sandbox Password:** 

---

© 2026 Luminosoft. All Rights Reserved.
