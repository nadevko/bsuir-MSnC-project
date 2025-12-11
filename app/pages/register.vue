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

    <!-- Registration Form -->
    <main>
      <div class="register-container">
        <form class="register-form" @submit.prevent="onRegister">
          <h1 class="form-title">Create Account</h1>

          <div v-if="auth.errors.general" class="error-message">
            ❌ {{ auth.errors.general }}
          </div>

          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input
              v-model="form.username"
              type="text"
              id="username"
              class="form-input"
              placeholder="Enter your username"
              required
              :disabled="auth.loading.register"
            />
            <div v-if="auth.errors.username" class="field-error">
              {{ auth.errors.username }}
            </div>
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
              :disabled="auth.loading.register"
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
              placeholder="Create a password (min 8 chars)"
              required
              :disabled="auth.loading.register"
            />
            <div v-if="auth.errors.password" class="field-error">
              {{ auth.errors.password }}
            </div>
          </div>

          <div class="form-group">
            <label for="birthdate" class="form-label">Birthdate</label>
            <input
              v-model="form.birthdate"
              type="date"
              id="birthdate"
              class="form-input"
              required
              :disabled="auth.loading.register"
            />
            <div v-if="auth.errors.birthdate" class="field-error">
              {{ auth.errors.birthdate }}
            </div>
          </div>

          <button
            type="submit"
            class="form-submit"
            :disabled="auth.loading.register"
          >
            {{
              auth.loading.register ? "Creating Account..." : "Create Account"
            }}
          </button>

          <div class="form-footer">
            <p>
              Already have an account? <NuxtLink to="/login">Log in</NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useAuth } from "~~/composables/useAuth";

// ОТКЛЮЧАЕМ Layout по умолчанию
definePageMeta({
  middleware: "guest",
  layout: false,
});

const auth = useAuth();
const form = reactive({
  username: "",
  email: "",
  password: "",
  birthdate: "",
});

async function onRegister() {
  try {
    auth.clearErrors();
    await auth.register({
      username: form.username,
      email: form.email,
      password: form.password,
      birthdate: form.birthdate,
    });
    await navigateTo("/");
  } catch (error) {
    console.error("Registration failed:", error);
  }
}
</script>

<style scoped>
/* Стили остаются без изменений, так как хедер здесь уникальный */
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

/* Register form */
.register-container {
  width: 100%;
  max-width: 500px;
  margin: 40px auto;
  padding: 0 20px;
}

.register-form {
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
  margin-top: 20px;
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

  .register-container {
    margin: 20px auto;
    padding: 0 15px;
  }

  .register-form {
    padding: 20px;
  }

  .form-title {
    font-size: 28px;
    margin-bottom: 25px;
  }
}
</style>
