import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { LoginFormData } from '@/validation/auth.validation';
import { loginApi } from '@/api/auth.api';
import { LoginResponse, UserResponseDto } from '@/types/auth.types';
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: UserResponseDto;

  checkAuth: () => Promise<void>;

  login: (data: LoginFormData) => Promise<LoginResponse>;
}
export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      set({ isAuthenticated: !!token, isLoading: false });
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async (data: LoginFormData) => {
    try {
      const response = await loginApi<LoginResponse>(data);
      const result = response.data;
      if (result.success && result.token) {
        await SecureStore.setItemAsync('accessToken', result.token);
        set({ isAuthenticated: true, user: result.user });
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
}));
