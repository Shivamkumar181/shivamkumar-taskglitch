import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  timezone: string;
  quota?: { monthlyRevenueGoal: number };
  preferences: {
    showOnboarding: boolean;
  };
}

interface UserContextValue {
  user: User;
  setShowOnboarding: (show: boolean) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    id: 'u-001',
    name: 'Avery (Sales Manager)',
    avatarUrl: undefined,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    quota: { monthlyRevenueGoal: 50000 },
    preferences: { showOnboarding: true },
  });

  const value = useMemo<UserContextValue>(() => ({
    user,
    setShowOnboarding: (show: boolean) => setUser(prev => ({ ...prev, preferences: { ...prev.preferences, showOnboarding: show } })),
  }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}


