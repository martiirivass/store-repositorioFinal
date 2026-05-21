import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

export function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register(nombre, email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-surface-container-lowest">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="relative z-10 w-full max-w-[480px] px-margin-mobile md:px-margin-desktop">
        <div className="glass-card rounded-xl p-xl shadow-2xl">
          <div className="text-center mb-xl">
            <span className="material-symbols-outlined text-primary text-[48px]">restaurant</span>
            <h1 className="font-headline-md text-headline-md text-primary mt-sm">GastroStore</h1>
          </div>
          <div className="mb-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">
              {isRegister ? "Crear cuenta" : "Bienvenido"}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {isRegister ? "Unite a la experiencia gourmet." : "Accedé a tu experiencia gourmet exclusiva."}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-lg">
            {isRegister && (
              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Nombre</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant h-12 px-md rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none w-full"
                  placeholder="Tu nombre" required />
              </div>
            )}
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Correo Electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-surface-container-low border border-outline-variant h-12 px-md rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none w-full"
                placeholder="ejemplo@gastromail.com" required />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="bg-surface-container-low border border-outline-variant h-12 px-md rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none w-full"
                placeholder="••••••••" required />
            </div>
            {error && <p className="text-error font-label-sm text-label-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full h-12 bg-primary-container hover:brightness-110 active:scale-[0.98] transition-all text-white font-bold rounded-lg flex items-center justify-center gap-sm disabled:opacity-50"
            >
              {loading ? "Procesando..." : isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
            </button>
          </form>
          <div className="mt-xl text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              {isRegister ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
              <button onClick={() => { setIsRegister(!isRegister); setError(""); }}
                className="text-primary font-bold hover:underline transition-all">
                {isRegister ? "Iniciar sesión" : "Crear una cuenta"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
