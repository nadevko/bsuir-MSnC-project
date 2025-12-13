import db from "../utils/db";
import { getUserIdFromToken } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromToken(event);

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const cartItems = (await db
    .prepare(
      `SELECT c.user_id, c.product_id, c.size, c.amount, p.name, p.price, p.small_image
     FROM carts c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?
     ORDER BY c.product_id`,
    )
    .all(userId)) as Array<{
    user_id: string;
    product_id: number;
    size: number;
    amount: number;
    name: string;
    price: number;
    small_image: string;
  }>;

  return cartItems;
});
