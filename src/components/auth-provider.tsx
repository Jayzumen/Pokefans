"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, getProfile, migrateLegacyAccount, type Profile } from "@/lib/auth";

interface AuthState {
  user: User | null;
  /** Null while signed out, or when a signed-in user has no username yet. */
  profile: Profile | null;
  loading: boolean;
  /** Re-read the profile (e.g. after claiming a username). */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (u: User | null) => {
    if (!u) return null;
    try {
      return (await getProfile(u.uid)) ?? (await migrateLegacyAccount(u.uid));
    } catch {
      return null;
    }
  }, []);

  // One subscription for the whole app, cleaned up on unmount.
  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      const p = await loadProfile(u);
      if (!active) return;
      setUser(u);
      setProfile(p);
      setLoading(false);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    setProfile(await loadProfile(auth.currentUser));
  }, [loadProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
