// stores/auth.ts
import { defineStore } from "pinia";
import { useRequestHeaders, useCookie } from "#app";

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    birthdate?: string;
    createdAt?: string;
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as AuthUser | null,
        isLoading: false,
        initialized: false,
        csrfToken: null as string | null,
    }),

    getters: {
        isLoggedIn: (state) => !!state.user,
    },

    actions: {
        // Считываем csrf-token: на сервере — из заголовка cookie, на клиенте — из useCookie
        readCsrfFromRequest() {
            // server-side: useRequestHeaders возвращает объект с ключами в нижнем регистре
            if (process.server) {
                try {
                    const headers = useRequestHeaders(["cookie"]) as Record<string, string | undefined> | undefined;
                    const cookieHeader = headers?.cookie ?? "";
                    const match = cookieHeader.match(/(?:^|;\s*)csrf-token=([^;]+)/);
                    if (match && match[1]) {
                        this.csrfToken = decodeURIComponent(match[1]);
                        return;
                    }
                } catch (e) {
                    // ignore
                }
            } else {
                // client-side: читаем куку напрямую
                try {
                    const c = useCookie("csrf-token");
                    if (c && c.value) {
                        this.csrfToken = String(c.value);
                        return;
                    }
                } catch (e) {
                    // ignore
                }
            }
            this.csrfToken = null;
        },

        // Возвращаем корректный объект заголовков. NEVER return { "x-csrf-token": undefined }
        getCsrfHeader(): Record<string, string> {
            return this.csrfToken ? { "x-csrf-token": this.csrfToken } : {};
        },

        async fetchUser() {
            if (this.initialized) return;

            this.isLoading = true;

            try {
                // read CSRF before any server fetch so SSR code has token available
                this.readCsrfFromRequest();

                const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;

                this.user = await $fetch<AuthUser>("/api/me", {
                    credentials: "include",
                    headers,
                });

                // After a successful /api/me call, try to refresh csrfToken from cookie on client
                if (process.client) {
                    try {
                        const c = useCookie("csrf-token");
                        if (c && c.value) this.csrfToken = String(c.value);
                    } catch { }
                } else {
                    // on server re-read
                    this.readCsrfFromRequest();
                }
            } catch {
                this.user = null;
            } finally {
                this.isLoading = false;
                this.initialized = true;
            }
        },

        async logout() {
            const headers = this.getCsrfHeader();
            await $fetch("/api/logout", {
                method: "POST",
                credentials: "include",
                headers,
            });
            this.user = null;
            this.initialized = false;
            this.csrfToken = null;
        },
    },
});
