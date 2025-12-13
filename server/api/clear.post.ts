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

  await db.prepare("DELETE FROM carts WHERE user_id = ?").run(userId);

  return { ok: true };
});
