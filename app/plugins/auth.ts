import { useAuth } from "~~/composables/useAuth";
import { useTokenRefresh } from "~~/composables/useTokenRefresh";

export default defineNuxtPlugin(() => {
  // Инициализируем пользователя СИНХРОННО на клиенте
  if (import.meta.client) {
    const auth = useAuth();

    // Это выполнится ДО первого рендера
    auth.initFromToken();

    // Запускаем token refresh
    useTokenRefresh(auth.user);
  }
});
