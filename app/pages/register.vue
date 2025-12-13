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
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
            <input v-model="form.username" type="text" id="username" required :disabled="loading"
                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-200 disabled:dark:bg-gray-600"/>
            <ul class="mt-2 text-sm">
              <li :class="usernameValid ? 'text-green-600' : 'text-red-600'">• At least 3 characters</li>
            </ul>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input v-model="form.email" type="email" id="email" required :disabled="loading"
                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-200 disabled:dark:bg-gray-600"/>
            <ul class="mt-2 text-sm">
              <li :class="emailValid ? 'text-green-600' : 'text-red-600'">• Must be a valid email</li>
            </ul>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
            <input v-model="form.password" type="password" id="password" required :disabled="loading"
                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-200 disabled:dark:bg-gray-600"/>
            <ul class="mt-2 space-y-1 text-sm">
              <li :class="passwordChecks.length ? 'text-green-600' : 'text-red-600'">• At least 8 characters</li>
              <li :class="passwordChecks.upper ? 'text-green-600' : 'text-red-600'">• One uppercase letter</li>
              <li :class="passwordChecks.lower ? 'text-green-600' : 'text-red-600'">• One lowercase letter</li>
              <li :class="passwordChecks.number ? 'text-green-600' : 'text-red-600'">• One number</li>
              <li :class="passwordChecks.special ? 'text-green-600' : 'text-red-600'">• One special character (!@#$%^&*)</li>
            </ul>
          </div>

          <!-- Birthdate -->
          <div>
            <label for="birthdate" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Birthdate</label>
            <input v-model="form.birthdate" type="date" id="birthdate" required :disabled="loading"
                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-200 disabled:dark:bg-gray-600"/>
            <ul class="mt-2 text-sm">
              <li :class="birthYearValid ? 'text-green-600' : 'text-red-600'">• Year between 1900 and {{ new Date().getFullYear() }}</li>
            </ul>
          </div>
        </div>

        <button type="submit" :disabled="loading || !formValid" class="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
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
import { reactive, ref, computed, watch } from 'vue'
import { useAuthStore } from '~~/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({ username: '', email: '', password: '', birthdate: '' })
const loading = ref(false)
const errors = reactive<{ general?: string; username?: string; email?: string; password?: string; birthdate?: string }>({})

// Password validation
const passwordChecks = reactive({
  length: false,
  upper: false,
  lower: false,
  number: false,
  special: false
})

watch(() => form.password, (val) => {
  passwordChecks.length = val.length >= 8
  passwordChecks.upper = /[A-Z]/.test(val)
  passwordChecks.lower = /[a-z]/.test(val)
  passwordChecks.number = /\d/.test(val)
  passwordChecks.special = /[!@#$%^&*]/.test(val)
})

// Username, Email, Birthdate checks
const usernameValid = computed(() => form.username.length >= 3)
const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
const birthYearValid = computed(() => {
  if (!form.birthdate) return false
  const year = new Date(form.birthdate).getFullYear()
  return year >= 1900 && year <= new Date().getFullYear()
})

const formValid = computed(() => passwordValid.value && usernameValid.value && emailValid.value && birthYearValid.value)
const passwordValid = computed(() => Object.values(passwordChecks).every(Boolean))

async function onRegister() {
  if (!formValid.value) {
    errors.general = 'Please fix the highlighted fields'
    return
  }

  loading.value = true
  errors.general = undefined

  try {
    const user = await $fetch('/api/register', {
      method: 'POST',
      body: form,
      credentials: 'include',
    })
    await auth.fetchUser()
    await router.push('/')
  } catch (err: any) {
    errors.general = err?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
ul li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
