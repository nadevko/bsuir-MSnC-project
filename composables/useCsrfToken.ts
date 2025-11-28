import { ref } from "vue"

export function useCsrfToken() {
    const token = ref<string>("")

    // Берём токен из куки (он уже установлен плагином csrf.client.ts)
    const match = document.cookie.match(/csrf-token=([^;]+)/)
    if (match && match[1]) {
        token.value = decodeURIComponent(match[1])
    }

    function getHeader(): Record<string, string> {
        if (!token.value) return {}
        return { "x-csrf-token": token.value }
    }

    return { token, getHeader }
}