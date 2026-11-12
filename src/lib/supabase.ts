import { createClient } from '@supabase/supabase-js';

// Read Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vrcpceurhinjzgiseuow.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_gOFWT4dmdrkBIaduTtklKw_5TzPOia1';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  supabasePublishableKey !== 'your_supabase_publishable_anon_key_here'
);

// Clear any obsolete localStorage tokens to enforce tab-scoped session policy
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    Object.keys(window.localStorage).forEach((key) => {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        window.localStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore in restricted environments
  }
}

// Browser session storage
const customAuthStorage = typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : undefined;

// Initialize Supabase Client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        storage: customAuthStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Verifies Supabase connection and tests network reachability
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  hasSession: boolean;
  tablesStatus?: Record<string, boolean>;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      message: 'Supabase credentials are not configured.',
      hasSession: false,
    };
  }

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      return {
        success: false,
        message: `Supabase auth check returned: ${sessionError.message}`,
        hasSession: false,
      };
    }

    // Check availability of key tables
    const tables = ['web_projects', 'applications', 'website_enquiries', 'company_settings'];
    const tablesStatus: Record<string, boolean> = {};

    await Promise.all(
      tables.map(async (table) => {
        try {
          const { error } = await supabase.from(table).select('*').limit(1);
          tablesStatus[table] = !error;
        } catch {
          tablesStatus[table] = false;
        }
      })
    );

    return {
      success: true,
      message: 'Connected to Supabase project successfully.',
      hasSession: Boolean(sessionData?.session),
      tablesStatus,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect: ${err.message || 'Unknown network error'}`,
      hasSession: false,
    };
  }
}
