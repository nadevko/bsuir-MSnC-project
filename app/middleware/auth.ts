import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, initFromToken } = useAuth();

  try {
    await initFromToken();
  } catch {
  }

  if (!user.value) {
    return navigateTo("/login");
  }
});
