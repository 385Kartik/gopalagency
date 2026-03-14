import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AdminContextType {
  admin: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async (sessionUser: User | null) => {
      if (!sessionUser) {
        setAdmin(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', sessionUser.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) console.error("Admin check error:", error);
        setAdmin(data ? sessionUser : null);
      } catch (error) {
        console.error("Error in admin check:", error);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdminStatus(session?.user || null);
    });

    // 2. Listen to Session Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAdminStatus(session?.user || null);
    });

    // 🔴 FAIL-SAFE: Agar connection slow ho, toh 3 second me loading hata dega
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    setIsLoading(false);

    if (!roleData) {
      await supabase.auth.signOut();
      return { success: false, error: 'You do not have admin access.' };
    }

    setAdmin(data.user);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, isAuthenticated: !!admin, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};