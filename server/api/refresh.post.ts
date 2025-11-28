import { getCookie } from "h3";
import jwt from "jsonwebtoken";
import db, { type User } from "../utils/db";
import {
  getJwtConfig,
  signToken,
  setTokenCookie,
  generateCsrfToken,
  setCsrfCookie,
} from "../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "token");

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "No token provided",
      });
    }

    const { secret } = getJwtConfig();

    let payload: any;
    try {
      payload = jwt.verify(token, secret);
    } catch {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token",
      });
    }

    const userId = payload.sub;
    const jti = payload.jti;

    const session = db
      .prepare("SELECT invalidatedAt FROM sessions WHERE jti = ?")
      .get(jti) as { invalidatedAt: string | null } | undefined;

    if (!session || session.invalidatedAt) {
      throw createError({
        statusCode: 401,
        statusMessage: "Session invalid",
      });
    }

    const user = db
      .prepare("SELECT id, username, email FROM users WHERE id = ?")
      .get(userId) as User | undefined;

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "User not found",
      });
    }

    db.prepare(
      "UPDATE sessions SET invalidatedAt = datetime('now') WHERE jti = ?",
    ).run(jti);

    const { token: newToken } = signToken(user);
    setTokenCookie(event, newToken);

    const csrfToken = generateCsrfToken();
    setCsrfCookie(event, csrfToken);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
