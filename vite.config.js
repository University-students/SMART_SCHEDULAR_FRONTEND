import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration: enables React (JSX + fast refresh).
export default defineConfig({
  plugins: [react()],
});
