import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '@/types';
import { ROUTES } from '@/constants';
import { authService, userService } from '@/services/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getRedirectPath = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return '/superadmin/dashboard';
      case 'network_admin': return '/networkadmin/dashboard';
      case 'admin': return ROUTES.ADMIN.DASHBOARD;
      case 'secretaria': return ROUTES.SECRETARY.DASHBOARD;
      case 'professor': return ROUTES.TEACHER.DASHBOARD;
      case 'aluno': return ROUTES.STUDENT.DASHBOARD;
      default: return '/';
    }
  };

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const profile = await userService.getProfile(supabaseUser.id);
      if (profile) {
        const user: User = {
          id: profile.id,
          fullName: profile.full_name,
          email: profile.email,
          role: profile.role as UserRole,
          schoolId: profile.school_id,
          active: profile.active,
          phone: profile.phone
        };
        setUser(user);
        return user;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await authService.getCurrentSession();
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchUserProfile(session.user);
        if (profile) {
          window.location.hash = getRedirectPath(profile.role);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        window.location.hash = '/login';
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await authService.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error);
        toast.error('Email ou senha incorretos');
        throw error;
      }

      // Login real bem-sucedido - o perfil será carregado pelo onAuthStateChange
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    // Implementar reset de senha se necessário
    console.log('Password reset requested for:', email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};