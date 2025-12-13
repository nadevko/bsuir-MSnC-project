import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();

  // Если пользователь залогинен, редиректим на главную
  if (auth.user.value) {
    return navigateTo("/");
  }
});
