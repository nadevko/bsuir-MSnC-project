// stores/auth.ts
import { defineStore } from "pinia"
import { useRequestHeaders } from "#app"

export interface AuthUser {
    id: string
    username: string
    email: string
    birthdate?: string
    createdAt?: string
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as AuthUser | null,
        isLoading: false,
        initialized: false, // важно
    }),

    getters: {
        isLoggedIn: (state) => !!state.user,
    },

    actions: {
        async fetchUser() {
            // защита от повторных вызовов
            if (this.initialized) return

            this.isLoading = true

            try {
                const headers =
                    process.server
                        ? useRequestHeaders(["cookie"])
                        : undefined

                this.user = await $fetch<AuthUser>("/api/me", {
                    credentials: "include",
                    headers,
                })
            } catch {
                this.user = null
            } finally {
                this.isLoading = false
                this.initialized = true
            }
        },

        async logout() {
            await $fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            })
            this.user = null
            this.initialized = false
        },
    },
})
