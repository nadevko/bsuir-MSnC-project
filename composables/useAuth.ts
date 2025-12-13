import { reactive, computed } from "vue";
import type { User } from "../server/utils/types";

export function useAuth() {
  const userState = useState<User | null>("auth_user", () => null);

  const loading = reactive({
    login: false,
    register: false,
    init: false,
  });

  const errors = reactive<{ [k: string]: string | null }>({});

  function clearErrors() {
    for (const k of Object.keys(errors)) {
      delete errors[k];
    }
  }

  const user = computed(() => userState.value);
  const isAuthenticated = computed(() => !!userState.value);

  async function initFromToken() {
    if (userState.value) return userState.value;

    loading.init = true;
    clearErrors();

    try {
      const res = await $fetch("/api/refresh", { method: "POST" });
      if (res && res.id) {
        userState.value = res as User;
        return userState.value;
      } else {
        userState.value = null;
        return null;
      }
    } catch (err: any) {
      userState.value = null;

      return null;
    } finally {
      loading.init = false;
    }
  }

  async function login(payload: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) {
    loading.login = true;
    clearErrors();

    try {
      const res = await $fetch("/api/login", {
        method: "POST",
        body: payload,
      });

      userState.value = res as User;
      return userState.value;
    } catch (err: any) {
      if (err?.data) {
        if (typeof err.data === "object") {
          Object.assign(errors, err.data);
        } else {
          errors.general = String(err.data || err.message || "Login failed");
        }
      } else {
        errors.general = String(err?.message || "Login failed");
      }
      throw err;
    } finally {
      loading.login = false;
    }
  }

  async function register(payload: {
    username: string;
    email: string;
    password: string;
    birthdate: string;
  }) {
    loading.register = true;
    clearErrors();

    try {
      const res = await $fetch("/api/register", {
        method: "POST",
        body: payload,
      });
      userState.value = res as User;
      return userState.value;
    } catch (err: any) {
      if (err?.data) {
        if (typeof err.data === "object") {
          Object.assign(errors, err.data);
        } else {
          errors.general = String(
            err.data || err.message || "Registration failed",
          );
        }
      } else {
        errors.general = String(err?.message || "Registration failed");
      }
      throw err;
    } finally {
      loading.register = false;
    }
  }

  async function logout() {
    try {
      await $fetch("/api/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout API error:", err);
    } finally {
      userState.value = null;
    }
  }

  return {
    user: user,
    isAuthenticated,
    loading,
    errors,
    initFromToken,
    login,
    register,
    logout,
    clearErrors,
  };
}

export default useAuth;
