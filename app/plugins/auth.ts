// app/plugins/auth.ts
import { useAuth } from "~~/composables/useAuth";
import { useTokenRefresh } from "~~/composables/useTokenRefresh";

export default defineNuxtPlugin(async () => {
  const auth = useAuth();

  try {
    await auth.initFromToken();
  } catch (e) {
  }

  if (process.client) {
    setTimeout(() => {
      useTokenRefresh(auth.user, { intervalMs: 5 * 60 * 1000 });
    }, 200);
  }
});
