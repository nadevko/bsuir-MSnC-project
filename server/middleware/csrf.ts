import { getCookie, getHeader, setResponseStatus } from "h3"
import { generateCsrfToken, setCsrfCookie } from "../utils/auth"

export default defineEventHandler((event) => {
    // Всегда генерируем свежий CSRF токен на GET запросах
    if (event.node.req.method === "GET") {
        const token = generateCsrfToken()
        setCsrfCookie(event, token)
        return
    }

    // Для POST/PUT/DELETE — проверяем CSRF токен
    if (["POST", "PUT", "DELETE"].includes(event.node.req.method || "")) {
        const cookieToken = getCookie(event, "csrf-token")
        const headerToken = getHeader(event, "x-csrf-token")

        // Если нет токена в куке или заголовке не совпадают, генерируем новый и отправляем
        if (!cookieToken) {
            const token = generateCsrfToken()
            setCsrfCookie(event, token)
            setResponseStatus(event, 403)
            throw createError({
                statusCode: 403,
                statusMessage: "CSRF token missing. Refresh and try again.",
            })
        }

        if (!headerToken || cookieToken !== headerToken) {
            const token = generateCsrfToken()
            setCsrfCookie(event, token)
            setResponseStatus(event, 403)
            throw createError({
                statusCode: 403,
                statusMessage: "CSRF validation failed",
            })
        }
    }
})