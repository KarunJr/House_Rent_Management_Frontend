import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
  errors?: string[];
}

export function handleError(error: unknown) {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse;
    
    return {
      status: error.response?.status,
      message: apiError?.message ?? 'Something went wrong',
      errors: apiError?.errors ?? [],
    };
  }

  return {
    status: null,
    message: 'Unexpected error occurred',
    errors: [],
  };
}
