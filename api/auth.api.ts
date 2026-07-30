import { LoginFormData, RegisterFormData } from '@/validation/auth.validation';
import api from './client';

export const registerApi = (data: RegisterFormData) => {
  return api.post('/v1/api/auth/register', data);
};

export const loginApi = (data: LoginFormData) => {
  return api.post('/v1/api/auth/login', data);
};
