// composables/useTokenRefresh.ts
import { watch, onBeforeUnmount } from "vue";

/**
 * Safe token refresh:
 * - не делает немедленный refresh при первом появлении user (чтобы не создавать цикл)
 * - запускает периодический refresh 1 раз
 */
export function useTokenRefresh(userState: any, opts?: { intervalMs?: number }) {
  const intervalMs = opts?.intervalMs ?? 5 * 60 * 1000;
  let timer: ReturnType<typeof setInterval> | null = null;
  let initialSeen = false;

  async function doRefresh() {
    try {
      await $fetch("/api/refresh", { method: "POST" });
    } catch (err) {
      console.warn("Token refresh failed:", err);
    }
  }

  const stopWatch = watch(
    userState,
    (newUser) => {
      if (!newUser) {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        initialSeen = false;
        return;
      }

      // При первом появлении user — запускаем таймер, но НЕ делаем doRefresh() сразу
      if (!initialSeen) {
        initialSeen = true;
        if (!timer) {
          timer = setInterval(() => {
            void doRefresh();
          }, intervalMs);
        }
        return;
      }

      // Для последующих срабатываний (после логина) тоже включаем таймер если не включён
      if (!timer) {
        timer = setInterval(() => {
          void doRefresh();
        }, intervalMs);
      }
    },
    { immediate: false },
  );

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
    stopWatch();
  });

  return {
    refreshNow: doRefresh,
    stop: () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    },
  };
}

export default useTokenRefresh;
