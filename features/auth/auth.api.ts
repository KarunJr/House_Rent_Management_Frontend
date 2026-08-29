import { ResendOtpData, VerifyEmailData } from '@/features/auth/auth.types';
import { LoginFormData, RegisterFormData } from '@/features/auth/auth.validation';
import api from '../../lib/client';

export const registerApi = <T>(data: RegisterFormData) => {
  return api.post<T>('/v1/api/auth/register', data);
};

export const verifyEmailApi = <T>(data: VerifyEmailData) => {
  return api.post<T>('/v1/api/auth/verify-email', data);
};

export const resendOtpApi = <T>(data: ResendOtpData) => {
  return api.post<T>('/v1/api/auth/resend-otp', data);
};

export const loginApi = <T>(data: LoginFormData) => {
  return api.post<T>('/v1/api/auth/login', data);
};
