# Food Store — Cliente (store-app)

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
VITE_API_URL=http://localhost:3000
```

---

# Estructura de Carpetas

```txt
src/
├── assets/
├── features/
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types.ts
│   │
│   ├── cart/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types.ts
│
├── shared/
│   ├── ui/
│   └── layout/
│
├── store/
│   └── useCartStore.ts
│
├── router/
│   └── index.tsx
│
├── lib/
│   ├── axios.ts
│   └── queryClient.ts
│
├── hooks/
├── types/
├── utils/
│
└── main.tsx
```

---

# Pantallas Requeridas

| Pantalla | Ruta |
|---|---|
| Listado de productos | / |
| Detalle de producto | /product/:id |
| Carrito | /cart |

---

# Estado del Proyecto

## ✅ Completado

- Setup inicial con React + TypeScript + Vite
- Configuración de Tailwind CSS
- Configuración de React Router
- Configuración de TanStack Query
- Configuración de Axios
- Configuración de Zustand
- Estructura modular por features

---

## 🚧 En desarrollo

- Listado de productos
- Detalle de producto
- Carrito
- Checkout
- Integración con backend

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
