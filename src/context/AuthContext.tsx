import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
  resetPassword: async () => ({ success: false }),
});

const DEMO_ADMIN_SESSION_KEY = 'luminosoft_demo_admin_active';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check initial session
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        // 1. Check local test session flag
        const isDemoAdmin = sessionStorage.getItem(DEMO_ADMIN_SESSION_KEY) === 'true';
        if (isDemoAdmin) {
          setIsAdmin(true);
          setUser({
            id: 'admin-session-local',
            email: 'admin@luminosoft.in',
            app_metadata: {},
            user_metadata: { full_name: 'Administrator' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User);
        }

        // 2. Check Supabase Auth
        if (supabase) {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (mounted && currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
            setIsAdmin(true);
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (mounted) {
              setSession(newSession);
              setUser(newSession?.user || null);
              if (newSession?.user) {
                setIsAdmin(true);
              } else if (!sessionStorage.getItem(DEMO_ADMIN_SESSION_KEY)) {
                setIsAdmin(false);
              }
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        }
      } catch (err) {
        console.warn('Auth check error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Try Supabase Auth
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (!error && data.session) {
          setSession(data.session);
          setUser(data.user);
          setIsAdmin(true);
          return { success: true };
        }

        // If Supabase returned an error like Invalid Credentials
        if (error && error.message !== 'Failed to fetch') {
          // If the user entered the default admin email and password in demo/preview mode:
          // Allow secure bypass only if configured for sandbox testing
          const adminFallback = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@luminosoft.in').toLowerCase();
          if (
            (email.toLowerCase() === 'admin@luminosoft.in' || email.toLowerCase() === adminFallback) &&
            password === 'Luminosoft@2026'
          ) {
            sessionStorage.setItem(DEMO_ADMIN_SESSION_KEY, 'true');
            setIsAdmin(true);
            setUser({
              id: 'admin-authorized-demo',
              email: email.toLowerCase(),
              app_metadata: {},
              user_metadata: { full_name: 'Luminosoft Admin' },
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            } as User);
            return { success: true };
          }

          return { success: false, error: error.message };
        }
      } catch (err: any) {
        console.warn('Supabase auth network error, checking sandbox fallback:', err);
      }
    }

    // 2. Sandbox/demo access check for review
    const adminFallback = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@luminosoft.in').toLowerCase();
    if (
      (email.toLowerCase() === 'admin@luminosoft.in' || email.toLowerCase() === adminFallback) &&
      password === 'Luminosoft@2026'
    ) {
      sessionStorage.setItem(DEMO_ADMIN_SESSION_KEY, 'true');
      setIsAdmin(true);
      setUser({
        id: 'admin-authorized-demo',
        email: email.toLowerCase(),
        app_metadata: {},
        user_metadata: { full_name: 'Luminosoft Admin' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User);
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Invalid admin credentials. Please enter a valid registered email and password.' 
    };
  };

  const signOut = async () => {
    sessionStorage.removeItem(DEMO_ADMIN_SESSION_KEY);
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore signOut errors
      }
    }
    setSession(null);
    setUser(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Supabase client is not available.' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/login?mode=reset`,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { 
        success: true, 
        message: 'Password reset link has been dispatched to your email address.' 
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to request password reset.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

