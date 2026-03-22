// frontend/lib/axios.ts
import axios from 'axios';

let accessToken: string | null =
  typeof window !== 'undefined' ? localStorage.getItem('access') : null;

export function setAccessToken(t: string) {
  accessToken = t;
  if (typeof window !== 'undefined') localStorage.setItem('access', t);
}
export function clearAccessToken() {
  accessToken = null;
  if (typeof window !== 'undefined') localStorage.removeItem('access');
}

const api = axios.create({
  baseURL: 'https://localhost:7193/api',
  withCredentials: true,
});

// attach token
api.interceptors.request.use((cfg) => {
  if (accessToken) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${accessToken}`;
  }
  return cfg;
});

let isRefreshing = false;
let queue: Array<(t: string) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    // Do not attempt refresh on these endpoints
    const isAuthEndpoint = /\/auth\/(login|register|refresh)/i.test(original?.url || '');

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const r = await axios.post('https://localhost:7193/api/auth/refresh', null, { withCredentials: true });
          const newAccess = r.data?.accessToken;
          if (newAccess) {
            setAccessToken(newAccess);
            queue.forEach((cb) => cb(newAccess));
            queue = [];
            return api(original);
          }
        } catch (e) {
          clearAccessToken();
          // Reject all queued requests too
          queue.forEach((cb) => cb('FAILED'));
          queue = [];
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      // wait for refresh
      return new Promise((resolve, reject) => {
        queue.push((t: string) => {
          if (t === 'FAILED') {
            reject(error);
          } else {
            original.headers.Authorization = `Bearer ${t}`;
            resolve(api(original));
          }
        });
      });
    }
    return Promise.reject(error);
  }
);

export default api;