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
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    return !!data;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const hasAdmin = await checkAdminRole(session.user.id);
        if (hasAdmin) {
          setAdmin(session.user);
          setIsAdmin(true);
        } else {
          setAdmin(null);
          setIsAdmin(false);
        }
      } else {
        setAdmin(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const hasAdmin = await checkAdminRole(session.user.id);
        if (hasAdmin) {
          setAdmin(session.user);
          setIsAdmin(true);
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    const hasAdmin = await checkAdminRole(data.user.id);
    if (!hasAdmin) {
      await supabase.auth.signOut();
      return { success: false, error: 'You do not have admin access.' };
    }

    setAdmin(data.user);
    setIsAdmin(true);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{
      admin,
      isAuthenticated: isAdmin && !!admin,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
