import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // PRODUCTION FIX: Use generateSW strategy for more stable builds
      strategies: 'generateSW',
      manifest: {
        name: 'Novel Master',
        short_name: 'NovelMaster',
        description: 'AI-enhanced writing platform for storytellers',
        theme_color: '#0f0f1a',
        background_color: '#0f0f1a',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // PRODUCTION FIX: Increase cache size limit to 5MB for larger assets
        maximumFileSizeToCacheInBytes: 5000000,
        // PRODUCTION FIX: Skip waiting on update to prevent stale service workers
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.novelmaster\.io\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 86400
              },
              // PRODUCTION FIX: Background sync for failed API requests
              backgroundSync: {
                name: 'api-queue',
                options: {
                  maxRetentionTime: 24 * 60  // 24 hours in minutes
                }
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true
      }
    }
  }
})
