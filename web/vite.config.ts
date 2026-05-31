import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Served from https://alisonchilds.github.io/geographia/ in production, so the
  // build needs the repo name as its base. Dev server stays at root ('/').
  base: command === 'build' ? '/geographia/' : '/',
  plugins: [react()],
  server: {
    // The project lives on a Dropbox/CloudStorage path where native file
    // system events are unreliable, so poll for changes to keep HMR working.
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
}))
