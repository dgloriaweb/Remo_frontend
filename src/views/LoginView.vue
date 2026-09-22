<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const auth_store = useAuthStore()

const email = ref('')
const password = ref('')

const can_submit = computed(() => email.value.trim().length > 0 && password.value.length > 0)

async function on_submit() {
  if (!can_submit.value || auth_store.is_loading) return
  await auth_store.login(email.value, password.value)
}
</script>

<template>
  <main class="login-page">
    <h1>Login</h1>

    <form class="card" @submit.prevent="on_submit">
      <label class="form-field">
        <span>Email</span>
        <input class="form-input form-control-full" v-model="email" type="email" autocomplete="email" />
      </label>

      <label class="form-field">
        <span>Password</span>
        <input
          class="form-input form-control-full"
          v-model="password"
          type="password"
          autocomplete="current-password"
        />
      </label>

      <button class="btn" type="submit" :disabled="!can_submit || auth_store.is_loading">
        {{ auth_store.is_loading ? 'Signing in…' : 'Sign in' }}
      </button>

      <p v-if="auth_store.last_error" class="text-error">{{ auth_store.last_error }}</p>
      <p v-else-if="auth_store.user" class="text-success">Signed in.</p>
    </form>
  </main>
</template>
