import { ref, reactive } from "vue"
import {
  isNetworkError,
  isAuthError,
  extractErrorMessage,
  extractFieldError,
} from "./useApiError"
import { useCsrfToken } from "./useCsrfToken"

export interface User {
  id: string
  username: string
  email: string
}

export interface FormErrors {
  general?: string
  username?: string
  email?: string
  password?: string
  birthdate?: string
}

export function useAuth() {
  const user = ref<User | null>(null)
  const networkError = ref<string | null>(null)

  const loading = reactive({
    register: false,
    login: false,
    logout: false,
    refresh: false,
  })

  const errors = reactive<FormErrors>({})

  function clearErrors() {
    errors.general = undefined
    errors.username = undefined
    errors.email = undefined
    errors.password = undefined
    errors.birthdate = undefined
    networkError.value = null
  }

  async function fetchMe() {
    try {
      const data = await $fetch<User>("/api/me")
      user.value = data ?? null
    } catch (e) {
      if (isAuthError(e)) {
        user.value = null
      }
    }
  }

  async function register(payload: {
    username: string
    email: string
    password: string
    birthdate: string
  }) {
    loading.register = true
    clearErrors()

    try {
      const { getHeader } = useCsrfToken()

      const userData = await $fetch<User>("/api/register", {
        method: "POST",
        body: payload,
        headers: getHeader(),
      })

      user.value = userData ?? null
    } catch (e: any) {
      if (isNetworkError(e)) {
        networkError.value = "Network error. Please check your connection."
      } else if (isAuthError(e)) {
        errors.general = "Session expired. Please try again."
        user.value = null
      } else {
        const msg = extractErrorMessage(e)
        const field = extractFieldError(e)

        if (field) {
          errors[field as keyof FormErrors] = msg
        } else {
          errors.general = msg
        }
      }
      throw e
    } finally {
      loading.register = false
    }
  }

  async function login(payload: { email: string; password: string }) {
    loading.login = true
    clearErrors()

    try {
      const { getHeader } = useCsrfToken()

      const userData = await $fetch<User>("/api/login", {
        method: "POST",
        body: payload,
        headers: getHeader(),
      })

      user.value = userData ?? null
    } catch (e: any) {
      if (isNetworkError(e)) {
        networkError.value = "Network error. Please check your connection."
      } else if (isAuthError(e)) {
        errors.general = "Session expired. Please try again."
        user.value = null
      } else {
        const msg = extractErrorMessage(e)
        const field = extractFieldError(e)

        if (field) {
          errors[field as keyof FormErrors] = msg
        } else {
          errors.general = msg
        }
      }
      throw e
    } finally {
      loading.login = false
    }
  }

  async function logout() {
    loading.logout = true
    clearErrors()

    try {
      const { getHeader } = useCsrfToken()
      await $fetch("/api/logout", {
        method: "POST",
        headers: getHeader(),
      })
      user.value = null
    } catch (e: any) {
      const msg = extractErrorMessage(e)
      errors.general = msg
      throw e
    } finally {
      loading.logout = false
    }
  }

  return {
    user,
    errors,
    networkError,
    loading,
    fetchMe,
    register,
    login,
    logout,
    clearErrors,
  }
}