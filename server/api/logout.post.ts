import {
  invalidateToken,
  clearTokenCookie,
  generateCsrfToken,
  setCsrfCookie,
} from "../utils/auth";

export default defineEventHandler((event) => {
  try {
    invalidateToken(event);
  } catch {}

  clearTokenCookie(event);

  const newCsrfToken = generateCsrfToken();
  setCsrfCookie(event, newCsrfToken);

  return { ok: true };
});
