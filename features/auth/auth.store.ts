import { checkAuthApi, loginApi, registerApi, resendOtpApi, verifyEmailApi } from '@/features/auth/auth.api';
import {
  LoginResponse,
  ResendOtpData,
  ResendOtpResponse,
  UserRegistrationResponse,
  UserResponseDto,
  VerifyEmailData,
  VerifyEmailResponse,
} from '@/features/auth/auth.types';
import { LoginFormData, RegisterFormData } from '@/features/auth/auth.validation';
import * as SecureStore from 'expo-secure-store';
import { isAxiosError } from 'axios';
import { create } from 'zustand';
import { setSessionExpiredHandler } from '@/lib/client';
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  user: UserResponseDto | null;

  checkAuth: () => Promise<void>;
  login: (data: LoginFormData) => Promise<LoginResponse>;
  register: (data: RegisterFormData) => Promise<UserRegistrationResponse>;
  verifyEmail: (data: VerifyEmailData) => Promise<VerifyEmailResponse>;
  resendOtp: (data: ResendOtpData) => Promise<ResendOtpResponse>;
  logout: () => Promise<void>;
}
export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  isLoading: true,
  authError: null,
  user: null,

  checkAuth: async () => {
    set({ isLoading: true, authError: null });
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        set({ isAuthenticated: false, user: null });
        return;
      }

      try {
        const response = await checkAuthApi();
        set({ isAuthenticated: true, user: response.data });
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          await SecureStore.deleteItemAsync('accessToken');
          set({ isAuthenticated: false, user: null });
        } else {
          throw error;
        }
      }
    } catch {
      set({ authError: 'Unable to check your session. Please try again.' });
    } finally {
      set({ isLoading: false });
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

  register: async (data: RegisterFormData) => {
    try {
      const response = await registerApi<UserRegistrationResponse>(data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async (data: VerifyEmailData) => {
    try {
      const response = await verifyEmailApi<VerifyEmailResponse>(data);
      const result = response.data;
      if (result.success) {
        await SecureStore.setItemAsync('accessToken', result.token);
        set({ isAuthenticated: true, user: result.createdUser });
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  resendOtp: async (data: ResendOtpData) => {
    try {
      const response = await resendOtpApi<ResendOtpResponse>(data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      set({ user: null, isAuthenticated: false, authError: null });
    } catch (error) {
      throw error;
    }
  },
}));

// Keep store updates here to avoid a client → store → API → client import cycle.
setSessionExpiredHandler((authError) => {
  useAuthStore.setState({ user: null, isAuthenticated: false, authError: authError });
});
