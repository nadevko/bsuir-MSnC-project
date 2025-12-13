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

  if (!product_id || size === undefined || amount === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  if (amount < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: "Amount must be at least 1",
    });
  }

  await db
    .prepare(
      "UPDATE carts SET amount = ? WHERE user_id = ? AND product_id = ? AND size = ?",
    )
    .run(amount, userId, product_id, size);

  return { ok: true };
});
