'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../lib/axios';

type User = {
  userId: number;
  email: string;
  fullName?: string;
  role?: string;
} | null;

type AuthContextType = {
  user: User;
  accessToken: string | null;
  login: (accessToken: string, user: Exclude<User, null>) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  // no-ops so consumers don’t crash before provider mounts
  login: () => { },
  logout: async () => { },
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  /**
   * Load persisted auth state from localStorage
   */
  useEffect(() => {
    try {
      const at = localStorage.getItem('accessToken');
      const u = localStorage.getItem('user');
      if (at && u) {
        setAccessToken(at);
        setUser(JSON.parse(u));
      }
    } catch {
      // ignore malformed storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }, []);

  /**
   * Keep Axios configured with Authorization & withCredentials.
   * Also register a response interceptor to attempt a token refresh
   * once per failing request (401), but skip for /auth/login & /auth/register.
   */
  useEffect(() => {
    // Request interceptor
    const reqId = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      // ensure refresh cookie is sent when needed
      config.withCredentials = true;
      return config;
    });

    // Response interceptor
    const resId = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error?.config;
        const status = error?.response?.status;
        const url: string = original?.url || '';

        // Guard: if we don’t have a request config, just bubble up the error
        if (!original) return Promise.reject(error);

        // Do not attempt refresh on these endpoints
        const isAuthEndpoint = /\/auth\/(login|register|refresh)/i.test(url);

        // Attempt a single refresh for 401s on protected endpoints
        if (status === 401 && !original._retry && !isAuthEndpoint) {
          original._retry = true;
          try {
            const r = await api.post('/auth/refresh', {}); // cookie sent via withCredentials
            const newAccess = r.data?.accessToken as string | undefined;

            if (!newAccess) {
              // No access token in response – treat as failed refresh
              handleLocalLogout();
              return Promise.reject(error);
            }

            // Update memory + storage
            setAccessToken(newAccess);
            localStorage.setItem('accessToken', newAccess);

            // Retry original request with new token
            original.headers = original.headers ?? {};
            original.headers['Authorization'] = `Bearer ${newAccess}`;
            return api(original);
          } catch {
            // Refresh failed — clear local state
            handleLocalLogout();
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount or when accessToken changes
    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [accessToken]);

  /**
   * Local-only logout (clears memory + storage)
   */
  const handleLocalLogout = () => {
    setAccessToken(null);
    setUser(null);
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } catch {
      // ignore storage errors
    }
  };

  /**
   * Public API: login
   * Persist token & user in state + localStorage
   */
  const login = (token: string, u: Exclude<User, null>) => {
    setAccessToken(token);
    setUser(u);
    try {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(u));
    } catch {
      // If storage fails, still keep in memory
    }
  };

  /**
   * Public API: logout
   * Call backend to clear refresh cookie, then clear local state regardless.
   */
  const logout = async () => {
    try {
      await api.post('/Auth/logout', {}); // server clears refresh cookie / revokes token
    } finally {
      handleLocalLogout();
    }
  };

  const value = useMemo(
    () => ({ user, accessToken, login, logout }),
    [user, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume auth context
 */
export const useAuth = () => useContext(AuthContext);