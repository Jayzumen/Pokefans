"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import type { Profile } from "@/lib/auth";

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

// Firebase is ~100 KB of JS. Load it after hydration instead of shipping it
// in every page's critical bundle; pages that need it import it directly.
const loadAuth = () => import("@/lib/auth");

async function loadProfile(u: User | null) {
  if (!u) return null;
  try {
    const { getProfile, migrateLegacyAccount } = await loadAuth();
    return (await getProfile(u.uid)) ?? (await migrateLegacyAccount(u.uid));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // One subscription for the whole app, cleaned up on unmount.
  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    Promise.all([loadAuth(), import("firebase/auth")]).then(
      ([{ auth }, { onAuthStateChanged }]) => {
        if (!active) return;
        unsubscribe = onAuthStateChanged(auth, async (u) => {
          setLoading(true);
          const p = await loadProfile(u);
          if (!active) return;
          setUser(u);
          setProfile(p);
          setLoading(false);
        });
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    const { auth } = await loadAuth();
    setProfile(await loadProfile(auth.currentUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
