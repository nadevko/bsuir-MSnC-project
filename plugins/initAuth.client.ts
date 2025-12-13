import { useAuthStore } from '../stores/auth'
import { getCookie } from 'h3'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(async (nuxtApp) => {
    const auth = useAuthStore()
    const event = nuxtApp.ssrContext?.event
    if (!event) return

    const token = getCookie(event, 'token') // правильно читаем HttpOnly куку
    if (token) {
        try {
            const user = await $fetch('/api/me', {
                headers: { Authorization: `Bearer ${token}` }, // для совместимости с твоим API
                credentials: 'include'
            })
            auth.user = user as { id: string; username: string; email: string }
        } catch (err) {
            auth.user = null
        }
    }
})
