import { readBody } from "h3";
import bcrypt from "bcrypt";
import db from "../utils/db";
import type { User } from "../utils/types";
import { validateLoginForm, ValidationError } from "../utils/validation";
import { signToken, setTokenCookie } from "../utils/auth";
import { handleValidationError, sendErrorResponse } from "../utils/errors";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    validateLoginForm(body);

    const email = body.email.trim().toLowerCase();
    const password = body.password;
    const rememberMe = body.rememberMe ?? false;

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as User | undefined;

    if (!user) {
      throw new ValidationError("email", "Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new ValidationError("password", "Invalid email or password");
    }

    const { token } = signToken(user, rememberMe);
    setTokenCookie(event, token);

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
