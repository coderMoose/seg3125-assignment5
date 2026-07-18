import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  base: isGitHubPagesBuild ? '/seg3125-assignment1/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})