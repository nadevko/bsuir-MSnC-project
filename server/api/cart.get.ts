import db from "../utils/db";
import { getUserIdFromToken } from "../utils/auth";

export default defineEventHandler((event) => {
  const userId = getUserIdFromToken(event);

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const cartItems = db
    .prepare(
      `SELECT c.user_id, c.product_id, c.size, c.amount, p.name, p.price, p.small_image
     FROM carts c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?
     ORDER BY c.product_id`,
    )
    .all(userId);

  return cartItems;
});
