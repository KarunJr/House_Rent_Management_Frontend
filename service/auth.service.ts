import { registerApi } from '@/api/auth.api';
import { RegisterFormData } from '@/validation/auth.validation';

export async function register(data: RegisterFormData) {
  const response = await registerApi(data);
  console.log('Response  body:', response);
  console.log('Response  data:', response.data);
  return response.data;
}

// export async function login(data: LoginFormData) {
//   const response = await loginApi(data);

//   const token = await SecureStore.setItemAsync(response.data.);
// }
