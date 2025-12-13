import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth();

  if (!auth.user.value) {
    await auth.initFromToken();
  }

  if (!auth.user.value) {
    return navigateTo("/login");
  }
});
