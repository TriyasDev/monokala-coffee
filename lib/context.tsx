'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  THEME_STORAGE_KEY,
  resolveTheme,
  toggleTheme as toggleThemeLogic,
  getFirstName,
} from './logic';
import {
  loadFirebaseAuth,
  signInWithGooglePopup,
  signOutFirebase,
} from './firebase-client';

export interface UserProfile {
  name: string;
  email: string;
  photoURL?: string;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: UserProfile | null;
  savedEvents: string[];
  toggleSaveEvent: (eventId: string) => void;
  isEventSaved: (eventId: string) => boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithDemo: () => void;
  signInLocal: (email: string, name?: string) => void;
  signOut: () => Promise<void>;
  feedback: string | null;
  setFeedback: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SAVED_EVENTS_KEY = 'monokala_saved_events';
const LOCAL_MEMBER_KEY = 'monokala_local_member';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize theme, saved events, and local user from storage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const resolved = resolveTheme(storedTheme);
      setTheme(resolved);
      document.documentElement.dataset.theme = resolved;

      const storedEvents = localStorage.getItem(SAVED_EVENTS_KEY);
      if (storedEvents) {
        const parsed = JSON.parse(storedEvents);
        if (Array.isArray(parsed)) setSavedEvents(parsed);
      }

      const storedMember = localStorage.getItem(LOCAL_MEMBER_KEY);
      if (storedMember) {
        const parsed = JSON.parse(storedMember);
        if (parsed && (parsed.name || parsed.email)) {
          setUser({
            name: parsed.name || getFirstName('', parsed.email),
            email: parsed.email || '',
            photoURL: parsed.photoURL,
          });
        }
      }
    } catch {
      // Ignore initial storage errors
    }

    // Try initializing Firebase Auth
    loadFirebaseAuth((fbUser) => {
      if (fbUser) {
        const profile: UserProfile = {
          name: fbUser.displayName || getFirstName('', fbUser.email || ''),
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || undefined,
        };
        setUser(profile);
        try {
          localStorage.setItem(LOCAL_MEMBER_KEY, JSON.stringify(profile));
        } catch {
          // Ignore
        }
      }
    });
  }, []);

  const toggleTheme = () => {
    const nextTheme = toggleThemeLogic(theme);
    setTheme(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      document.documentElement.dataset.theme = nextTheme;
    } catch {
      // Ignore storage errors
    }
  };

  const toggleSaveEvent = (eventId: string) => {
    setSavedEvents((prev) => {
      const exists = prev.includes(eventId);
      const next = exists ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      try {
        localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const isEventSaved = (eventId: string) => {
    return savedEvents.includes(eventId);
  };

  const signInWithGoogle = async () => {
    try {
      try {
        const fbUser = await signInWithGooglePopup();
        if (fbUser) {
          const profile: UserProfile = {
            name: fbUser.displayName || getFirstName('', fbUser.email || ''),
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || undefined,
          };
          setUser(profile);
          try {
            localStorage.setItem(LOCAL_MEMBER_KEY, JSON.stringify(profile));
          } catch {
            // Ignore
          }
          setFeedback(`Selamat datang, ${profile.name}!`);
          return;
        }
      } catch (err: any) {
        if (err?.code === 'auth/popup-blocked') {
          setFeedback('Popup masuk diblokir browser. Izinkan popup sebentar.');
          return;
        }
        if (err?.code === 'auth/popup-closed-by-user') {
          setFeedback('Jendela masuk ditutup sebelum selesai.');
          return;
        }
      }

      // Fallback demo account if Firebase popup not supported or blocked
      signInWithDemo();
      setFeedback('Berhasil masuk dengan Akun Kawan Monokala.');
    } catch {
      setFeedback('Gagal masuk. Silakan coba lagi.');
    }
  };

  const signInWithDemo = () => {
    const demoUser: UserProfile = {
      name: 'Kawan Monokala',
      email: 'member@monokala.id',
    };
    setUser(demoUser);
    try {
      localStorage.setItem(LOCAL_MEMBER_KEY, JSON.stringify(demoUser));
    } catch {
      // Ignore
    }
  };

  const signInLocal = (email: string, name?: string) => {
    const cleanEmail = email.trim();
    const cleanName = (name || '').trim() || getFirstName('', cleanEmail);
    const profile: UserProfile = {
      name: cleanName,
      email: cleanEmail,
    };
    setUser(profile);
    try {
      localStorage.setItem(LOCAL_MEMBER_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  };

  const signOut = async () => {
    try {
      await signOutFirebase();
    } catch {
      // Ignore
    }
    setUser(null);
    try {
      localStorage.removeItem(LOCAL_MEMBER_KEY);
    } catch {
      // Ignore
    }
    setFeedback('Anda telah berhasil keluar.');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        savedEvents,
        toggleSaveEvent,
        isEventSaved,
        signInWithGoogle,
        signInWithDemo,
        signInLocal,
        signOut,
        feedback,
        setFeedback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
