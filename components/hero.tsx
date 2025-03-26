export default function Header() {
  return (
    <section className="flex flex-col items-center text-center gap-6 py-20">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
        Gestiona tus eventos <span className="text-primary">como un pro</span>
      </h1>

      <p className="text-muted-foreground text-lg max-w-xl">
        Registra ingresos y gastos de cada noche, controla tu beneficio y lleva
        el control de tu promotora de forma sencilla.
      </p>

      <div className="flex gap-4 mt-6">
        <a
          href="/sign-in"
          className="px-5 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition text-sm font-medium"
        >
          Empezar ahora
        </a>
        <a
          href="/protected/cierres"
          className="px-5 py-2 rounded-md border text-sm font-medium hover:bg-muted transition"
        >
          Ver cierres
        </a>
      </div>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-300 to-transparent my-12" />
    </section>
  );
}
