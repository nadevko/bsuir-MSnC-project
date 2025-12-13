import { ref, watch } from "vue";
import type { Ref } from "vue";
import type { User } from "./useAuth";

export function useTokenRefresh(user: Ref<User | null>) {
  if (!import.meta.client) return { isRefreshing: ref(false) };

  const isRefreshing = ref(false);
  let refreshInterval: ReturnType<typeof setInterval> | null = null;

  function getTokenExpiry(): number | null {
    try {
      const match = document.cookie.match(/token=([^;]+)/);
      if (!match || !match[1]) return null;

      const token = match[1];
      const parts = token.split(".");
      if (parts.length !== 3 || !parts[1]) return null;

      const payload = JSON.parse(atob(parts[1])) as {
        exp?: number;
      };

      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  async function refreshToken() {
    if (isRefreshing.value || !user.value) return;

    isRefreshing.value = true;

    try {
      const response = await $fetch<User>("/api/refresh", {
        method: "POST",
      });
      user.value = response;
    } catch (e) {
      user.value = null;
    } finally {
      isRefreshing.value = false;
      scheduleNextRefresh();
    }
  }

  function scheduleNextRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    if (!user.value) return;

    const expiry = getTokenExpiry();
    if (!expiry) return;

    const refreshIn = expiry - Date.now() - 5 * 60 * 1000;

    if (refreshIn <= 0) {
      refreshToken();
      return;
    }

    refreshInterval = setInterval(() => {
      refreshToken();
    }, refreshIn);
  }

  watch(
    user,
    () => {
      scheduleNextRefresh();
    },
    { deep: true },
  );

  return {
    isRefreshing,
    cleanup: () => {
      if (refreshInterval) clearInterval(refreshInterval);
    },
  };
}
