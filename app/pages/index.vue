<template>
  <div>
    <h1>Auth Test Page</h1>

    <div style="margin-bottom: 20px; padding: 10px; background: #f0f0f0">
      <h3>Current User Status</h3>
      <p><strong>Logged in:</strong> {{ user ? 'Yes' : 'No' }}</p>
      <p v-if="user"><strong>Username:</strong> {{ user.username }}</p>
      <p v-if="user"><strong>Email:</strong> {{ user.email }}</p>
      <p v-if="user"><strong>ID:</strong> {{ user.id }}</p>
    </div>

    <div style="margin-bottom: 20px">
      <h3>Messages</h3>
      <div v-if="auth.errors.general" style="color: red; padding: 10px; background: #ffe0e0; margin: 5px 0">
        ❌ {{ auth.errors.general }}
      </div>
      <div v-if="auth.networkError" style="color: orange; padding: 10px; background: #fff3cd; margin: 5px 0">
        ⚠️ {{ auth.networkError }}
      </div>
      <div v-if="auth.errors.username" style="color: red; padding: 10px; background: #ffe0e0; margin: 5px 0">
        ❌ Username: {{ auth.errors.username }}
      </div>
      <div v-if="auth.errors.email" style="color: red; padding: 10px; background: #ffe0e0; margin: 5px 0">
        ❌ Email: {{ auth.errors.email }}
      </div>
      <div v-if="auth.errors.password" style="color: red; padding: 10px; background: #ffe0e0; margin: 5px 0">
        ❌ Password: {{ auth.errors.password }}
      </div>
      <div v-if="auth.errors.birthdate" style="color: red; padding: 10px; background: #ffe0e0; margin: 5px 0">
        ❌ Birthdate: {{ auth.errors.birthdate }}
      </div>
      <div v-if="lastSuccess" style="color: green; padding: 10px; background: #e0ffe0; margin: 5px 0">
        ✅ {{ lastSuccess }}
      </div>
    </div>

    <template v-if="!user">
      <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc">
        <h2>Register</h2>
        <form @submit.prevent="onRegister">
          <div>
            <label>Username:</label>
            <input v-model="registerForm.username" placeholder="Username" required />
          </div>
          <div>
            <label>Email:</label>
            <input v-model="registerForm.email" type="email" placeholder="Email" required />
          </div>
          <div>
            <label>Password:</label>
            <input v-model="registerForm.password" type="password" placeholder="Password (min 8 chars)" required />
          </div>
          <div>
            <label>Birthdate:</label>
            <input v-model="registerForm.birthdate" type="date" required />
          </div>
          <button type="submit" :disabled="auth.loading.register">
            {{ auth.loading.register ? 'Registering...' : 'Register' }}
          </button>
        </form>
      </div>

      <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc">
        <h2>Login</h2>
        <form @submit.prevent="onLogin">
          <div>
            <label>Email:</label>
            <input v-model="loginForm.email" type="email" placeholder="Email" required />
          </div>
          <div>
            <label>Password:</label>
            <input v-model="loginForm.password" type="password" placeholder="Password" required />
          </div>
          <button type="submit" :disabled="auth.loading.login">
            {{ auth.loading.login ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>
    </template>

    <template v-else>
      <div style="padding: 10px; border: 1px solid #ccc">
        <h2>You are logged in</h2>
        <button @click="onLogout" :disabled="auth.loading.logout" style="margin-right: 10px">
          {{ auth.loading.logout ? 'Logging out...' : 'Logout' }}
        </button>
        <button @click="onRefresh" :disabled="auth.loading.refresh">
          {{ auth.loading.refresh ? 'Fetching...' : 'Fetch User Data' }}
        </button>
      </div>
    </template>

    <div style="margin-top: 30px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; font-size: 12px">
      <h4>Debug Info</h4>
      <p>Loading states: {{ auth.loading }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch } from "vue"
import { useAuth } from "~~/composables/useAuth"



const auth = useAuth()
const lastSuccess = ref("")

const user = computed(() => auth.user.value)

const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  birthdate: "",
})

const loginForm = reactive({
  email: "",
  password: "",
})

// Загружаем юзера при загрузке страницы
const { data: userData } = await useFetch("/api/me", {
  immediate: true,
  watch: false,
  retry: false,
})

watch(
  userData,
  (newData) => {
    if (newData) {
      auth.user.value = newData as any
    }
  },
  { immediate: true }
)

async function onRegister() {
  lastSuccess.value = ""
  try {
    await auth.register(registerForm)
    lastSuccess.value = "Registration successful!"
    registerForm.username = ""
    registerForm.email = ""
    registerForm.password = ""
    registerForm.birthdate = ""
  } catch {
    // Ошибки уже в auth.errors
  }
}

async function onLogin() {
  lastSuccess.value = ""
  try {
    await auth.login(loginForm)
    lastSuccess.value = "Login successful!"
    loginForm.email = ""
    loginForm.password = ""
  } catch {
    // Ошибки уже в auth.errors
  }
}

async function onLogout() {
  lastSuccess.value = ""
  try {
    await auth.logout()
    lastSuccess.value = "Logout successful!"
  } catch {}
}

async function onRefresh() {
  lastSuccess.value = ""
  try {
    await auth.fetchMe()
    lastSuccess.value = "User data fetched!"
  } catch {
    lastSuccess.value = "Failed to fetch user data!"
  }
}
</script>