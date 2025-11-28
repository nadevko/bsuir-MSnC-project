import { ref, reactive } from "vue";

export interface User {
  id: string;
  username: string;
  email?: string;
}

export function useAuth() {
  const user = ref<User | null>(null);
  const error = ref<string | null>(null);
  const loading = reactive({
    register: false,
    login: false,
    logout: false,
    refresh: false,
  });

  async function fetchMe() {
    loading.refresh = true;
    error.value = null;
    try {
      const data = await $fetch("/api/me");
      user.value = data ?? null;
    } catch {
      user.value = null;
    } finally {
      loading.refresh = false;
    }
  }

  async function register(payload: {
    username: string;
    email: string;
    password: string;
    birthdate: string;
  }) {
    loading.register = true;
    error.value = null;
    try {
      await $fetch("/api/register", { method: "POST", body: payload });
      await fetchMe();
    } catch (e: any) {
      error.value = e?.message || "Registration failed";
      throw e;
    } finally {
      loading.register = false;
    }
  }

  async function login(payload: { email: string; password: string }) {
    loading.login = true;
    error.value = null;
    try {
      await $fetch("/api/login", { method: "POST", body: payload });
      await fetchMe();
    } catch (e: any) {
      error.value = e?.message || "Login failed";
      throw e;
    } finally {
      loading.login = false;
    }
  }

  async function logout() {
    loading.logout = true;
    error.value = null;
    try {
      await $fetch("/api/logout", { method: "POST" });
      user.value = null;
    } catch (e: any) {
      error.value = e?.message || "Logout failed";
      throw e;
    } finally {
      loading.logout = false;
    }
  }

  return { user, error, loading, fetchMe, register, login, logout };
}
