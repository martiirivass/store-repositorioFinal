import { createBrowserRouter } from "react-router-dom";
import { StoreLayout } from "@/layouts/StoreLayout";
import { HomePage } from "@/features/products/pages/HomePage";
import { CatalogPage } from "@/features/products/pages/CatalogPage";
import { ProductDetailPage } from "@/features/products/pages/ProductDetailPage";
import { CartPage } from "@/features/cart/pages/CartPage";
import { CheckoutPage } from "@/features/checkout/pages/CheckoutPage";
import { MyOrdersPage } from "@/features/orders/pages/MyOrdersPage";
import { ClientLoginPage } from "@/features/auth/pages/ClientLoginPage";
import { PagoExitosoPage } from "@/features/pagos/pages/PagoExitosoPage";
import { PagoFallidoPage } from "@/features/pagos/pages/PagoFallidoPage";
import { PagoPendientePage } from "@/features/pagos/pages/PagoPendientePage";
import { PaymentPage } from "@/features/pagos/pages/PaymentPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <StoreLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "catalogo", element: <CatalogPage /> },
      { path: "producto/:id", element: <ProductDetailPage /> },
      { path: "carrito", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "mis-pedidos", element: <MyOrdersPage /> },
      { path: "pago-exitoso", element: <PagoExitosoPage /> },
      { path: "pago-fallido", element: <PagoFallidoPage /> },
      { path: "pago-pendiente", element: <PagoPendientePage /> },
      { path: "pagar/:pedidoId", element: <PaymentPage /> },
    ],
  },
  {
    path: "/login",
    element: <ClientLoginPage />,
  },
]);
