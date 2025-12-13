export interface CartItem {
  user_id?: string;
  product_id: number;
  size: number;
  amount: number;
  name?: string;
  price?: number;
  small_image?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}
