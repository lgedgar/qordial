import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({

  // nb. much of this was inspired by
  // https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      //entry: resolve(__dirname, 'lib/main.js'),
      entry: resolve(__dirname, 'lib/index.js'),
      name: 'qordial',
      // the proper extensions will be added
      fileName: 'qordial',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
          'pinia',
          'vue',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          pinia: 'pinia',
          vue: 'Vue',
        },
      },
    },
  },

  plugins: [
    vue(),
  ],
})
