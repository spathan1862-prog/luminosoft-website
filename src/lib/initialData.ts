import { 
  CompanySettings, 
  ProjectCategory, 
  ApplicationCategory, 
  WebProject, 
  Application,
  YouTubeTutorial 
} from '../types';

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  id: 'luminosoft',
  company_name: 'Luminosoft',
  tagline: 'Smart Software. Powerful Digital Solutions.',
  logo_url: '/images/luminosoft-logo.png',
  email: 'contact@luminosoft.in',
  phone: '+91 7822886909',
  whatsapp: '+91 7822886909',
  website_url: 'https://luminosoft.in',
  business_address: 'Badnapur, Jalna & Aurangabad, Maharashtra, India',
  social_links: {
    github: 'https://github.com/spathan1862-prog',
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
    youtube: 'https://youtube.com/@luminosoft',
  },
  youtube_channel_url: 'https://youtube.com/@luminosoft',
  youtube_channel_name: 'Luminosoft Tutorials',
  youtube_channel_logo: '/images/luminosoft-logo.png',
  footer_content: 'Luminosoft delivers professional website development, custom software, mobile applications and CRM solutions that help businesses and individuals work smarter.',
};

export const INITIAL_PROJECT_CATEGORIES: ProjectCategory[] = [
  { id: 'all', name: 'All Projects', sort_order: 0 },
  { id: 'business-website', name: 'Business Websites', sort_order: 1 },
  { id: 'ecommerce', name: 'E-Commerce Stores', sort_order: 2 },
  { id: 'hotel-website', name: 'Hotel & Hospitality', sort_order: 3 },
  { id: 'portfolio', name: 'Portfolio & Personal', sort_order: 4 },
  { id: 'custom-software', name: 'Custom Software & Portals', sort_order: 5 },
  { id: 'crm', name: 'CRM Solutions', sort_order: 6 },
];

export const INITIAL_APP_CATEGORIES: ApplicationCategory[] = [
  { id: 'all', name: 'All Applications', sort_order: 0 },
  { id: 'business-software', name: 'Business Software', sort_order: 1 },
  { id: 'hotel-management', name: 'Hotel Management', sort_order: 2 },
  { id: 'medical-management', name: 'Medical Management', sort_order: 3 },
  { id: 'productivity', name: 'Productivity', sort_order: 4 },
  { id: 'games', name: 'Games', sort_order: 5 },
  { id: 'other', name: 'Other Applications', sort_order: 6 },
];

