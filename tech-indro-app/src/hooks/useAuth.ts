/**
 * Auth Hook — manages login state with AsyncStorage
 */
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@tech_indro_user';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const saveUser = useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
      setUser(null);
    } catch {
      // ignore
    }
  }, []);

  return { user, loading, saveUser, logout };
}
