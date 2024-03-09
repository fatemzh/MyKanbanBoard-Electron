import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: './', // Assure que les chemins des ressources sont relatifs
  server: {
    port: 3000,
  },
  plugins: [react()],
});
