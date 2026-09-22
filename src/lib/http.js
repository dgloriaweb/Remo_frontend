import axios from 'axios'

const default_api_base_url = '/api'
const default_db_api_base_url = '/api'

// Auth endpoints (login/logout/etc)
export const api_base_url = import.meta.env.VITE_API_BASE_URL ?? default_api_base_url

// Non-auth “live DB” endpoints (your app-specific API)
export const db_api_base_url = import.meta.env.VITE_DB_API_BASE_URL ?? default_db_api_base_url

export const api_http = axios.create({
  baseURL: db_api_base_url,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const auth_http = axios.create({
  baseURL: api_base_url,
  headers: {
    'Content-Type': 'application/json',
  },
})

