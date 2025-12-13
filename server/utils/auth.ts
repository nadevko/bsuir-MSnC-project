import jwt from "jsonwebtoken";
import { setCookie, getCookie, H3Event } from "h3";
import { useRuntimeConfig } from "#imports";
import db from "./db";
import type { User, Session } from "./types";
import crypto from "crypto";

interface TokenPayload {
  sub: string;
  username: string;
  email: string;
  jti: string;
}

export function getJwtConfig() {
  const config = useRuntimeConfig();
  return {
    secret: String(config.jwtSecret),
    expiresInSeconds:
      Number(config.jwtExpiresInSeconds) ||
      (typeof config.jwtExpiresIn === "string"
        ? parseInt(config.jwtExpiresIn) * 3600
        : 3600),
  };
}

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/* =======================
   TOKEN SIGNING
   ======================= */

export async function signToken(
  user: Pick<User, "id" | "username" | "email">,
  rememberMe: boolean = false,
) {
  const { secret, expiresInSeconds } = getJwtConfig();
  const jti = crypto.randomUUID();

  const tokenExpiresIn = rememberMe ? expiresInSeconds * 7 : expiresInSeconds;

  const token = jwt.sign(
    { sub: user.id, username: user.username, email: user.email, jti },
    secret,
    { expiresIn: `${tokenExpiresIn}s` },
  );

  const expiresAt = new Date(Date.now() + tokenExpiresIn * 1000);

  await db
    .prepare("INSERT INTO sessions (jti, userId, expiresAt) VALUES (?, ?, ?)")
    .run(jti, user.id, expiresAt.toISOString());

  return { token, expiresAt };
}

/* =======================
   COOKIES
   ======================= */

export function setTokenCookie(event: H3Event, token: string) {
  const { expiresInSeconds } = getJwtConfig();

  setCookie(event, "token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: expiresInSeconds,
    expires: new Date(Date.now() + expiresInSeconds * 1000),
  });
}

export function setCsrfCookie(event: H3Event, token: string) {
  setCookie(event, "csrf-token", token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

/* =======================
   AUTH HELPERS
   ======================= */

export async function getUserIdFromToken(
  event: H3Event,
): Promise<string | null> {
  const token = getCookie(event, "token");
  if (!token) return null;

  const { secret } = getJwtConfig();

  try {
    const payload = jwt.verify(token, secret) as TokenPayload;
    if (!payload.jti) return null;

    const session = (await db
      .prepare(
        "SELECT userId, expiresAt, invalidatedAt FROM sessions WHERE jti = ?",
      )
      .get(payload.jti)) as
      | Pick<Session, "userId" | "expiresAt" | "invalidatedAt">
      | undefined;

    if (!session || session.invalidatedAt) return null;

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      await db.prepare("DELETE FROM sessions WHERE jti = ?").run(payload.jti);
      return null;
    }

    return payload.sub;
  } catch {
    return null;
  }
}

export async function invalidateToken(event: H3Event): Promise<boolean> {
  const token = getCookie(event, "token");
  if (!token) return false;

  const { secret } = getJwtConfig();

  try {
    const payload = jwt.verify(token, secret) as TokenPayload;

    if (payload.jti) {
      await db
        .prepare(
          "UPDATE sessions SET invalidatedAt = datetime('now') WHERE jti = ?",
        )
        .run(payload.jti);
    }
  } catch {
    return false;
  }

  return true;
}

/* =======================
   CLEAR COOKIES
   ======================= */

export function clearTokenCookie(event: H3Event) {
  setCookie(event, "token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  setCookie(event, "csrf-token", "", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}
