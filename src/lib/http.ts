import axios from 'axios'

const default_auth_api_base_url = 'http://localhost:8083/api/auth'

export const auth_api_base_url: string =
  (import.meta.env.VITE_AUTH_API_BASE_URL as string | undefined) ?? default_auth_api_base_url

export const auth_http = axios.create({
  baseURL: auth_api_base_url,
  headers: {
    'Content-Type': 'application/json',
  },
})

