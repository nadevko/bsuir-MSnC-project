<template>
  <div>
    <!-- Minimal HEADER with only logo -->
    <header class="header">
      <div class="logo-center">
        <NuxtLink to="/" class="logo-link">
          <img
            src="/assets/logo.png"
            alt="Ezzy Step"
            class="logo logo-desktop"
          />
          <img
            src="/assets/logo.png"
            alt="Ezzy Step"
            class="logo logo-mobile"
          />
        </NuxtLink>
      </div>
    </header>

    <!-- Login Form -->
    <main>
      <div class="login-container">
        <form class="login-form" @submit.prevent="onLogin">
          <h1 class="form-title">Welcome Back</h1>

          <div v-if="auth.errors.general" class="error-message">
            ❌ {{ auth.errors.general }}
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="form-input"
              placeholder="Enter your email"
              required
              :disabled="auth.loading.login"
            />
            <div v-if="auth.errors.email" class="field-error">
              {{ auth.errors.email }}
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              class="form-input"
              placeholder="Enter your password"
              required
              :disabled="auth.loading.login"
            />
            <div v-if="auth.errors.password" class="field-error">
              {{ auth.errors.password }}
            </div>
          </div>

          <div class="form-options">
            <div class="remember-me">
              <input v-model="rememberMe" type="checkbox" id="remember" />
              <label for="remember">Remember me</label>
            </div>
            <NuxtLink href="#" class="forgot-password"
              >Forgot password?</NuxtLink
            >
          </div>

          <button
            type="submit"
            class="form-submit"
            :disabled="auth.loading.login"
          >
            {{ auth.loading.login ? "Logging in..." : "Log In" }}
          </button>

          <div class="form-footer">
            <p>
              Don't have an account? <NuxtLink to="/register">Sign up</NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAuth } from "~~/composables/useAuth";

// ОТКЛЮЧАЕМ Layout по умолчанию, чтобы не было двойного хедера
definePageMeta({
  middleware: "guest",
  layout: false,
});

const auth = useAuth();
const rememberMe = ref(false);
const form = reactive({
  email: "",
  password: "",
});

async function onLogin() {
  try {
    auth.clearErrors();
    await auth.login({
      email: form.email,
      password: form.password,
      rememberMe: rememberMe.value,
    });
    await navigateTo("/");
  } catch (error) {
    console.error("Login failed:", error);
  }
}
</script>

<style scoped>
/* Стили остаются без изменений, так как хедер здесь уникальный (минималистичный) */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  color: #111;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  width: 100%;
  margin: 18px 0;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
}

.logo-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 60px;
  width: auto;
  display: block;
  object-fit: contain;
}

.logo-mobile {
  display: none;
}

.logo-link {
  text-decoration: none;
}

/* Login form */
.login-container {
  width: 100%;
  max-width: 500px;
  margin: auto;
  padding: 0 20px;
}

.login-form {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
}

.error-message {
  color: #d32f2f;
  padding: 10px;
  background: #ffebee;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.warning-message {
  color: #f57c00;
  padding: 10px;
  background: #fff3e0;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #3a3a3a;
  outline: none;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.field-error {
  color: #d32f2f;
  font-size: 13px;
  margin-top: 5px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 8px;
  width: 18px;
  height: 18px;
}

.forgot-password {
  color: #3a3a3a;
  text-decoration: none;
  font-size: 14px;
  transition: text-decoration 0.3s;
}

.forgot-password:hover {
  text-decoration: underline;
}

.form-submit {
  width: 100%;
  padding: 14px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.form-submit:hover:not(:disabled) {
  background: #333;
}

.form-submit:disabled {
  background: #999;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
}

.form-footer a {
  color: #3a3a3a;
  text-decoration: none;
  font-weight: 600;
  transition: text-decoration 0.3s;
}

.form-footer a:hover {
  text-decoration: underline;
}

/* Mobile */
@media (max-width: 768px) {
  .header {
    margin: 12px 0;
    padding: 8px 0;
  }

  .logo-desktop {
    display: none;
  }

  .logo-mobile {
    display: block;
    height: 38px;
  }

  .login-container {
    margin: 20px auto;
    padding: 0 15px;
  }

  .login-form {
    padding: 20px;
  }

  .form-title {
    font-size: 28px;
    margin-bottom: 25px;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>
