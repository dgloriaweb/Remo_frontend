import { defineStore } from 'pinia'
import { auth_http } from '../lib/http.js'

const login_path = import.meta.env.VITE_AUTH_LOGIN_PATH ?? '/login'
const register_path = import.meta.env.VITE_AUTH_REGISTER_PATH ?? '/register'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    is_loading: false,
    last_error: null,
  }),
  actions: {
    async login(email, password) {
      this.is_loading = true
      this.last_error = null
      try {
        const response = await auth_http.post(login_path, { email, password })
        const data = response.data

        if (data?.success === false) {
          this.last_error = data?.message ?? 'Login failed'
          return false
        }

        // Some backends only return {success:true}. Keep minimal user info for UI state.
        this.user = data?.user ?? { email }
        return true
      } catch (error) {
        const message =
          error?.response?.data?.message ??
          error?.response?.data?.error ??
          error?.message ??
          'Request failed'
        this.last_error = String(message)
        return false
      } finally {
        this.is_loading = false
      }
    },

    async register(email, password) {
      this.is_loading = true
      this.last_error = null
      try {
        const response = await auth_http.post(register_path, { email, password })
        const data = response.data

        if (data?.success === false) {
          this.last_error = data?.message ?? 'Register failed'
          return false
        }

        this.user = data?.user ?? { email }
        return true
      } catch (error) {
        const message =
          error?.response?.data?.message ??
          error?.response?.data?.error ??
          error?.message ??
          'Request failed'
        this.last_error = String(message)
        return false
      } finally {
        this.is_loading = false
      }
    },
  },
})

