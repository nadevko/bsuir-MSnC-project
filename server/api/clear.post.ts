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

  db.prepare("DELETE FROM carts WHERE user_id = ?").run(userId);

  return { ok: true };
});
