import { registerApi } from '@/api/auth.api';
import { RegisterFormData } from '@/validation/auth.validation';
interface UserResponseDto {
  id: string;
  name: string;
  username: string;
  email: string;
}

interface UserRegistrationResponse {
  message: string;
  emailSent: boolean;
  createdUser: UserResponseDto;
}

export async function register(data: RegisterFormData) {
  const response = await registerApi<UserRegistrationResponse>(data);
  // console.log('Response  body:', response);
  // console.log('Response  data:', response.data);
  return response.data;
}

// export async function login(data: LoginFormData) {
//   const response = await loginApi(data);

//   const token = await SecureStore.setItemAsync(response.data.);
// }
