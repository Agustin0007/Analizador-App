import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        'react-toastify',
        'react-icons',
        'chart.js',
        'react-chartjs-2'
      ]
    }
  }
});
