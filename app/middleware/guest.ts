import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, initFromToken } = useAuth();

  if (user.value === null) {
    try {
      await initFromToken();
    } catch {
      /* ignore */
    }
  }

  if (!user.value) {
    return navigateTo("/login");
  }
});
