import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | { id: string; username: string; email: string },
        isLoading: false,
    }),
    getters: {
        isLoggedIn: (state) => !!state.user,
    },
    actions: {
        async fetchUser() {
            this.isLoading = true
            try {
                const user = await $fetch('/api/me', { credentials: 'include' })
                this.user = user
            } catch {
                this.user = null
            } finally {
                this.isLoading = false
            }
        },
        async logout() {
            await $fetch('/api/logout', { method: 'POST', credentials: 'include' })
            this.user = null
        },
    },
})
