export interface ApiErrorResponse {
  message: string;
  field?: string;
}

export type ApiError = ApiErrorResponse | string | null;

export function isNetworkError(error: any): boolean {
  return (
    error?.code === "ECONNREFUSED" ||
    error?.code === "ETIMEDOUT" ||
    error?.code === "ERR_NETWORK" ||
    !navigator.onLine
  );
}

export function isValidationError(error: any): boolean {
  return error?.status === 400;
}

export function isAuthError(error: any): boolean {
  return error?.status === 401 || error?.status === 403;
}

export function extractErrorMessage(error: any): string {
  if (error?.data?.message) {
    return error.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "Something went wrong";
}

export function extractFieldError(error: any): string | undefined {
  return error?.data?.field;
}
