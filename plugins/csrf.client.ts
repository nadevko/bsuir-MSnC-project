import { defineNuxtPlugin } from "nuxt/app";
import { useAuth } from "../composables/useAuth";
import { useTokenRefresh } from "../composables/useTokenRefresh";

export default defineNuxtPlugin(async () => {
  try {
    await $fetch("/api/me").catch(() => {});
  } catch {}

  await new Promise((resolve) => setTimeout(resolve, 50));

  if (import.meta.client) {
    const auth = useAuth();
    useTokenRefresh(auth.user);
  }
});
