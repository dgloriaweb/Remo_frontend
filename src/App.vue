<script setup>
import { computed } from 'vue'
import { useAuthStore } from './stores/auth.js'

const auth_store = useAuthStore()
const is_logged_in = computed(() => Boolean(auth_store.user))
</script>

<template>
  <header class="topbar">
    <nav class="topbar-nav">
      <RouterLink class="topbar-link" to="/">Home</RouterLink>

      <RouterLink
        v-if="!is_logged_in"
        class="topbar-link"
        to="/login"
      >
        Login
      </RouterLink>

      <RouterLink
        v-else
        class="topbar-icon-link"
        to="/login"
        aria-label="Logged in"
        title="Logged in"
      >
        <svg class="icon-user" viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4m0 2c-4.42 0-8 2-8 4.5V21h16v-2.5c0-2.5-3.58-4.5-8-4.5"
          />
        </svg>
      </RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
