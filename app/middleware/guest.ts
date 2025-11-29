import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!import.meta.client) return;

  const auth = useAuth();
  await auth.fetchMe();

  if (auth.user.value) {
    return navigateTo("/");
  }
});
