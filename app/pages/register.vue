<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <header class="w-full py-6 flex justify-center">
      <NuxtLink to="/" class="flex items-center">
        <img src="/assets/logo.png" alt="Ezzy Step" class="h-12 object-contain" />
      </NuxtLink>
    </header>

    <main class="flex-grow flex items-center justify-center px-4">
      <form @submit.prevent="onRegister" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 w-full max-w-md space-y-6">
        <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Create Account</h1>

        <div v-if="errors.general" class="bg-red-100 text-red-700 p-3 rounded-md text-sm">
          ❌ {{ errors.general }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
            <input v-model="form.username" type="text" id="username" required :disabled="loading"
                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-200 disabled:dark:bg-gray-600"/>
            <p v-if="errors.username" class="text-red-600 text-sm mt-1">{{ errors.username }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input v-model="form.email" type="email" id="email" required :disabled="loading"
                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-200 disabled:dark:bg-gray-600"/>
            <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
            <input v-model="form.password" type="password" id="password" required :disabled="loading"
                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-200 disabled:dark:bg-gray-600"/>
            <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <div>
            <label for="birthdate" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Birthdate</label>
            <input v-model="form.birthdate" type="date" id="birthdate" required :disabled="loading"
                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-200 disabled:dark:bg-gray-600"/>
            <p v-if="errors.birthdate" class="text-red-600 text-sm mt-1">{{ errors.birthdate }}</p>
          </div>
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <p class="text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?
          <NuxtLink to="/login" class="font-medium hover:underline">Log in</NuxtLink>
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

const form = reactive({ username: '', email: '', password: '', birthdate: '' })
const loading = ref(false)
const errors = reactive<{ general?: string; username?: string; email?: string; password?: string; birthdate?: string }>({})

async function onRegister() {
  loading.value = true
  try {
    const user = await $fetch('/api/register', {
      method: 'POST',
      body: form,
      credentials: 'include',
    })
    // после регистрации токен уже в HttpOnly куке
    await auth.fetchUser() // подтягиваем user в стор
    await router.push('/')
  } catch (err: any) {
    errors.general = err?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
