import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-toastify': 'react-toastify',
      'react-icons': 'react-icons',
      'chart.js': 'chart.js',
      'react-chartjs-2': 'react-chartjs-2'
    }
  },
  optimizeDeps: {
    include: ['react-toastify', 'react-icons', 'chart.js', 'react-chartjs-2']
  }
});
