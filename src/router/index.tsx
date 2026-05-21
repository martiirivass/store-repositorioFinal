import { createBrowserRouter } from "react-router-dom";
import { StoreLayout } from "../features/products/components/StoreLayout";
import { HomePage } from "../features/products/pages/HomePage";
import { CatalogPage } from "../features/products/pages/CatalogPage";
import { CartPage } from "../features/products/pages/CartPage";
import { CheckoutPage } from "../features/products/pages/CheckoutPage";
import { MyOrdersPage } from "../features/products/pages/MyOrdersPage";
import { ClientLoginPage } from "../features/auth/pages/ClientLoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <StoreLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "catalogo", element: <CatalogPage /> },
      { path: "carrito", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "mis-pedidos", element: <MyOrdersPage /> },
    ],
  },
  {
    path: "/login",
    element: <ClientLoginPage />,
  },
]);
