interface UserResponseDto {
  id: string;
  name: string;
  username: string;
  email: string;
}

export interface UserRegistrationResponse {
  message: string;
  emailSent: boolean;
  createdUser: UserResponseDto;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  createdUser: UserResponseDto;
  token: string;
}

export interface ResendOtpData {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
  emailSent: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: UserResponseDto;
  emailVerified?: boolean;
  token?: string;
}
