import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrismaUser, getPrismaUsers } from '@/lib/prismaService';

interface AuthContextType {
  user: PrismaUser | null;
  isAuthenticated: boolean;
  login: (emailOrReg: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'taskapp_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PrismaUser | null>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    // Default logged in as Ian Kipkorir Metto (Student 24-3769)
    const users = getPrismaUsers();
    return users.find((u) => u.registrationNo === '24-3769') || users[0] || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (emailOrReg: string, password: string) => {
    const users = getPrismaUsers();
    const cleanInput = emailOrReg.trim().toLowerCase();

    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === cleanInput ||
        (u.registrationNo && u.registrationNo.toLowerCase() === cleanInput)
    );

    if (!foundUser) {
      return { success: false, message: 'Invalid Student ID or Email address.' };
    }

    if (foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'Incorrect password.' };
    }

    setUser(foundUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const switchUser = (userId: string) => {
    const users = getPrismaUsers();
    const found = users.find((u) => u.id === userId);
    if (found) {
      setUser(found);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
