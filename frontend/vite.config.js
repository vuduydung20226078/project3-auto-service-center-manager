import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "antd/dist/antd.css";', // Đảm bảo Ant Design CSS được import
      },
    },
  },
});
