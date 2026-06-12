import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true,
      },
      "^/(pedidos|auth|productos|categorias|ingredientes|direcciones-entrega|admin|unidades-medida|formas-pago|estados-pedido|pagos|uploads)/": {
        target: "http://localhost:8001",
        changeOrigin: true,
      },
    },
  },
})
