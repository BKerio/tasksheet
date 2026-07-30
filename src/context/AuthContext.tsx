import React, { createContext, useContext, useState, useEffect } from 'react';
import { PrismaUser, getPrismaUsers } from '@/lib/prismaService';

interface AuthContextType {
  user: PrismaUser | null;
  isAuthenticated: boolean;
  login: (
    emailOrReg: string,
    password: string,
    expectedPortal?: 'student' | 'admin'
  ) => { success: boolean; message?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'taskapp_auth_session';

// Session storage keeps a signed-in user across reloads within the same tab,
// but never across a browser restart.
const readStoredSession = (): PrismaUser | null => {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed: PrismaUser = JSON.parse(stored);
    const stillExists = getPrismaUsers().some((u) => u.id === parsed.id);
    return stillExists ? parsed : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PrismaUser | null>(readStoredSession);

  useEffect(() => {
    // Clear any session persisted by earlier versions of the app.
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (
    emailOrReg: string,
    password: string,
    expectedPortal?: 'student' | 'admin'
  ) => {
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

    if (foundUser.password !== password) {
      return { success: false, message: 'Incorrect password.' };
    }

    const isStaff = foundUser.role === 'ADMIN' || foundUser.role === 'SUPERVISOR';
    if (expectedPortal === 'student' && isStaff) {
      return { success: false, message: 'Use the Admin tab to sign in with this account.' };
    }
    if (expectedPortal === 'admin' && !isStaff) {
      return { success: false, message: 'Use the Student tab to sign in with this account.' };
    }

    setUser(foundUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
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
