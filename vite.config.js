import { defineConfig } from 'vite';

export default defineConfig({
  base: '/clawmageddon-2/',
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
