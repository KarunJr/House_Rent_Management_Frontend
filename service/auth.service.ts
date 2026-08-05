import { registerApi, resnedOtpApi, verifyEmailApi } from '@/api/auth.api';
import {
  ResendOtpData,
  ResendOtpResponse,
  UserRegistrationResponse,
  VerifyEmailData,
} from '@/types/auth.types';
import { ApiSuccessResponse } from '@/types/global.types';
import { RegisterFormData } from '@/validation/auth.validation';

export async function register(data: RegisterFormData) {
  const response = await registerApi<UserRegistrationResponse>(data);
  return response.data;
}

export async function verifyEmail(data: VerifyEmailData) {
  const response = await verifyEmailApi<ApiSuccessResponse>(data);
  return response.data;
}

export async function resnedOtp(data: ResendOtpData) {
  const response = await resnedOtpApi<ResendOtpResponse>(data);
  return response.data;
}
// export async function login(data: LoginFormData) {
//   const response = await loginApi(data);

//   const token = await SecureStore.setItemAsync(response.data.);
// }
