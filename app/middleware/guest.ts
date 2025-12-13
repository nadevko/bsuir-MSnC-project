import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth();

  try {
    await auth.initFromToken();
  } catch {
  }

  if (auth.user.value) {
    return navigateTo("/");
  }
});
