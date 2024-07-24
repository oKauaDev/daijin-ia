import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), svgLoader()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), svgLoader()]
  },
  renderer: {
    assetsInclude: ['**/*.svg'],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          config: resolve(__dirname, 'src/renderer/config.html')
        }
      }
    }
  }
})
