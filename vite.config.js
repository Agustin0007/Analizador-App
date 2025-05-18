import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        'react-toastify',
        'react-icons',
        'react-icons/fa',
        'react-icons/md',
        'react-icons/bs'
      ]
    }
  },
  resolve: {
    alias: {
      'react-icons': 'react-icons'
    }
  }
});
