'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from './types';
import { INITIAL_USERS } from './ner-data';

interface DemoContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => void;
  isSimulatingGps: boolean;
  toggleGpsSimulation: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isSimulatingGps, setIsSimulatingGps] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('en');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Hydrate session from localStorage or /api/auth/me on initial load
  useEffect(() => {
    try {
      const isExplicitlyLoggedOut = localStorage.getItem('northlink_logged_out') === 'true';
      if (isExplicitlyLoggedOut) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        return;
      }

      const savedUser = localStorage.getItem('northlink_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setIsAuthenticated(true);
      } else {
        // Hydrate from /api/auth/me
        fetch('/api/auth/me')
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user) {
              setCurrentUser(data.user);
              setIsAuthenticated(true);
              localStorage.setItem('northlink_user', JSON.stringify(data.user));
            } else {
              // Default to admin for seamless first visit
              setCurrentUser(INITIAL_USERS[0]);
              setIsAuthenticated(true);
            }
          })
          .catch(() => {
            setCurrentUser(INITIAL_USERS[0]);
            setIsAuthenticated(true);
          });
      }
    } catch {
      setCurrentUser(INITIAL_USERS[0]);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        localStorage.removeItem('northlink_logged_out');
        localStorage.setItem('northlink_user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('northlink_token', data.token);
        }
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error during login' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.setItem('northlink_logged_out', 'true');
      localStorage.removeItem('northlink_user');
      localStorage.removeItem('northlink_token');
    }
  };

  const switchRole = (role: Role) => {
    const matched = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(matched);
    setIsAuthenticated(true);
    localStorage.removeItem('northlink_logged_out');
    localStorage.setItem('northlink_user', JSON.stringify(matched));
  };

  const toggleGpsSimulation = () => {
    setIsSimulatingGps(prev => !prev);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Simulated GPS movement loop when active
  useEffect(() => {
    if (!isSimulatingGps) return;

    const interval = setInterval(async () => {
      try {
        const deltaLat = (Math.random() - 0.5) * 0.004;
        const deltaLng = (Math.random() - 0.5) * 0.004;
        
        await fetch('/api/vehicles/veh_01/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: 25.5610 + deltaLat,
            longitude: 91.9050 + deltaLng,
            speed: 38 + Math.round((Math.random() - 0.5) * 6),
            status: 'IN_TRANSIT',
          }),
        });
      } catch {
        // silent simulation tick
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isSimulatingGps]);

  return (
    <DemoContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        switchRole,
        isSimulatingGps,
        toggleGpsSimulation,
        language,
        setLanguage,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
