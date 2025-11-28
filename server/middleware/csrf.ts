import { getCookie, getHeader, setResponseStatus } from "h3";
import { generateCsrfToken, setCsrfCookie } from "../utils/auth";

export default defineEventHandler((event) => {
  if (event.node.req.method === "GET") {
    const token = generateCsrfToken();
    setCsrfCookie(event, token);
    return;
  }

  if (event.node.req.url === "/api/refresh") {
    return;
  }

  if (["POST", "PUT", "DELETE"].includes(event.node.req.method || "")) {
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
