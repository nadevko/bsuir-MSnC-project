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
    .prepare("SELECT product_id, amount FROM carts WHERE user_id = ?")
    .all(userId)) as { product_id: number; amount: number }[];

  for (const item of cartItems) {
    await db
      .prepare(
        "UPDATE products SET amount = amount - ?, ordered_amount = ordered_amount + ? WHERE id = ?",
      )
      .run(item.amount, item.amount, item.product_id);
  }

  await db.prepare("DELETE FROM carts WHERE user_id = ?").run(userId);

  return { ok: true, itemsCheckedOut: cartItems.length };
});
