import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        // Proxy /api/v1 to Java Backend
        '/api/v1': {
          target: 'https://vortex-java-core.onrender.com',
          changeOrigin: true,
          secure: false,
        },
        // Proxy /api/ai to Python Backend
        '/api/ai': {
          target: 'https://vortex-service-triage-ml.onrender.com', // Python Backend URL
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/ai/, ''), // Remove /api/ai prefix when sending to backend
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
