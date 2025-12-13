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
  sizes: string;
  amount: number;
  availability?: boolean;
}

export interface Cart {
  user_id: string;
  product_id: number;
  size: number;
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

export interface Statement {
  run: (...params: any[]) => Promise<any>;
  get: (...params: any[]) => Promise<any | undefined>;
  all: (...params: any[]) => Promise<any[]>;
}

export interface DbAdapter {
  prepare: (sql: string) => Statement;
  pragma?: (pragma: string) => void | Promise<void>;
}
