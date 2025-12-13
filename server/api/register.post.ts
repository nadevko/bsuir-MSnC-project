import { readBody } from "h3";
import bcrypt from "bcrypt";
import crypto from "crypto";
import db from "../utils/db";
import type { User } from "../utils/types";
import { validateRegisterForm, ValidationError } from "../utils/validation";
import { signToken, setTokenCookie } from "../utils/auth";
import { handleValidationError, sendErrorResponse } from "../utils/errors";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    validateRegisterForm(body);

    const email = body.email.trim().toLowerCase();
    const username = body.username.trim();
    const password = body.password;

    const existing = await db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existing) {
      throw new ValidationError("email", "Email already registered");
    }

    const userId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    const birthdate = body.birthdate.split("T")[0];
    const createdAt = new Date().toISOString();

    const user: User = {
      id: userId,
      username,
      email,
      passwordHash,
      birthdate,
      createdAt,
    };

    await db
      .prepare(
        `INSERT INTO users (id, username, email, passwordHash, birthdate, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        user.id,
        user.username,
        user.email,
        user.passwordHash,
        user.birthdate,
        user.createdAt,
      );

    const { token } = await signToken(user);
    setTokenCookie(event, token);

    setResponseStatus(event, 201);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  } catch (error) {
    const appError = handleValidationError(error);
    return sendErrorResponse(event, appError);
  }
});
