import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/agnes': {
        target: 'https://apihub.agnes-ai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/agnes/, ''),
        secure: true
      },
      '/api/dashscope': {
        target: 'https://dashscope.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dashscope/, ''),
        secure: true
      }
    }
  }
})
