<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
    <!-- Logo + nav -->
    <div class="flex items-center space-x-4">
      <NuxtLink to="/" class="flex items-center">
        <img src="/assets/logo.png" alt="Ezzy Step" class="h-10 w-auto" />
      </NuxtLink>
      <nav class="flex items-center space-x-3">
        <NuxtLink to="/catalog" :class="navLinkClass('/catalog')">Catalog</NuxtLink>
        <NuxtLink to="/about" :class="navLinkClass('/about')">About</NuxtLink>
      </nav>
    </div>

    <!-- Auth -->
    <div class="flex items-center space-x-3">
      <template v-if="user">
        <NuxtLink to="/profile" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          Profile
        </NuxtLink>
        <button @click="onLogout" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          Log Out
        </button>
      </template>
      <template v-else>
        <NuxtLink to="/register" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
          Register
        </NuxtLink>
        <NuxtLink to="/login" class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition">
          Log In
        </NuxtLink>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~~/stores/auth'

const auth = useAuthStore()
const route = useRoute()

const user = computed(() => auth.user)

function onLogout() {
  auth.logout()
}

function navLinkClass(path: string) {
  const base = 'px-3 py-2 rounded-md font-medium transition'
  const active = route.path === path ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
  return `${base} ${active}`
}
</script>
