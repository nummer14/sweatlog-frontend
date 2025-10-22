import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  // =======================================================
  // 여기에 server 객체를 추가합니다.
  server: {
    proxy: {
      // '/api'로 시작하는 요청은 전부 백엔드 서버로 프록시됩니다.
      '/api': {
        // 백엔드 서버 주소
        target: 'http://localhost:8080',
        // cross-origin 요청을 허용하기 위해 필요한 설정
        changeOrigin: true,
      },
    },
  },
  // =======================================================
})