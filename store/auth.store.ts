import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { LoginFormData, RegisterFormData } from '@/validation/auth.validation';
import { loginApi, registerApi, resendOtpApi, verifyEmailApi } from '@/api/auth.api';
import {
  LoginResponse,
  ResendOtpData,
  ResendOtpResponse,
  UserRegistrationResponse,
  UserResponseDto,
  VerifyEmailData,
  VerifyEmailResponse,
} from '@/types/auth.types';
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: UserResponseDto;

  checkAuth: () => Promise<void>;
  login: (data: LoginFormData) => Promise<LoginResponse>;
  register: (data: RegisterFormData) => Promise<UserRegistrationResponse>;
  verifyEmail: (data: VerifyEmailData) => Promise<VerifyEmailResponse>;
  resendOtp: (data: ResendOtpData) => Promise<ResendOtpResponse>;
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
}));
