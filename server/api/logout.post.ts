import { invalidateToken, clearTokenCookie } from "../utils/auth";

export default defineEventHandler((event) => {
  try {
    invalidateToken(event);
  } catch {}

  clearTokenCookie(event);

  return { ok: true };
});
