// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
    target: 'static',
  nitro: {
    output: {
      dir: 'output',
      publicDir: 'output/public',
      serverDir: 'output/server'
    }
  },
  app: {
    head: {
      title: 'FinApp Gokil! - Keuangan Sederhana',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplikasi keuangan sederhana untuk mengelola keuangan pribadi' },
        { name: 'theme-color', content: '#4F46E5' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', href: '/pwa-icon.svg', sizes: 'any', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' }
      ],
      script: [
        { src: 'https://cdn.tailwindcss.com' }
      ]
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  css: [
    '~/assets/css/main.css'
  ],
  build: {
    transpile: ['chart.js']
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'FinApp Gokil! - Keuangan Sederhana',
      short_name: 'FinApp',
      description: 'Aplikasi keuangan sederhana untuk mengelola keuangan pribadi',
      theme_color: '#4F46E5',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false, // Ubah dari true menjadi false untuk menonaktifkan DevTools
      suppressWarnings: false,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  }
})