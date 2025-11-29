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

  // Get all cart items
  const cartItems = db
    .prepare("SELECT product_id, amount FROM carts WHERE user_id = ?")
    .all(userId) as { product_id: number; amount: number }[];

  // Update product amounts and increment ordered_amount
  for (const item of cartItems) {
    db.prepare(
      "UPDATE products SET amount = amount - ?, ordered_amount = ordered_amount + ? WHERE id = ?",
    ).run(item.amount, item.amount, item.product_id);
  }

  // Clear cart
  db.prepare("DELETE FROM carts WHERE user_id = ?").run(userId);

  return { ok: true, itemsCheckedOut: cartItems.length };
});
