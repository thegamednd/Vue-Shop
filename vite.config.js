import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    root: process.cwd(),
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      // AWS Amplify needs global to be defined
      global: 'globalThis',
      // Make environment mode available at runtime
      __APP_ENV__: JSON.stringify(mode),
    },
    server: {
      port: 8082,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production', // Disable sourcemaps in production for security
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            amplify: ['aws-amplify'],
            axios: ['axios']
          }
        }
      }
    }
  }
})