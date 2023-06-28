import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { createStyleImportPlugin } from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),createStyleImportPlugin({
    libs: [
      {
        libraryName: 'zarm',
        esModule: true,
        resolveStyle: (name) => {
          return `zarm/es/${name}/style/css`
        }
      }
    ]
  })],
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        //当遇到 /api 路径时，将其转换成target的值
        target: 'http://api.chennick.wang/api/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/,'') //将 /api 重写为空
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'utils': path.resolve(__dirname, 'src/utils'), // utils 路径
      'config': path.resolve(__dirname, 'src/config')
    }
  }
})
