import { reactive } from "vue";
import {
  isNetworkError,
  isAuthError,
  extractErrorMessage,
  extractFieldError,
} from "./useApiError";
import { useCsrfToken } from "./useCsrfToken";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface FormErrors {
  general?: string;
  username?: string;
  email?: string;
  password?: string;
  birthdate?: string;
}

// Функция для декодирования JWT токена на клиенте
function decodeJWT(token: string): User | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Payload = parts[1];
    if (!base64Payload) return null;

    const payload = JSON.parse(atob(base64Payload));

    // Проверяем, не истек ли токен
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    // Возвращаем данные пользователя из токена
    return {
      id: payload.sub || "",
      username: payload.username || "",
      email: payload.email || "",
    };
  } catch {
    return null;
  }
}

// Функция для получения токена из cookies на клиенте
function getTokenFromCookie(): string | null {
  if (!import.meta.client) return null;

  const match = document.cookie.match(/token=([^;]+)/);
  return match?.[1] ?? null;
}

// Инициализируем пользователя из токена ТОЛЬКО на клиенте
function initUserFromToken(): User | null {
  if (!import.meta.client) return null;

  const token = getTokenFromCookie();
  if (!token) return null;

  return decodeJWT(token);
}

export function useAuth() {
  // ВАЖНО: просто null, без функции инициализации
  // Инициализация произойдёт в плагине
  const user = useState<User | null>("auth-user", () => null);

  const loading = useState("auth-loading", () => ({
    register: false,
    login: false,
    logout: false,
    refresh: false,
  }));

  const errors = reactive<FormErrors>({});

  function clearErrors() {
    errors.general = undefined;
    errors.username = undefined;
    errors.email = undefined;
    errors.password = undefined;
    errors.birthdate = undefined;
  }

  // Инициализация пользователя из токена (вызывается из плагина)
  function initFromToken() {
    if (!user.value) {
      const userData = initUserFromToken();
      if (userData) {
        user.value = userData;
      }
    }
  }

  async function register(payload: {
    username: string;
    email: string;
    password: string;
    birthdate: string;
  }) {
    loading.value.register = true;
    clearErrors();

    try {
      const csrfComposable = useCsrfToken();

      const userData = await $fetch<User>("/api/register", {
        method: "POST",
        body: payload,
        headers: csrfComposable.getHeader(),
      });

      user.value = userData ?? null;
    } catch (e: any) {
      if (isNetworkError(e)) {
        errors.general = "Network error. Please check your connection.";
      } else if (isAuthError(e)) {
        errors.general = "Session expired. Please try again.";
        user.value = null;
      } else {
        const msg = extractErrorMessage(e);
        const field = extractFieldError(e);

        if (field) {
          errors[field as keyof FormErrors] = msg;
        } else {
          errors.general = msg;
        }
      }
      throw e;
    } finally {
      loading.value.register = false;
    }
  }

  async function login(payload: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) {
    loading.value.login = true;
    clearErrors();

    try {
      const csrfComposable = useCsrfToken();

      const userData = await $fetch<User>("/api/login", {
        method: "POST",
        body: payload,
        headers: csrfComposable.getHeader(),
      });

      user.value = userData ?? null;
    } catch (e: any) {
      if (isNetworkError(e)) {
        errors.general = "Network error. Please check your connection.";
      } else if (isAuthError(e)) {
        errors.general = "Session expired. Please try again.";
        user.value = null;
      } else {
        const msg = extractErrorMessage(e);
        const field = extractFieldError(e);

        if (field) {
          errors[field as keyof FormErrors] = msg;
        } else {
          errors.general = msg;
        }
      }
      throw e;
    } finally {
      loading.value.login = false;
    }
  }

  async function logout() {
    loading.value.logout = true;
    clearErrors();

    try {
      const csrfComposable = useCsrfToken();

      await $fetch("/api/logout", {
        method: "POST",
        headers: csrfComposable.getHeader(),
      });
      user.value = null;
    } catch (e: any) {
      const msg = extractErrorMessage(e);
      errors.general = msg;
      throw e;
    } finally {
      loading.value.logout = false;
    }
  }

  return {
    user,
    errors,
    loading,
    initFromToken,
    register,
    login,
    logout,
    clearErrors,
  };
}
