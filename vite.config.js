import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/ws/': {
        ws: true,
        target: 'http://127.0.0.1:8888/ws/'
      },
      '/api/': 'http://127.0.0.1:8000/'
    }
  }
});