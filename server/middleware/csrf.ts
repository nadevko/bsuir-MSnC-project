import { getCookie, getHeader, setResponseStatus } from "h3";
import { generateCsrfToken, setCsrfCookie } from "../utils/auth";

export default defineEventHandler((event) => {
  const method = event.node.req.method || "";
  const url = event.node.req.url || "";

  if (method === "GET") {
    const existingToken = getCookie(event, "csrf-token");
    if (!existingToken) {
      const token = generateCsrfToken();
      setCsrfCookie(event, token);
    }
    return;
  }

  if (url === "/api/refresh") {
    return;
  }

  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    const cookieToken = getCookie(event, "csrf-token");
    const headerToken = getHeader(event, "x-csrf-token");

    if (!cookieToken) {
      const token = generateCsrfToken();
      setCsrfCookie(event, token);
      setResponseStatus(event, 403);
      throw createError({
        statusCode: 403,
        statusMessage: "CSRF token missing",
      });
    }

    if (!headerToken || cookieToken !== headerToken) {
      setResponseStatus(event, 403);
      throw createError({
        statusCode: 403,
        statusMessage: "CSRF validation failed",
      });
    }

    const newToken = generateCsrfToken();
    setCsrfCookie(event, newToken);
  }
});
