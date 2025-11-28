<template>
  <div class="container">
    <h1>
      Hello, <em>{{ displayName }}</em>
    </h1>

    <div v-if="!user">
      <h2>Register</h2>
      <form @submit.prevent="onRegister">
        <input v-model="registerForm.username" placeholder="Username" />
        <input v-model="registerForm.email" placeholder="Email" type="email" />
        <input
          v-model="registerForm.password"
          placeholder="Password"
          type="password"
        />
        <input
          v-model="registerForm.birthdate"
          placeholder="Birthdate YYYY-MM-DD"
          type="date"
        />
        <button type="submit" :disabled="auth.loading.register">
          Register
        </button>
      </form>

      <h2>Login</h2>
      <form @submit.prevent="onLogin">
        <input v-model="loginForm.email" placeholder="Email" type="email" />
        <input
          v-model="loginForm.password"
          placeholder="Password"
          type="password"
        />
        <button type="submit" :disabled="auth.loading.login">Login</button>
      </form>
    </div>

    <div v-else>
      <button @click="onLogout" :disabled="auth.loading.logout">Logout</button>
      <button @click="onRefresh" :disabled="auth.loading.refresh">
        Refresh Me
      </button>
    </div>

    <div v-if="auth.error" class="error">{{ auth.error }}</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useAuth } from "~~/composables/useAuth";

const auth = useAuth();

const user = computed(() => auth.user.value);
const displayName = computed(() => user.value?.username ?? "Guest");

const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  birthdate: "",
});
const loginForm = reactive({ email: "", password: "" });

function validateRegisterForm(form: typeof registerForm) {
  if (!form.username.trim()) throw new Error("Username required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    throw new Error("Invalid email");
  if (form.password.length < 8) throw new Error("Password too short");

  const bd = new Date(form.birthdate);
  if (isNaN(bd.getTime())) throw new Error("Invalid birthdate");
  const age =
    (new Date().getTime() - bd.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  if (age < 14 || age > 120) throw new Error("Age must be between 14 and 120");
}

async function onRegister() {
  try {
    validateRegisterForm(registerForm);
    await auth.register({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      birthdate: registerForm.birthdate,
    });
    registerForm.username = "";
    registerForm.email = "";
    registerForm.password = "";
    registerForm.birthdate = "";
  } catch (e: any) {
    auth.error.value = e?.message || "Registration failed";
  }
}

async function onLogin() {
  try {
    await auth.login({ email: loginForm.email, password: loginForm.password });
    loginForm.email = "";
    loginForm.password = "";
  } catch (e: any) {
    auth.error.value = e?.message || "Login failed";
  }
}

async function onLogout() {
  try {
    await auth.logout();
  } catch {}
}

async function onRefresh() {
  await auth.fetchMe();
}

void auth.fetchMe();
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 2rem auto;
  font-family: sans-serif;
}
input {
  display: block;
  margin: 0.5rem 0;
  width: 100%;
  padding: 0.4rem;
}
button {
  margin-top: 0.5rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
