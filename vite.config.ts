import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import VueRouter from 'unplugin-vue-router/vite'
import VueComponents from 'unplugin-vue-components/vite'
import AutoImports from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    //
    VueRouter({
      dts: 'src/typed-router.d.ts',
    }),
    Vue(),
    VueComponents({
      dts: 'src/components.d.ts',
    }),
    AutoImports({
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/utils'],
      vueTemplate: true,
    }),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
