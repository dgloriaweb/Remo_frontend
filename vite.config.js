import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const dev_proxy_target = env.VITE_DEV_PROXY_TARGET ?? 'http://localhost:8083'

  return {
    plugins: [vue()],
    server: {
      host: true,
      port: 5175,
      strictPort: true,
      proxy: {
        '/api': {
          target: dev_proxy_target,
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 5175,
      strictPort: true,
    },
  }
})

