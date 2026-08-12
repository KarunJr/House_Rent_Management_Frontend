import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
  errors?: string[];
}

export function handleError(error: unknown) {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse;
    if (!error.response) {
      return {
        status: 0, // or null
        message: 'Unable to connect to the server. Please check if the backend is running.',
        errors: [],
      };
    }
    return {
      status: error.response?.status,
      message: apiError?.message ?? 'Something went wrong',
      errors: apiError?.errors ?? [],
    };
  }

  return {
    status: 500,
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    errors: [],
  };
}
