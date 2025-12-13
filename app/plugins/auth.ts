import { useAuth } from "~~/composables/useAuth";
import { useTokenRefresh } from "~~/composables/useTokenRefresh";

export default defineNuxtPlugin(async () => {
  const auth = useAuth();

  try {
    await auth.initFromToken();
  } catch (e) {}

  if (process.client) {
    useTokenRefresh(auth.user);
  }
});
