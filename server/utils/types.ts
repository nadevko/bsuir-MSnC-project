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

export interface Product {
  id: number;
  full_image: string;
  small_image: string;
  name: string;
  ordered_amount: number;
  price: number;
  sizes: string; // JSON stringified array
  amount: number;
  availability?: boolean; // computed
}

export interface Cart {
  user_id: string;
  product_id: number;
  amount: number;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public statusMessage: string,
  ) {
    super(statusMessage);
  }
}
