<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <header class="w-full py-6 flex justify-center">
      <NuxtLink to="/" class="flex items-center">
        <img src="/assets/logo.png" alt="Ezzy Step" class="h-12 object-contain" />
      </NuxtLink>
    </header>

    <main class="flex-grow flex items-center justify-center px-4">
      <form
        @submit.prevent="onLogin"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 w-full max-w-md space-y-6"
      >
        <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Welcome Back</h1>

        <div v-if="error" class="bg-red-100 text-red-700 p-3 rounded-md text-sm">
          ❌ {{ error }}
        </div>

        <div class="space-y-1">
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            required
            :disabled="loading"
            placeholder="Enter your email"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-200 disabled:dark:bg-gray-600"
          />
        </div>

        <div class="space-y-1">
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            required
            :disabled="loading"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-200 disabled:dark:bg-gray-600"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>

        <p class="text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?
          <NuxtLink to="/register" class="font-medium hover:underline">Sign up</NuxtLink>
        </p>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '~~/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)

async function onLogin() {
  error.value = null
  loading.value = true
  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: { email: form.email, password: form.password, rememberMe: true },
      credentials: 'include',
    })
    await auth.fetchUser() // подтягиваем user сразу после login
    await router.push('/')
  } catch (e: any) {
    error.value = e?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
