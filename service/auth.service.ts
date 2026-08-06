import { loginApi, registerApi, resendOtpApi, verifyEmailApi } from '@/api/auth.api';
import {
  LoginResponse,
  ResendOtpData,
  ResendOtpResponse,
  UserRegistrationResponse,
  VerifyEmailData,
  VerifyEmailResponse,
} from '@/types/auth.types';
import { LoginFormData, RegisterFormData } from '@/validation/auth.validation';

export async function register(data: RegisterFormData) {
  const response = await registerApi<UserRegistrationResponse>(data);
  return response.data;
}

export async function verifyEmail(data: VerifyEmailData) {
  const response = await verifyEmailApi<VerifyEmailResponse>(data);
  return response.data;
}

export async function resendOtp(data: ResendOtpData) {
  const response = await resendOtpApi<ResendOtpResponse>(data);
  return response.data;
}

export async function login(data: LoginFormData) {
  const response = await loginApi<LoginResponse>(data);
  return response.data;
}
