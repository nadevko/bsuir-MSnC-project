import { readBody } from "h3";
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

  const body = await readBody(event);
  const { product_id, size, amount } = body;

  if (!product_id || size === undefined || !amount) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  const product = await db
    .prepare("SELECT id FROM products WHERE id = ?")
    .get(product_id);
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product not found",
    });
  }

  const existing = (await db
    .prepare(
      "SELECT amount FROM carts WHERE user_id = ? AND product_id = ? AND size = ?",
    )
    .get(userId, product_id, size)) as { amount: number } | undefined;

  if (existing) {
    await db
      .prepare(
        "UPDATE carts SET amount = amount + ? WHERE user_id = ? AND product_id = ? AND size = ?",
      )
      .run(amount, userId, product_id, size);
  } else {
    await db
      .prepare(
        "INSERT INTO carts (user_id, product_id, size, amount) VALUES (?, ?, ?, ?)",
      )
      .run(userId, product_id, size, amount);
  }

  return { ok: true };
});
