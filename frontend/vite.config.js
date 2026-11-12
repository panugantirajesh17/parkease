import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const routesToPrerender = [
  'find',
  'compare',
  'calculator',
  'login',
  'login/driver',
  'login/user',
  'login/operator',
  'login/admin',
  'driver',
  'driver/reservations',
  'driver/active-session',
  'driver/history',
  'driver/vehicles',
  'driver/favorites',
  'driver/notifications',
  'operator',
  'operator/facilities',
  'operator/slots',
  'operator/gate',
  'admin',
  'admin/users',
  'admin/analytics',
  'admin/facilities',
  'admin/slots',
  'admin/gate',
  'slots',
  'confirmation',
  'facilities',
  'about',
  'faq',
  'settings'
];

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-routes-generator',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        const indexPath = path.join(distDir, 'index.html');
        if (!fs.existsSync(indexPath)) return;

        // Copy to 404.html for generic fallback
        fs.copyFileSync(indexPath, path.join(distDir, '404.html'));

        // Generate physical index.html for all client routes so direct URLs never 404 on Vercel
        routesToPrerender.forEach(r => {
          const targetDir = path.join(distDir, r);
          fs.mkdirSync(targetDir, { recursive: true });
          fs.copyFileSync(indexPath, path.join(targetDir, 'index.html'));
        });
        console.log(`[ParkEase Build] Generated physical index.html for ${routesToPrerender.length} SPA routes.`);
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
});
