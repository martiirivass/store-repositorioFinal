export function ContactPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-gutter py-xl">
      <header className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Contacto</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Estamos para ayudarte. No dudes en comunicarte con nosotros.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
        {/* Info de contacto */}
        <section className="space-y-lg">
          <div className="bg-surface-container-high border border-outline-variant/30 rounded-xl p-xl space-y-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface">Información de contacto</h2>

            <div className="flex items-start gap-md">
              <span className="material-symbols-outlined text-primary text-2xl mt-0.5">location_on</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface">Dirección</p>
                <p className="font-body-md text-body-md text-on-surface-variant">Av. San Martín 1523, Ciudad, Mendoza</p>
              </div>
            </div>

            <div className="flex items-start gap-md">
              <span className="material-symbols-outlined text-primary text-2xl mt-0.5">call</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface">Teléfono</p>
                <p className="font-body-md text-body-md text-on-surface-variant">+54 261 425-6789</p>
              </div>
            </div>

            <div className="flex items-start gap-md">
              <span className="material-symbols-outlined text-primary text-2xl mt-0.5">mail</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface">Email</p>
                <p className="font-body-md text-body-md text-on-surface-variant">contacto@gastrofood.com.ar</p>
              </div>
            </div>

            <div className="flex items-start gap-md">
              <span className="material-symbols-outlined text-primary text-2xl mt-0.5">schedule</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface">Horarios de atención</p>
                <p className="font-body-md text-body-md text-on-surface-variant">Lun a Vie: 09:00 - 23:00</p>
                <p className="font-body-md text-body-md text-on-surface-variant">Sáb: 10:00 - 00:00</p>
                <p className="font-body-md text-body-md text-on-surface-variant">Dom: 11:00 - 22:00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Formulario de contacto visual */}
        <section className="bg-surface-container-high border border-outline-variant/30 rounded-xl p-xl">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">Enviar mensaje</h2>
          <form className="space-y-md" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-xs">Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-xs">Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-xs">Mensaje</label>
              <textarea
                rows={4}
                placeholder="Escribí tu mensaje..."
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-lg rounded-xl font-label-lg text-label-lg font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              Enviar mensaje
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
