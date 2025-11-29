import { readBody } from "h3";
import db from "../utils/db";
import { getUserIdFromToken } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const userId = getUserIdFromToken(event);

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const body = await readBody(event);
  const { product_id, size, amount } = body;

  if (!product_id || !size || !amount) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  // Check if product exists
  const product = db
    .prepare("SELECT id FROM products WHERE id = ?")
    .get(product_id);
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product not found",
    });
  }

  // Check if item already in cart
  const existing = db
    .prepare(
      "SELECT amount FROM carts WHERE user_id = ? AND product_id = ? AND size = ?",
    )
    .get(userId, product_id, size) as { amount: number } | undefined;

  if (existing) {
    // Update amount
    db.prepare(
      "UPDATE carts SET amount = amount + ? WHERE user_id = ? AND product_id = ? AND size = ?",
    ).run(amount, userId, product_id, size);
  } else {
    // Insert new cart item
    db.prepare(
      "INSERT INTO carts (user_id, product_id, size, amount) VALUES (?, ?, ?, ?)",
    ).run(userId, product_id, size, amount);
  }

  return { ok: true };
});
