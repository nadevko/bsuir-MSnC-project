import { H3Event } from "h3";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public field?: string,
  ) {
    super(message);
  }
}

export function handleValidationError(error: any) {
  if (error.field) {
    return new AppError(400, error.message, error.field);
  }
  if (error.statusCode) {
    return error as AppError;
  }
  return new AppError(500, "Internal server error");
}

export function sendErrorResponse(event: H3Event, error: AppError | Error) {
  if (error instanceof AppError) {
    setResponseStatus(event, error.statusCode);
    return {
      message: error.message,
      field: error.field,
    };
  }

  setResponseStatus(event, 500);
  return {
    message: "Internal server error",
  };
}
