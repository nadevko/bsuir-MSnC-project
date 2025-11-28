import db, { type User } from "../utils/db";
import { getUserIdFromToken } from "../utils/auth";

export default defineEventHandler((event) => {
  const userId = getUserIdFromToken(event);

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const user = db
    .prepare("SELECT id, username, email FROM users WHERE id = ?")
    .get(userId) as { id: string; username: string; email: string } | undefined;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  return user;
});
