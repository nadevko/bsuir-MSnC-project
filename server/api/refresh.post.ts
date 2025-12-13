import { getCookie } from "h3";
import jwt from "jsonwebtoken";
import db from "../utils/db";
import type { User } from "../utils/types";
import {
  getJwtConfig,
  signToken,
  setTokenCookie,
  generateCsrfToken,
  setCsrfCookie,
} from "../utils/auth";

const DEFAULT_ROTATE_IF_LESS_THAN_SEC = 60 * 60;

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
    } catch (err) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid or expired token",
      });
    }

    const userId = payload.sub;
    const jti = payload.jti;
    if (!userId || !jti) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token payload",
      });
    }

    const session = (await db
      .prepare("SELECT expiresAt, invalidatedAt FROM sessions WHERE jti = ?")
      .get(jti)) as
      | { expiresAt: string; invalidatedAt: string | null }
      | undefined;

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: "Session not found",
      });
    }

    if (session.invalidatedAt) {
      throw createError({
        statusCode: 401,
        statusMessage: "Session invalidated",
      });
    }

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      await db.prepare("DELETE FROM sessions WHERE jti = ?").run(jti);
      throw createError({ statusCode: 401, statusMessage: "Session expired" });
    }

    const user = (await db
      .prepare("SELECT id, username, email FROM users WHERE id = ?")
      .get(userId)) as User | undefined;

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "User not found" });
    }

    const expSec: number | undefined =
      typeof payload.exp === "number" ? payload.exp : undefined;
    const rotateIfLessThanSec =
      Number(process.env.JWT_ROTATE_IF_LESS_THAN_SEC) ||
      DEFAULT_ROTATE_IF_LESS_THAN_SEC;

    let rotated = false;

    if (!expSec) {
      rotated = true;
    } else {
      const nowMs = Date.now();
      const expMs = expSec * 1000;
      const remainingMs = expMs - nowMs;
      if (remainingMs < rotateIfLessThanSec * 1000) {
        rotated = true;
      } else {
        rotated = false;
      }
    }

    if (rotated) {
      const nowIso = new Date().toISOString();
      await db
        .prepare("UPDATE sessions SET invalidatedAt = ? WHERE jti = ?")
        .run(nowIso, jti);

      const { token: newToken } = await signToken(user);

      setTokenCookie(event, newToken);
      const csrfToken = generateCsrfToken();
      setCsrfCookie(event, csrfToken);
    } else {
      const csrfToken = generateCsrfToken();
      setCsrfCookie(event, csrfToken);
    }

    return { id: user.id, username: user.username, email: user.email, rotated };
  } catch (error: any) {
    if (error?.statusCode) throw error;
    console.error("Error in /api/refresh:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
