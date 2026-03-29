import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'E4LOGO.jpeg'],
      manifest: {
        name: 'Efour | Eat, Enjoy, Entertainment',
        short_name: 'Efour',
        description: 'Premium food, fun, and events at Efour Eluru.',
        theme_color: '#FF5E14',
        icons: [
          {
            src: 'E4LOGO.jpeg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'E4LOGO.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      // Proxy API requests during development to avoid CORS issues
      '/api': {
        target: 'https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: {
          '*': 'localhost',
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          'core-3d': ['three', '@react-three/fiber', '@react-three/drei'],
          ui: ['framer-motion', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
