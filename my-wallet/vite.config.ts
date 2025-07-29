// import { fileURLToPath, URL } from 'node:url'
// import { VitePWA } from 'vite-plugin-pwa'
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     vueDevTools(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       includeAssets: ['favicon.svg'],
//       manifest: {
//         name: 'Finance App',
//         short_name: 'Finance',
//         icons: [
//           { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
//           { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
//         ],
//         start_url: '/',
//         display: 'standalone',
//         background_color: '#ffffff',
//         theme_color: '#2563eb'
//       }
//     })
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     },
//   },
// })


import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/app/',
  plugins: [
    vue(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})