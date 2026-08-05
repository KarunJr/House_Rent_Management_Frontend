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
  message: string;
}

export interface ResendOtpData {
  email: string;
}
export interface ResendOtpResponse {
  message: string;
  emailSent: boolean;
}
