import { ref, watch } from "vue";
import type { Ref } from "vue";
import type { AuthUser as User } from "../types/client";

export function useTokenRefresh(user: Ref<User | null>) {
  if (!import.meta.client) {
    return {
      isRefreshing: ref(false),
      cleanup: () => {},
    };
  }

  const isRefreshing = ref(false);
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  function getTokenExpiry(): number | null {
    try {
      const match = document.cookie.match(/token=([^;]+)/);
      if (!match?.[1]) return null;

      const [, payload] = match[1].split(".");
      if (!payload) return null;

      const data = JSON.parse(atob(payload)) as { exp?: number };
      return data.exp ? data.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  async function refreshToken() {
    // 🚨 HARD GUARD — NO USER → NO REFRESH
    if (!user.value || isRefreshing.value) return;

    isRefreshing.value = true;

    try {
      const updatedUser = await $fetch<User>("/api/refresh", {
        method: "POST",
      });

      user.value = updatedUser;
    } catch (e: any) {
      // 401 = session ended → logout silently
      if (e?.statusCode === 401) {
        user.value = null;
      }
    } finally {
      isRefreshing.value = false;
      scheduleNext();
    }
  }

  function scheduleNext() {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }

    if (!user.value) return;

    const expiry = getTokenExpiry();
    if (!expiry) return;

    const refreshInMs = expiry - Date.now() - 5 * 60 * 1000;

    if (refreshInMs <= 0) {
      refreshToken();
      return;
    }

    refreshTimer = setTimeout(refreshToken, refreshInMs);
  }

  watch(
    user,
    (u) => {
      if (!u) {
        if (refreshTimer) {
          clearTimeout(refreshTimer);
          refreshTimer = null;
        }
        return;
      }

      scheduleNext();
    },
    { immediate: false },
  );

  return {
    isRefreshing,
    cleanup() {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
      }
    },
  };
}
