'use client';
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/lib/mockDB';
import { getCurrentUser, saveCurrentUser } from '@/lib/mockAuth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  const updateUser = useCallback((updater: (u: User) => User) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = updater(prev);
      saveCurrentUser(updated);
      return updated;
    });
  }, []);

  return { user, loading, setUser, updateUser };
}
