export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  birthdate: string;
  createdAt: string;
}

export interface UserPublic {
  id: string;
  username: string;
  email: string;
}

export interface Session {
  jti: string;
  userId: string;
  expiresAt: string;
  invalidatedAt?: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public statusMessage: string,
  ) {
    super(statusMessage);
  }
}
