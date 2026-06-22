# Food Store — Cliente (store-app)
## VIDEO TPI : https://drive.google.com/file/d/1ZFp8-i0vOOvbBeB_6OVomRVmfqp7RQS-/view?usp=sharing
Frontend de la tienda para el cliente final. Permite navegar el catálogo, ver el detalle de productos con ingredientes, agregar al carrito y confirmar pedidos.

Este repositorio corresponde únicamente al cliente público del sistema.

Los otros repositorios del sistema son:

- admin-app — panel de administración
- backend — API REST con autenticación JWT

---

# Stack Tecnológico

| Tecnología | Propósito |
|---|---|
| React + TypeScript | Framework principal |
| Vite | Bundler y entorno de desarrollo |
| Tailwind CSS | Estilos utilitarios |
| React Router DOM | Navegación entre rutas |
| TanStack Query | Fetching y cache de datos |
| Axios | Cliente HTTP |
| Zustand | Estado global del carrito |

---

# Cómo levantar el proyecto

Instalar dependencias:

```bash
npm install
```

Crear variables de entorno:

```bash
cp .env.example .env
```

Levantar entorno de desarrollo:

```bash
npm run dev
```

El servidor corre en:

```txt
http://localhost:5173
```

---

# Variables de entorno

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

# Estructura de Carpetas

```txt
src/
├── components/
│   └── ConnectionBadge.tsx
├── features/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── contact/
│   ├── direcciones/
│   ├── orders/
│   ├── pagos/
│   └── products/
├── hooks/
│   └── useOrderStatusWS.ts
├── layouts/
│   └── StoreLayout.tsx
├── router/
│   └── index.tsx
├── shared/
│   ├── api.ts
│   ├── components/
│   ├── currency.ts
│   └── images.ts
├── store/
│   └── wsStore.ts
└── main.tsx
```

---

# Pantallas Requeridas

| Pantalla | Ruta |
|---|---|
| Inicio | / |
| Catálogo | /catalogo |
| Detalle de producto | /producto/:id |
| Carrito | /carrito |
| Login / Registro | /login |
| Checkout | /checkout |
| Pago | /pagar/:id |
| Mis Pedidos | /mis-pedidos |
| Mis Direcciones | /mis-direcciones |
| Contacto | /contacto |

---

# Estado del Proyecto

## ✅ Completado

- Setup inicial con React + TypeScript + Vite
- Catálogo con búsqueda, debounce, filtros por categoría y paginación
- Detalle de producto
- Carrito con badge de cantidad
- Checkout con selección de forma de pago y dirección
- Integración con Mercado Pago (init_point redirect)
- Historial de pedidos con timeline de estados
- WebSocket para actualización en tiempo real de estados
- Gestión de direcciones de entrega
- Autenticación (login/registro)
- Conexión persistente con backend vía Axios + TanStack Query
- Skeleton loaders en todas las pantallas

---

# Convenciones

## Nombrado

| Elemento | Convención |
|---|---|
| Componentes | PascalCase |
| Hooks | useHook |
| Services | nombreService |
| Stores | useStore |
| Types | PascalCase |

---

# Ejemplos

```txt
ProductCard.tsx
useProducts.ts
productService.ts
useCartStore.ts
Product.ts
```

---

# Integrantes

- Rivas Martiniano
- Fracchia Gonzalo
- Scopel Maximo
- Dengra Enzo

# LINK A VIDEO DEMOSTRACIÓN
https://drive.google.com/file/d/18-4ZufOsukykmeYCd8krtd8QTFW80Ayd/view?usp=sharing
