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
  const { product_id, size } = body;

  if (!product_id || size === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  db.prepare(
    "DELETE FROM carts WHERE user_id = ? AND product_id = ? AND size = ?",
  ).run(userId, product_id, size);

  return { ok: true };
});
