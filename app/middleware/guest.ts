import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuth();

  if (auth.user.value) {
    return navigateTo("/");
  }
});
