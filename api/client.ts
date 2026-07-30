import { create } from 'axios';
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
      const token = await SecureStore.getItemAsync('token');
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

export default apiClient;
