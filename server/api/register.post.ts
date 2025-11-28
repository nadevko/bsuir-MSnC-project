import db, { User } from "../utils/db";
import bcrypt from "bcrypt";
import { readBody } from "h3";
import { signToken, setTokenCookie } from "../utils/auth";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseBirthdate(dateStr: string): Date | null {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  const now = new Date();
  const age = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  if (age < 14 || age > 122) return null;

  return d;
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Record<string, any>;

  const username = String(body?.username ?? "").trim();
  const email = String(body?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(body?.password ?? "");
  const birthdateStr = String(body?.birthdate ?? "").trim();

  if (!username)
    throw createError({ statusCode: 400, statusMessage: "Username required" });
  if (!isValidEmail(email))
    throw createError({ statusCode: 400, statusMessage: "Invalid email" });
  if (password.length < 8)
    throw createError({ statusCode: 400, statusMessage: "Password too short" });

  const birthdate = parseBirthdate(birthdateStr);
  if (!birthdate)
    throw createError({ statusCode: 400, statusMessage: "Invalid birthdate" });

  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  const existing = stmt.get(email) as User | undefined;
  if (existing)
    throw createError({
      statusCode: 409,
      statusMessage: "Email already registered",
    });

  const passwordHash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const user: User = {
    id,
    username,
    email,
    passwordHash,
    birthdate: birthdate.toISOString().slice(0, 10),
    createdAt,
  };

  db.prepare(
    `INSERT INTO users (id, username, email, passwordHash, birthdate, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    user.id,
    user.username,
    user.email,
    user.passwordHash,
    user.birthdate,
    user.createdAt,
  );

  const token = signToken(user);
  setTokenCookie(event, token);

  event.node.res.statusCode = 201;
  return { id: user.id, username: user.username, email: user.email };
});
