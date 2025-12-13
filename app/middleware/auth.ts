import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth();

  // Если пользователя нет, редиректим на login
  if (!user.value) {
    return navigateTo("/login");
  }
});
