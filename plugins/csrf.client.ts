import { defineNuxtPlugin } from "nuxt/app"

export default defineNuxtPlugin(async (nuxtApp) => {
    // При загрузке приложения делаем GET запрос чтобы получить CSRF токен
    try {
        await $fetch("/api/me").catch(() => {
            // Нам нужен только CSRF токен в куке, ошибки не важны
        })
    } catch {
        // Ignore
    }
})