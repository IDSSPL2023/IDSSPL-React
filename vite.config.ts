import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Replaces the Next.js route handler at src/app/api/ai-dashboard/prompt.
      // `secure: false` mirrors that handler's undici dispatcher, which skipped
      // TLS verification because the corporate Fortinet gateway re-signs this
      // upstream's certificate with a CA that isn't in the local trust store.
      '/api/ai-dashboard/prompt': {
        target: 'https://sms-app.appantech.com',
        changeOrigin: true,
        secure: false,
        rewrite: () => '/api/dashboard/sms/prompt',
      },
    },
  },
})
