import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: false,
  isConfigured: false,
  signIn: async () => ({ error: 'Not implemented' }),
  signUp: async () => ({ error: 'Not implemented' }),
  signOut: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: 'Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.' };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<{ error: string | null }> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: 'Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.' };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || 'Katta Elia Speargeon'
        }
      }
    });

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const signOut = async (): Promise<void> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
