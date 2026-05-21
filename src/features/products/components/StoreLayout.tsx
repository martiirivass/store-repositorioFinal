import { useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { useCartStore } from "../../../store/cartStore";

export function StoreLayout() {
  const { isLogged, isLoading, user, logout, checkAuth } = useAuthStore();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.cantidad, 0));
  const navigate = useNavigate();

  // Verificar sesión al montar la app
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-lg" />
          <p className="text-on-surface-variant font-body-md">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 glass-effect">
        <div className="flex justify-between items-center h-20 px-gutter max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-12">
            <Link to="/" className="font-display-lg text-display-lg font-bold tracking-tighter text-primary">
              GASTRO
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="font-label-lg text-label-lg text-primary border-b-2 border-primary font-bold pb-1">Inicio</Link>
              <Link to="/catalogo" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors">Catálogo</Link>
              {isLogged && (
                <Link to="/mis-pedidos" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors">Mis Pedidos</Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/carrito" className="relative text-on-surface-variant hover:text-primary transition-all active:scale-95">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {isLogged ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline font-label-sm text-label-sm text-on-surface-variant">{user?.nombre}</span>
                <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-on-surface-variant hover:text-primary transition-all active:scale-95">
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center py-xl px-gutter max-w-[1400px] mx-auto">
          <span className="font-headline-md text-headline-md text-primary mb-md md:mb-0">GASTRO LUXURY</span>
          <div className="flex gap-xl text-on-surface-variant font-label-sm text-label-sm">
            <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
            <Link to="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link>
            <span className="hover:text-primary transition-colors cursor-pointer">Contacto</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-md md:mt-0">© 2024 GastroStore. Functional Luxury.</p>
        </div>
      </footer>
    </div>
  );
}
