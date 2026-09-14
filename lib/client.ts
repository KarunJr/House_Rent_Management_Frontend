import { create, isAxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

const baseURL = process.env.EXPO_PUBLIC_API_URL;
if (!baseURL) {
  throw new Error('EXPO_PUBLIC_API_URL is missing in your environment variables.');
}
const apiClient = create({
  baseURL: `${baseURL}/webservice`,
  timeout: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error('Failed to load access token from SecureStore', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

let sessionExpiredHandler: ((error: string | null) => void) | undefined;

export function setSessionExpiredHandler(handler: (error: string | null) => void) {
  sessionExpiredHandler = handler;
}

// /me already handles startup failures in checkAuth; public auth failures must
// not end an existing session.
const sessionCleanupExcludedPaths = new Set([
  '/v1/api/auth/me',
  '/v1/api/auth/login',
  '/v1/api/auth/register',
  '/v1/api/auth/verify-email',
  '/v1/api/auth/resend-otp',
]);
let sessionCleanup: Promise<void> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      const authorization = error.config?.headers?.Authorization;
      const path = error.config?.url?.split('?')[0];

      if (typeof authorization === 'string' && authorization.startsWith('Bearer ') && !sessionCleanupExcludedPaths.has(path ?? '')) {
        if (!sessionCleanup) {
          sessionCleanup = (async () => {
            try {
              const token = await SecureStore.getItemAsync('accessToken');
              // Ignore delayed responses from a previous login or logout.
              if (!token || authorization !== `Bearer ${token}`) return;
              await SecureStore.deleteItemAsync('accessToken');
              sessionExpiredHandler?.(null);
            } catch {
              sessionExpiredHandler?.('Unable to clear your expired session. Please try again.');
            }
          })().finally(() => {
            sessionCleanup = null;
          });
        }
        await sessionCleanup;
      }
    }

    // Preserve the API error for the requesting screen's error handling.
    return Promise.reject(error);
  },
);

export default apiClient;
