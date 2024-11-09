import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   host: '0.0.0.0', // Nghe trên tất cả các giao diện mạng
  //   port: 3000,       // Tùy chọn: Chỉ định một cổng       
  // },
  plugins: [react()],
})
