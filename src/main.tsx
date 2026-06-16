import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { RouterProvider } from 'react-router-dom'
import { router } from './router'

import './index.css'

import { initMercadoPago } from '@mercadopago/sdk-react'

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY || '')

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