export const INITIAL_PROJECTS: WebProject[] = [
  {
    id: 'd0ba9773-883a-4036-9ce8-2974d11850ca',
    slug: 'khan-electrics',
    title: 'Khan Electrics',
    category: 'Business Websites',
    logo_url: '/images/khan-electrics-logo.png',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    ],
    short_description: 'Official multi-service portal for Khan Electrics featuring service booking, product catalogs, and administrative CMS.',
    detailed_description: 'A complete digital presence built for Khan Electrics. The platform empowers customers across Badnapur, Jalna, and Aurangabad to schedule certified electrical services, browse electrical product offerings, and get instant quotes. It includes a custom administrative dashboard for tracking incoming job leads, updating media galleries, and managing customer inquiries in real time.',
    features: [
      'Interactive service booking & rapid quote request system',
      'Residential, commercial, and industrial electrical service catalog',
      'Custom Admin CMS for real-time lead and gallery management',
      'PostgreSQL database synchronization with instant alerts',
      'Instant one-tap WhatsApp direct contact & click-to-call integration',
      'Performance-tuned frontend achieving 95+ Google Lighthouse scores'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Cloud Database', 'PostgreSQL', 'Vite'],
    link: 'https://khaneletrics.in',
    status: 'Live & Active',
    is_featured: true,
    is_published: true,
    sort_order: 1,
    completion_date: '2026-10-28',
  },
  {
    id: '69dbc5be-28df-4f0b-b750-1c00eed76a1d',
    slug: 'medico-manager-portal',
    title: 'MedicoManager Healthcare Portal',
    category: 'Custom Software & Portals',
    logo_url: '',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80'
    ],
    short_description: 'Healthcare practice and pharmacy web portal companion with patient records and real-time appointment sync.',
    detailed_description: 'A cloud companion portal designed to bridge clinic operations with online patient appointments, digital prescription history, and clinic management reports.',
    features: [
      'Online appointment scheduling with queue status',
      'Prescription verification portal for patients',
      'Cloud sync between desktop software and mobile web portal',
      'HIPAA-compliant encrypted data architecture'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Cloud Architecture'],
    link: '#',
    status: 'Live & Active',
    is_featured: true,
    is_published: true,
    sort_order: 2,
    completion_date: '2026-08-15',
  },
  {
    id: 'b361e9d9-8fee-41f9-ae24-0f13df7a9ff5',
    slug: 'hotel-grand-palace',
    title: 'Grand Horizon Resort & Hotel',
    category: 'Hotel & Hospitality',
    logo_url: '',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    short_description: 'Luxury hospitality website with interactive room showcase, amenity virtual tours, and direct booking engine.',
    detailed_description: 'Built for a premier resort, this website delivers a seamless guest experience from room discovery to checkout, integrated directly with Luminosoft Hotel Management backend.',
    features: [
      'Real-time room availability and seasonal rate calculation',
      'Photo galleries, 360 virtual room previews, and amenity lists',
      'Automated confirmation email and WhatsApp invoice dispatch',
      'Mobile-first booking engine with zero booking commission fees'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Cloud Architecture'],
    link: '#',
    status: 'Live & Active',
    is_featured: false,
    is_published: true,
    sort_order: 3,
    completion_date: '2026-09-20',
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: '0e00c13a-2594-4e13-8ba2-72f2e6a6054c',
    slug: 'hotel-management',
    name: 'Luminosoft Hotel Management',
    category: 'Hotel Management',
    icon: '/images/hotel-management-icon.ico',
    logo_url: '/images/hotel-management-icon.ico',
    short_description: 'Complete hotel and resort property management system for room bookings, guest check-in/out, billing, and staff operations.',
    full_description: 'Luminosoft Hotel Management is an enterprise-grade desktop and mobile property management system (PMS) engineered specifically for independent hotels, boutique resorts, lodges, and guest houses. It consolidates every facet of your hospitality workflow: visual room grid allocation, express check-in with ID verification, automated GST-compliant billing, multi-user shifts, and cloud sync.',
    features: [
      'Interactive color-coded room status grid (Vacant, Occupied, Cleaning, Maintenance)',
      '1-Minute Express Check-In & Check-Out with digital receipt printing',
      'Automated GST/tax invoice calculations and multi-payment split support',
      'Shift-wise cash register reconciliation and staff audit logs',
      'Works 100% offline with optional cloud sync to prevent downtime',
      'Comprehensive daily revenue, occupancy rate, and expense analytics'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
    supported_platforms: ['windows', 'android'],
    system_requirements: 'Windows 10/11 (64-bit), 4GB RAM, 200MB Storage / Android 8.0 or higher',
    app_size: '77.6 MB (Windows) / 10.2 MB (Android)',
    version: '1.2.0',
    release_date: '2026-11-10',
    download_count: 340,
    is_featured: true,
    is_published: true,
    sort_order: 1,
    downloads: [
      {
        id: 'dl-hotel-win',
        application_id: '0e00c13a-2594-4e13-8ba2-72f2e6a6054c',
        platform: 'windows',
        platform_name: 'Windows Installer (Setup.exe)',
        download_url: 'https://github.com/spathan1862-prog/khan-apps/releases/latest/download/Hotel-Management-by-Luminosoft-Setup.exe',
        direct_asset_url: 'https://github.com/spathan1862-prog/khan-apps/releases/latest/download/Hotel-Management-by-Luminosoft-Setup.exe',
        is_github_release: true,
        file_name: 'Hotel-Management-by-Luminosoft-Setup.exe',
        file_size: '77.6 MB',
        is_active: true,
      },
      {
        id: 'dl-hotel-apk',
        application_id: '0e00c13a-2594-4e13-8ba2-72f2e6a6054c',
        platform: 'android',
        platform_name: 'Android APK (Direct Download)',
        download_url: 'https://pixvgshevennznzgdwro.supabase.co/storage/v1/object/public/apps/releases/1793609770051_app-debug.apk',
        direct_asset_url: 'https://pixvgshevennznzgdwro.supabase.co/storage/v1/object/public/apps/releases/1793609770051_app-debug.apk',
        is_github_release: false,
        file_name: 'Hotel-Management-Mobile.apk',
        file_size: '10.2 MB',
        is_active: true,
      }
    ],
    updates: [
      {
        id: 'up-hotel-1',
        application_id: '0e00c13a-2594-4e13-8ba2-72f2e6a6054c',
        version: '1.2.0',
        release_date: '2026-11-10',
        title: 'Performance & Multi-device Update',
        whats_new: 'Added rapid occupancy dashboard, refined thermal printer drivers, and enhanced background database backup.',
        bug_fixes: [
          'Resolved thermal printer paper cut margins on 80mm roll setups',
          'Fixed room status refresh glitch during rapid multi-terminal checkout'
        ],
        new_features: [
          'Direct WhatsApp receipt sharing to guest phone numbers',
          'Configurable GST tax slab templates for food vs room charges'
        ],
        download_url: 'https://github.com/spathan1862-prog/khan-apps/releases/latest/download/Hotel-Management-by-Luminosoft-Setup.exe',
        platform: 'windows',
      }
    ]
  },
  {
    id: '69dbc5be-28df-4f0b-b750-1c00eed76a1d-app',
    slug: 'medico-manager',
    name: 'MedicoManager',
    category: 'Medical Management',
    icon: 'Stethoscope',
    logo_url: '',
    short_description: 'Comprehensive clinic and medical practice management software with patient records, prescriptions, and pharmacy billing.',
    full_description: 'MedicoManager is a modern clinic and pharmacy management suite designed for physicians, specialists, outpatient clinics, and medical retail stores. Built on Electron with local encrypted database storage, it ensures 100% patient confidentiality, zero reliance on active internet connectivity, and rapid workflow speed.',
    features: [
      'Electronic Health Records (EHR) with patient history and visit timelines',
      'Smart digital prescription builder with generic drug suggestions and dosage templates',
      'Pharmacy medicine inventory management with batch expiry and low-stock alerts',
      'Outpatient queue management and patient token display',
      'Fast invoice generation supporting both thermal slip and A4 printable formats',
      'Comprehensive analytical reports on consultations, pharmacy sales, and revenue'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80'
    ],
    supported_platforms: ['windows'],
    system_requirements: 'Windows 10 or 11 (64-bit), 4GB RAM, 500MB Free Storage Space',
    app_size: '81.3 MB',
    version: '2.0.0',
    release_date: '2026-06-27',
    download_count: 520,
    is_featured: true,
    is_published: true,
    sort_order: 2,
    downloads: [
      {
        id: 'dl-medico-win',
        application_id: '69dbc5be-28df-4f0b-b750-1c00eed76a1d-app',
        platform: 'windows',
        platform_name: 'Windows Setup (Setup 2.0.0.exe)',
        download_url: 'https://github.com/spathan1862-prog/khan-apps/releases/latest/download/MedicoManager-Setup-2.0.0.exe',
        direct_asset_url: 'https://github.com/spathan1862-prog/khan-apps/releases/latest/download/MedicoManager-Setup-2.0.0.exe',
        is_github_release: true,
        file_name: 'MedicoManager Setup 2.0.0.exe',
        file_size: '81.3 MB',
        is_active: true,
      }
    ],
    updates: [
      {
        id: 'up-medico-2',
        application_id: '69dbc5be-28df-4f0b-b750-1c00eed76a1d-app',
        version: '2.0.0',
        release_date: '2026-06-27',
        title: 'Major Architecture & Security Overhaul',
        whats_new: 'Upgraded Electron core, added encrypted local database, refreshed prescription designer, and added drug batch tracking.',
        bug_fixes: [
          'Fixed thermal receipt line break issue for extended drug names',
          'Resolved rare search index lag when searching through 10,000+ patient records'
        ],
        new_features: [
          'Visual vitals tracking (Blood Pressure, Glucose, Pulse, SpO2) with trend graph',
          'Automated low-inventory sound alerts for fast-moving medicines',
          'Export consult records to password-protected PDF'
        ],
        download_url: '#',
        platform: 'windows',
      }
    ]
  },
  {
    id: 'fbf7e334-37c0-4655-9c9d-5598f890dcf2',
    slug: 'bubble-shooter',
    name: 'Bubble Shooter',
    category: 'Games',
    icon: '/images/bubble-shooter-icon.png',
    logo_url: '/images/bubble-shooter-icon.png',
    short_description: 'Addictive arcade bubble shooter game with vibrant physics, hundreds of challenging levels, and power-up boosters.',
    full_description: 'Bubble Shooter delivers timeless arcade puzzle fun to your Android phone. Aim carefully, match 3 or more bubbles of the same color, and trigger satisfying cascade pops. Featuring intuitive one-touch aiming, dynamic booster mechanics, and buttery smooth 60 FPS gameplay, it is optimized to run smoothly on any device.',
    features: [
      'Hundreds of handcrafted levels with progressively engaging mechanics',
      'Realistic trajectory laser aiming and bounce mechanics',
      'Power-up boosters including Bomb, Color Splash, and Lightning Line',
      'Playable 100% offline without needing Wi-Fi or data',
      'Ultra-optimized APK size with minimal battery and RAM usage',
      'Vibrant HD casual visuals and delightful pop sound effects'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1612287233207-6a16d820ca6e?auto=format&fit=crop&w=1200&q=80'
    ],
    supported_platforms: ['android'],
    system_requirements: 'Android 7.0 (Nougat) or higher, 2GB RAM',
    app_size: '12.8 MB',
    version: '1.0.0',
    release_date: '2026-10-29',
    download_count: 890,
    is_featured: true,
    is_published: true,
    sort_order: 3,
    downloads: [
      {
        id: 'dl-bubble-apk',
        application_id: 'fbf7e334-37c0-4655-9c9d-5598f890dcf2',
        platform: 'android',
        platform_name: 'Android APK (Direct Download)',
        download_url: 'https://pixvgshevennznzgdwro.supabase.co/storage/v1/object/public/apps/releases/1793259854116_app-debug.apk',
        direct_asset_url: 'https://pixvgshevennznzgdwro.supabase.co/storage/v1/object/public/apps/releases/1793259854116_app-debug.apk',
        is_github_release: false,
        file_name: 'Bubble-Shooter.apk',
        file_size: '12.8 MB',
        is_active: true,
      }
    ],
    updates: [
      {
        id: 'up-bubble-1',
        application_id: 'fbf7e334-37c0-4655-9c9d-5598f890dcf2',
        version: '1.0.0',
        release_date: '2026-10-29',
        title: 'Official Android Release',
        whats_new: 'Initial public launch with full level packs, arcade boosters, and offline mode.',
        bug_fixes: [],
        new_features: [
          'Classic bubble matching engine',
          'Aim assist guideline',
          'Score leaderboard and star ratings'
        ],
        download_url: 'https://pixvgshevennznzgdwro.supabase.co/storage/v1/object/public/apps/releases/1793259854116_app-debug.apk',
        platform: 'android',
      }
    ]
  },
  {
    id: '4871fb69-6044-41d2-a320-e05ab0c65220',
    slug: 'color-block-puzzle',
    name: 'Color Block Puzzle',
    category: 'Games',
    icon: 'Grid3x3',
    logo_url: '',
    short_description: 'Relaxing brain puzzle game where you strategically place colorful blocks to clear rows and columns on the grid.',
    full_description: 'Color Block Puzzle combines strategic thinking with relaxing casual gameplay. Drag and drop colorful polyomino shapes onto the board. Complete rows or columns horizontally and vertically to clear blocks and score points. With zero time limits, it is the perfect mindfulness puzzle game for daily brain training.',
    features: [
      'Simple, intuitive drag-and-drop mechanics anyone can master in seconds',
      'No countdown timers or stress — play at your own comfortable pace',
      'Combo multipliers for clearing multiple lines in a single move',
      'Clean, minimalist pastel aesthetic that is easy on the eyes',
      'Completely offline gameplay with instant load time and zero lag',
      'Smart shape generation algorithm keeping puzzles balanced and rewarding'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ],
    supported_platforms: ['android'],
    system_requirements: 'Android 7.0 or higher, 2GB RAM',
    app_size: '9.3 MB',
    version: '1.0.0',
    release_date: '2026-10-29',
    download_count: 670,
    is_featured: false,
    is_published: true,
    sort_order: 4,
    downloads: [
      {
        id: 'dl-block-apk',
        application_id: '4871fb69-6044-41d2-a320-e05ab0c65220',
        platform: 'android',
        platform_name: 'Android APK (Direct Download)',
        download_url: 'https://pixvgshevennznzgdwro.supabase.co/storage/v1/object/public/apps/releases/1793259919178_app-debug.apk',
        direct_asset_url: 'https://pixvgshevennznzgdwro.supabase.co/storage/v1/object/public/apps/releases/1793259919178_app-debug.apk',
        is_github_release: false,
        file_name: 'Color-Block-Puzzle.apk',
        file_size: '9.3 MB',
        is_active: true,
      }
    ],
    updates: [
      {
        id: 'up-block-1',
        application_id: '4871fb69-6044-41d2-a320-e05ab0c65220',
        version: '1.0.0',
        release_date: '2026-10-29',
        title: 'Initial Android Release',
        whats_new: 'First release of Color Block Puzzle with infinite board mode and sound effects.',
        bug_fixes: [],
        new_features: [
          '8x8 puzzle board grid',
          'Combo streak multipliers',
          'Haptic feedback support'
        ],
        download_url: 'https://pixvgshevennznzgdwro.supabase.co/storage/v1/object/public/apps/releases/1793259919178_app-debug.apk',
        platform: 'android',
      }
    ]
  }
];

export const INITIAL_YOUTUBE_TUTORIALS: YouTubeTutorial[] = [
  {
    id: 'tut-hotel-install',
    title: 'How to Install & Set Up Luminosoft Hotel Management on Windows',
    description: 'A complete step-by-step walkthrough on downloading the Windows Setup installer, configuring room categories, and generating your first guest invoice.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    related_application_id: '0e00c13a-2594-4e13-8ba2-72f2e6a6054c',
    related_application_name: 'Luminosoft Hotel Management',
    duration: '8:45',
    is_featured: true,
    is_published: true,
    sort_order: 1,
  },
  {
    id: 'tut-android-apk',
    title: 'How to Download and Install Android APK Applications Safely',
    description: 'Learn how to enable unknown sources permissions on your Android smartphone and install Luminosoft APKs without errors.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    related_application_id: 'fbf7e334-37c0-4655-9c9d-5598f890dcf2',
    related_application_name: 'Bubble Shooter / General APK',
    duration: '5:20',
    is_featured: true,
    is_published: true,
    sort_order: 2,
  },
  {
    id: 'tut-medico-records',
    title: 'MedicoManager Tutorial: Managing Patient Prescriptions & Records',
    description: 'Learn how to register new patients, generate digital prescriptions, and track pharmacy stock batches in MedicoManager.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    related_application_id: '69dbc5be-28df-4f0b-b750-1c00eed76a1d-app',
    related_application_name: 'MedicoManager',
    duration: '11:15',
    is_featured: false,
    is_published: true,
    sort_order: 3,
  }
];
