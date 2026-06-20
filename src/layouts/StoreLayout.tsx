import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { useCartStore } from "@/features/cart/store";

export function StoreLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLogged = useAuthStore((s) => s.isLogged);
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.cantidad, 0));
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Verificar sesión al montar la app
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobile = () => setMobileMenuOpen(false);

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
              <Link to="/" className={`font-label-lg text-label-lg pb-1 border-b-2 transition-all ${isActive("/") ? "text-primary border-primary font-bold" : "text-on-surface-variant border-transparent hover:text-on-surface"}`}>Inicio</Link>
              <Link to="/catalogo" className={`font-label-lg text-label-lg pb-1 border-b-2 transition-all ${isActive("/catalogo") ? "text-primary border-primary font-bold" : "text-on-surface-variant border-transparent hover:text-on-surface"}`}>Catálogo</Link>
              {isLogged && (
                <>
                  <Link to="/mis-pedidos" className={`font-label-lg text-label-lg pb-1 border-b-2 transition-all ${isActive("/mis-pedidos") ? "text-primary border-primary font-bold" : "text-on-surface-variant border-transparent hover:text-on-surface"}`}>Mis Pedidos</Link>
                  <Link to="/mis-direcciones" className={`font-label-lg text-label-lg pb-1 border-b-2 transition-all ${isActive("/mis-direcciones") ? "text-primary border-primary font-bold" : "text-on-surface-variant border-transparent hover:text-on-surface"}`}>Mis Direcciones</Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/carrito" className="relative text-on-surface-variant hover:text-primary transition-all active:scale-95">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>


            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-on-surface-variant hover:text-primary transition-all active:scale-95"
              aria-label="Menú de navegación"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? "close" : "menu"}</span>
            </button>

            {isLogged ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="font-label-sm text-label-sm text-on-surface-variant">{user?.nombre}</span>
                <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex text-on-surface-variant hover:text-primary transition-all active:scale-95">
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
            )}

            {/* Avatar icon — mobile only */}
            {isLogged ? (
              <button onClick={handleLogout} className="md:hidden text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">logout</span>
              </button>
            ) : (
              <Link to="/login" className="md:hidden text-on-surface-variant hover:text-primary transition-all">
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={closeMobile} />
          <aside className="fixed top-20 left-0 z-50 w-72 h-[calc(100vh-5rem)] bg-surface border-r border-outline-variant/30 shadow-2xl md:hidden overflow-y-auto">
            <nav className="flex flex-col gap-1 p-lg">
              <Link to="/" onClick={closeMobile}
                className={`flex items-center gap-3 px-md py-lg rounded-xl font-label-lg text-label-lg transition-all ${isActive("/") ? "text-primary bg-primary-container/30" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}>
                <span className="material-symbols-outlined text-xl">home</span>
                Inicio
              </Link>
              <Link to="/catalogo" onClick={closeMobile}
                className={`flex items-center gap-3 px-md py-lg rounded-xl font-label-lg text-label-lg transition-all ${isActive("/catalogo") ? "text-primary bg-primary-container/30" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}>
                <span className="material-symbols-outlined text-xl">storefront</span>
                Catálogo
              </Link>
              {isLogged && (
                <>
                  <Link to="/mis-pedidos" onClick={closeMobile}
                    className={`flex items-center gap-3 px-md py-lg rounded-xl font-label-lg text-label-lg transition-all ${isActive("/mis-pedidos") ? "text-primary bg-primary-container/30" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}>
                    <span className="material-symbols-outlined text-xl">receipt_long</span>
                    Mis Pedidos
                  </Link>
                  <Link to="/mis-direcciones" onClick={closeMobile}
                    className={`flex items-center gap-3 px-md py-lg rounded-xl font-label-lg text-label-lg transition-all ${isActive("/mis-direcciones") ? "text-primary bg-primary-container/30" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}>
                    <span className="material-symbols-outlined text-xl">location_on</span>
                    Mis Direcciones
                  </Link>
                </>
              )}
              <hr className="border-outline-variant/20 my-md" />
              <Link to="/contacto" onClick={closeMobile}
                className="flex items-center gap-3 px-md py-lg rounded-xl font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all">
                <span className="material-symbols-outlined text-xl">contact_support</span>
                Contacto
              </Link>
              {isLogged && (
                <span className="flex items-center gap-3 px-md py-lg font-label-sm text-label-sm text-on-surface-variant/60">
                  <span className="material-symbols-outlined text-lg">person</span>
                  {user?.nombre}
                </span>
              )}
            </nav>
          </aside>
        </>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center py-xl px-gutter max-w-[1400px] mx-auto">
          <span className="font-headline-md text-headline-md text-primary mb-md md:mb-0">GASTRO LUXURY</span>
          <div className="flex gap-xl text-on-surface-variant font-label-sm text-label-sm">
            <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
            <Link to="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link>
            <Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-md md:mt-0">© 2026 GastroStore. Functional Luxury.</p>
        </div>
      </footer>
    </div>
  );
}
